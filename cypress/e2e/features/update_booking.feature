Feature: Update an existing booking

  # Scenario 1: Successfully update a booking
  Scenario: Successfully update a booking
    Given a booking with a valid ID exists
    When I update the booking details with new information
    Then the booking should be updated successfully
    And the updated details should include the new firstname, lastname, totalprice, depositpaid, and bookingdates
    And I should get a 200 status code

  # Scenario 2: Attempt to update an expired booking
  Scenario: Attempt to update an expired booking
    Given an expired booking with a valid ID exists
    When I attempt to update the expired booking details
    Then the update should fail
    And I should get a 403 status code

  # Scenario 3: Partially update a booking
  Scenario: Partially update a booking with only firstname and lastname
    Given a booking with a valid ID exists
    When I partially update the booking details with new firstname and lastname
    Then the booking should be updated successfully with the new firstname and lastname
    And the rest of the details should remain unchanged
    And I should get a 200 status code
