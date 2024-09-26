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
    #And I should get a 400 status code



  Scenario: Retrieve all booking IDs
    Given the booking API endpoint is reachable
    When I request all booking IDs
    Then the list of booking IDs should be returned
    And I should get a 200 status code

  Scenario: Retrieve a single booking by ID
    Given the booking API endpoint is reachable
    When I request a booking by ID
    Then the booking details should be returned
    And I should get a 200 status code



  Scenario: Retrieve an individual booking by ID
    Given the booking API endpoint is reachable for individual booking
    When I request a booking with a valid ID
    Then the booking details should be returned for individual booking
    And I should get a 200 status code for individual booking




  Scenario: Delete an existing booking
    Given the delete booking API is available
    And I have an existing booking to delete
    When I delete the booking
    Then the booking should be deleted successfully
    And I should get a 201 status code



  Scenario: Attempt to delete a non-existing booking
    Given the booking delete API is available
    When I attempt to delete a booking that does not exist
    Then I should get a 403 status code
