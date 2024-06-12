from behave import *

from features.lib.common import api


@given(u'an initial state of the system')
def step_impl(context):
    response = api.tests.tear_up()
    assert response.status_code == 201


@given(u'a final state of the system')
def step_impl(context):
    response = api.tests.tear_down()
    assert response.status_code == 201
