Feature: Read Booking IDs

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
