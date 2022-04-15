*** Settings ***
Library     RequestsLibrary
Library     Collections

Resource     ../implementations/Auth.robot

*** Variable ***
${HOST}         http://localhost:5500


*** Test Cases ***
Login without body must fails
    [tags]  Auth
    When Login With Empty Data
    Must Fail With Validation Errors On Fields  body


Login with empty body must fails
    [tags]  Auth
    When Login With  data={}
    Must Fail With Validation Errors On Fields  Username  Password


Login with only username must fails
    [tags]  Auth
    When Login Using Only Username
    Must Fail With Validation Errors On Fields  Password

Login with only password must fails
    [tags]  Auth
    When Login Using Only Password
    Must Fail With Validation Errors On Fields  Username


Login with nonexistent user must fails
    [tags]  Auth
    Expect Status 404 When Login With Username "userx" And Password "123mudar"
    Expect Message Equals  User not found


Login with invalid password must fails
    [tags]  Auth
    Expect Status 401 When Login With Username "user" And Password "123mudarx"
    Expect Message Equals  Invalid password


Login with valid data must works!
    [tags]  Auth
    When Login With Username "user" And Password "123mudar"
    Should Be Authenticated
