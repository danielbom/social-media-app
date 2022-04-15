*** Settings ***
Library     RequestsLibrary
Library     Collections

*** Variable ***
${HOST}         http://localhost:5500

*** Keywords ***
Create API Session
    ${header}=          Create dictionary  Content-Type=application/json
    Create Session      session     ${HOST}  headers=${header}


When Login With
    [Arguments]   ${expected_status}=400  ${data}=
    Create API Session
    ${response}=  POST On Session  session  /Auth/Login  expected_status=${expected_status}  data=${data}
    Set Test Variable   ${response}
    Log  ${response.json()}


When Login With Empty Data
    When Login With


When Login Using Only Username
    When Login With  data={ "username": "user" }


When Login Using Only Password
    When Login With  data={ "password": "123mudar" }


Expect Status ${expected_status} When Login With Username "${username}" And Password "${password}"
    ${data}=  Create Dictionary  username=${username}  password=${password}
    ${data}=  Evaluate  str(${data})
    When Login With  expected_status=${expected_status}  data=${data}

Expect Validation Error When Login With Username "${username}" And Password "${password}"
    Expect Status 400 When Login With Username "${username}" And Password "${password}"


Expect Message Equals  
    [Arguments]  ${message}
    Should Be Equal  ${response.json()['message']}  ${message}


Must Fail With Validation Errors On Fields
    [Arguments]  @{fields}
    Should Be Equal As Integers  ${response.json()['status']}  400
    Should Be Equal  ${response.json()['title']}  One or more validation errors occurred.
    FOR  ${field}  IN  @{fields}
        Should Be Equal  ${response.json()['errors']['${field}'][0]}  The ${field} field is required.
    END


When Login With Username "${username}" And Password "${password}"
    Expect Status 200 When Login With Username "${username}" And Password "${password}"


Should Be Authenticated
    Should Not Be Empty  ${response.json()['token']}
    Should Not Be Empty  ${response.json()['user']}
