from behave import *
from features.lib.common import api

#  Scenario: I can see the comments


@when(u'listing the comments')
def step_impl(context):
    response = api.comments.find_all()
    assert response.status_code == 200
    response = response.json()
    assert 'items' in response
    context.comments = response['items']


@then(u'he should see comments')
def step_impl(context):
    assert hasattr(context, 'comments')
    # assert len(context.comments) > 0


#  Scenario: I can create, see, update and delete a comment

@given(u'a sample post')
def step_impl(context):
    response = api.posts.create({
        # 'title': 'Test Post',
        'content': 'Test Post Body',
    })
    assert response.status_code == 201
    context.post = response.json()
    assert isinstance(context.post, dict)
    assert 'id' in context.post


@when(u'creating a comment')
def step_impl(context):
    response = api.comments.create({
        'content': 'Test comment body',
        'postId': context.post['id'],
    })
    assert response.status_code == 201
    context.comment = response.json()
    assert isinstance(context.comment, dict)
    assert 'id' in context.comment


@then(u'he should see the comment')
def step_impl(context):
    assert hasattr(context, 'comment')


@when(u'updating the comment')
def step_impl(context):
    assert hasattr(context, 'comment')
    id = context.comment['id']
    response = api.comments.update(id, {
        'content': 'Updated comment body',
    })
    assert response.status_code == 200
    context.comment = response.json()
    assert isinstance(context.comment, dict)
    assert 'id' in context.comment
    assert context.comment['id'] == id


@then(u'he should see the updated comment')
def step_impl(context):
    assert hasattr(context, 'comment')
    assert context.comment['content'] == 'Updated comment body'


@when(u'deleting the comment')
def step_impl(context):
    assert hasattr(context, 'comment')
    response = api.comments.remove(context.comment['id'])
    assert response.status_code == 204


@then(u'he should not see the comment')
def step_impl(context):
    assert hasattr(context, 'comment')
    response = api.comments.find_one(context.comment['id'])
    assert response.status_code == 400


@then(u'he should delete the sample post')
def step_impl(context):
    assert hasattr(context, 'post')
    response = api.posts.remove(context.post['id'])
    assert response.status_code == 204
    response = api.posts.find_one(context.post['id'])
    assert response.status_code == 400
