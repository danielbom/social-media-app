Feature: Posts

  Scenario: I can see the posts
    Given a user logged in as "tester" with password "test1234"
    When listing the posts
    Then he should see posts

  Scenario: I can create, see, update and delete a post
    Given a user logged in as "tester" with password "test1234"
    When creating a post
    Then he should see the post
    When updating the post
    Then he should see the updated post
    When deleting the post
    Then he should not see the post
