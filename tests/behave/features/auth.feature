Feature: Auth

  Scenario: I can see my user information
    Given an initial state of the system
    Given a user logged in as "tester" with password "test1234"
    When getting the user information
    Then he should see the user information
    Given a final state of the system
