Feature: Create a booking

  Scenario: Create a booking with valid parameters
    Given the booking API is available
    When I create a booking with valid details
    Then the booking should be created successfully
    And I should get a 200 status code

  Scenario: Create a booking with invalid parameters
    Given the booking API is available
    When I create a booking with invalid details
    Then the booking creation should fail
    And I should get a 400 status code
