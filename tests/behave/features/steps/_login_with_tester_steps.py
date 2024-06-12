from behave import *
from features.lib.common import api


@given(u'a user logged in as "{username}" with password "{password}"')
def step_impl(context, username, password):
    context.username = username
    context.password = password
    response = api.auth.login({"username": username, "password": password})
    assert response.status_code == 200
    context.login = response.json()
    assert 'access_token' in context.login
    api._config.headers['Authorization'] = f"Bearer {context.login['access_token']}"
