Feature: Auth

  Scenario: I can see my user information
    Given a user logged in as "tester" with password "test1234"
    When getting the user information
    Then he should see the user information
