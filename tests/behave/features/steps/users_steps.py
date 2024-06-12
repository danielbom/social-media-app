from behave import *

from features.lib.common import api

# Scenario: I can see and update the users

@when(u'listing the users')
def step_impl(context):
    response = api.users.find_all()
    assert response.status_code == 200
    response = response.json()
    assert 'items' in response
    context.users = response['items']


@then(u'he should see users')
def step_impl(context):
    assert hasattr(context, 'users')
    assert len(context.users) > 0


@when(u'getting himself by id')
def step_impl(context):
    response = api.users.find_one(context.me['id'])
    assert response.status_code == 200
    context.user = response.json()
    assert 'id' in context.user


@then(u'he should see his own informations')
def step_impl(context):
    assert hasattr(context, 'user')
    assert 'id' in context.user
    assert 'username' in context.user
    assert context.user['username'] == context.username
    assert context.user['id'] == context.me['id']

@when(u'updating the user')
def step_impl(context):
    assert hasattr(context, 'user')
    id = context.user['id']
    response = api.users.update(id, {
        'username': 'tester',
    })
    assert response.status_code == 200
    context.user = response.json()


@then(u'he should see the updated user')
def step_impl(context):
    assert hasattr(context, 'user')
    assert context.user['username'] == 'tester'

# Scenario: I can not create and delete the users

@when(u'trying to create the user')
def step_impl(context):
    response = api.users.create({
        "username": "fake",
        "password": "fake1234",
        "role": "user"
    })
    context.response = response


@then(u'he should be forbidden')
def step_impl(context):
    assert context.response.status_code == 403


@when(u'trying to delete the user')
def step_impl(context):
    response = api.users.remove(context.me['id'])
    context.response = response
