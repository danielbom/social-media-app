from behave import *
from features.lib.common import api


@when(u'getting the user information')
def step_impl(context):
    response = api.auth.me()
    assert response.status_code == 200
    context.me = response.json()
    assert 'id' in context.me


@then(u'he should see the user information')
def step_impl(context):
    assert hasattr(context, 'me')
    assert 'id' in context.me
    assert 'username' in context.me
    assert context.me['username'] == context.username
