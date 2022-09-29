from fastapi import status

from .database import client, session


def test_register_201(client):
    response = client.post(
        '/auth/register',
        json={'username': 'test', 'password': 'test'},
    )
    assert response.status_code == status.HTTP_201_CREATED
    user = response.json()
    assert user.get('id') is not None
    assert user.get('username') == 'test'
    assert user.get('password') is None
    assert user.get('role') == 'user'


def test_register_409(client):
    response = client.post(
        '/auth/register',
        json={'username': 'admin', 'password': 'admin'},
    )
    assert response.status_code == status.HTTP_409_CONFLICT
    assert response.json().get('detail') == 'Username already exists'


def test_login_200(client):
    response = client.post(
        '/auth/login',
        json={'username': 'admin', 'password': 'admin'},
    )
    assert response.status_code == status.HTTP_200_OK
    auth = response.json()
    assert auth.get('token') is not None


def test_login_404(client):
    response = client.post(
        '/auth/login',
        json={'username': 'unknown', 'password': 'unknown'},
    )
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json().get('detail') == 'User not found'


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
    assert auth.get('token') is not None

    response = client.get(
        '/auth/me', headers={'Authorization': f'Bearer {auth["token"]}'}
    )
    assert response.status_code == status.HTTP_200_OK
    user = response.json()
    assert user.get('id') is not None
    assert user.get('username') == 'admin'
    assert user.get('password') is None
    assert user.get('role') == 'admin'
