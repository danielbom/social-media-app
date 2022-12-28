from pathlib import Path
from zipfile import ZipFile
import csv
import requests

BASE_URL = 'http://localhost:3000'
DATASET_URL = 'https://www.kaggle.com/datasets/sherinclaudia/sarcastic-comments-on-reddit/download?datasetVersionNumber=1'
TMP_PATH = Path(__file__).parent / 'tmp'
ZIP_PATH = TMP_PATH / 'sarcastic-comments.zip'
CSV_PATH = TMP_PATH / 'train-balanced-sarcasm.csv'

def download():
    if not ZIP_PATH.exists():
        print('[INFO] Zip not founded. Downloading dataset...')
        response = requests.get(DATASET_URL)

        with open(ZIP_PATH) as file:
            file.write(response.content)

def extract():
    if not CSV_PATH.exists():
        print('[INFO] CSV not founded. Unziping dataset...')

        with ZipFile(ZIP_PATH, 'r') as zf:
            zf.extractall(CSV_PATH.parent)

def process():
    with CSV_PATH.open('r') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            r = requests.post(BASE_URL + '/auth/login', json={
                'username': row['author'],
                'password': '123mudar'
            })
            print(r)
            input()
            print('next')


download()
extract()
process()

