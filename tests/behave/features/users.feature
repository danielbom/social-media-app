Feature: Users

  Scenario: I can see and update the users
    Given an initial state of the system
    Given a user logged in as "tester" with password "test1234"
    When listing the users
    Then he should see users
    When getting the user information 
    When getting himself by id
    Then he should see his own informations
    When updating the user
    Then he should see the updated user
    Given a final state of the system

  Scenario: I can not create and delete the users
    Given an initial state of the system
    Given a user logged in as "tester" with password "test1234"
    When trying to create the user
    Then he should be forbidden
    When getting the user information 
    When trying to delete the user
    Then he should be forbidden
    Given a final state of the system
