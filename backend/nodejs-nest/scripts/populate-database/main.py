from pathlib import Path
from zipfile import ZipFile
import csv
import requests

BASE_URL = "http://localhost:3000"
TMP_PATH = Path(__file__).parent / "tmp"
ZIP_PATH = TMP_PATH / "sarcastic-comments.zip"
CSV_PATH = TMP_PATH / "train-balanced-sarcasm.csv"
SKIP_ROWS = 266277


class ApiClient:
    def __init__(self) -> None:
        self.headers = {}

    def login(self, username: str, password: str):
        return requests.post(
            BASE_URL + "/auth/login",
            json={"username": username, "password": password},
        )

    def register(self, username: str, password: str):
        return requests.post(
            BASE_URL + "/auth/register",
            json={"username": username, "password": password},
        )

    def create_post(self, content: str):
        return requests.post(
            BASE_URL + "/posts", json={"content": content}, headers=self.headers
        )

    def create_comment(self, content: str, post_id: str):
        return requests.post(
            BASE_URL + "/comments",
            json={"content": content, "postId": post_id},
            headers=self.headers,
        )


def create_temp_folder():
    if not TMP_PATH.exists():
        print("[INFO] Directory tmp created!")
        TMP_PATH.mkdir()
    else:
        print("[INFO] Directory tmp already created.")


def extract():
    if not ZIP_PATH.exists():
        print("[ERROR] ZIP not founded!")
        exit(1)

    if not CSV_PATH.exists():
        print("[INFO] CSV not founded. Unziping dataset...")
        with ZipFile(ZIP_PATH, "r") as zf:
            zf.extractall(CSV_PATH.parent)
    else:
        print("[INFO] CSV founded.")


def process():
    tokens = {}
    api = ApiClient()

    # Login with admin
    r = api.login(username="admin", password="senh@zona")
    data = r.json()
    tokens["admin"] = data["token"]

    with CSV_PATH.open("r") as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for i, row in enumerate(csv_reader):
            if i < SKIP_ROWS:
                continue

            if len(row["comment"]) >= 256:
                continue

            if len(row["parent_comment"]) >= 256:
                continue

            print(f'[INFO] Add post {i}: {row["author"]}')

            # Create post with admin
            api.headers["Authorization"] = f"Bearer {tokens['admin']}"
            r = api.create_post(row["parent_comment"])

            if r.status_code != 201:
                continue

            data = r.json()
            post_id = data["id"]

            if row["author"] not in tokens:
                # Try register the author
                r = api.register(username=row["author"], password="123mudar")
                if r.status_code != 201:
                    continue

                # Login with author
                r = api.login(username=row["author"], password="123mudar")
                data = r.json()
                tokens[row["author"]] = data["token"]

            api.headers["Authorization"] = f"Bearer {tokens[row['author']]}"

            # Add comment with author
            api.create_comment(content=row["comment"], post_id=post_id)


create_temp_folder()
extract()
process()
