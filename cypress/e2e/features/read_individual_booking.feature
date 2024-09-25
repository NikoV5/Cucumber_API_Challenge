Feature: Read Individual Booking

  Scenario: Retrieve an individual booking by ID
    Given the booking API endpoint is reachable for individual booking
    When I request a booking with a valid ID
    Then the booking details should be returned for individual booking
    And I should get a 200 status code for individual booking
