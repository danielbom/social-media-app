Feature: Comments

  Scenario: I can see the comments
    Given an initial state of the system
    Given a user logged in as "tester" with password "test1234"
    When listing the comments
    Then he should see comments
    Given a final state of the system

  Scenario: I can create, see, update and delete a comment
    Given an initial state of the system
    Given a user logged in as "tester" with password "test1234"
    Given a sample post
    When creating a comment
    Then he should see the comment
    When updating the comment
    Then he should see the updated comment
    when answering the comment
    Then he should see the answer
    When deleting the comment
    Then he should not see the comment
    Then he should delete the sample post
    Given a final state of the system
