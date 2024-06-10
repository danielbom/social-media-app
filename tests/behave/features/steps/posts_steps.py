from behave import *

from features.lib.common import api


@when(u'listing the posts')
def step_impl(context):
    response = api.posts.find_all()
    assert response.status_code == 200
    response = response.json()
    assert 'items' in response
    context.posts = response['items']


@then(u'he should see posts')
def step_impl(context):
    assert hasattr(context, 'posts')
    # assert len(context.posts) > 0


@when(u'creating a post')
def step_impl(context):
    response = api.posts.create({
        'content': 'Test post body',
    })
    assert response.status_code == 201
    context.post = response.json()
    assert isinstance(context.post, dict)
    assert 'id' in context.post


@then(u'he should see the post')
def step_impl(context):
    assert hasattr(context, 'post')


@when(u'deleting the post')
def step_impl(context):
    assert hasattr(context, 'post')
    response = api.posts.remove(context.post['id'])
    assert response.status_code == 204


@then(u'he should not see the post')
def step_impl(context):
    assert hasattr(context, 'post')
    response = api.posts.find_one(context.post['id'])
    assert response.status_code == 400
