from fastapi import status

from server.errors import Errors
from tests.database import client


def test_register_201(client):
    response = client.post(
        '/auth/register',
        json={'username': 'test', 'password': 'test'},
    )
    assert response.status_code == status.HTTP_201_CREATED
    token = response.json()
    assert token.get('access_token') is not None
    assert token.get('refresh_token') is not None
    assert token.get('token_type') == 'bearer'


def test_register_400(client):
    response = client.post(
        '/auth/register',
        json={'username': 'admin', 'password': 'admin'},
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json().get('message') == Errors.USER_ALREADY_EXISTS.value


def test_login_200(client):
    response = client.post(
        '/auth/login',
        json={'username': 'admin', 'password': 'admin'},
    )
    assert response.status_code == status.HTTP_200_OK
    auth = response.json()
    assert auth.get('access_token') is not None


def test_login_400(client):
    response = client.post(
        '/auth/login',
        json={'username': 'unknown', 'password': 'unknown'},
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json().get('message') == Errors.INVALID_CREDENTIALS.value


def test_me_401(client):
    response = client.get('/auth/me')
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_me_200(client):
    response = client.post(
        '/auth/login',
        json={'username': 'admin', 'password': 'admin'},
    )
    assert response.status_code == status.HTTP_200_OK
    auth = response.json()
    token = auth.get('access_token')
    assert token is not None

    response = client.get(
        '/auth/me',
        headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == status.HTTP_200_OK
    user = response.json()
    assert user.get('id') is not None
    assert user.get('username') == 'admin'
    assert user.get('password') is None
    assert user.get('role') == 'admin'
