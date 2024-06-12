Feature: Comments

  Scenario: I can see the comments
    Given a user logged in as "tester" with password "test1234"
    When listing the comments
    Then he should see comments

  Scenario: I can create, see, update and delete a comment
    Given a user logged in as "tester" with password "test1234"
    Given a sample post
    When creating a comment
    Then he should see the comment
    When updating the comment
    Then he should see the updated comment
    When deleting the comment
    Then he should not see the comment
    Then he should delete the sample post
