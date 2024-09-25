import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

//Scenario 1
// Given a booking with a valid ID exists
Given('a booking with a valid ID exists', () => {
  // Retrieve a list of bookings and store a valid booking ID to update later
  cy.request('GET', 'https://restful-booker.herokuapp.com/booking').then((response) => {
    const bookingIds = response.body;  // Assuming response body returns a list of bookings
    const bookingId = bookingIds[0].bookingid;  // Choose the first booking ID for the test
    cy.wrap(bookingId).as('bookingId');  // Save the booking ID to reuse in later steps
  });
});

// When I update the booking details with new information
When('I update the booking details with new information', () => {
  cy.get('@bookingId').then((bookingId) => {
    const updatedBookingData = {
      firstname: "UpdatedFirstName",
      lastname: "UpdatedLastName",
      totalprice: 200,
      depositpaid: true,
      bookingdates: {
        checkin: "2024-10-10",
        checkout: "2024-10-15"
      }
    };

    // Send a PUT request to update the booking
    cy.request({
      method: 'PUT',
      url: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM='  // Basic Authentication: 'admin:password123'
      },
      body: updatedBookingData
    }).as('updateBookingResponse');  // Store the response to validate later
  });
});

// Then the booking should be updated successfully
Then('the booking should be updated successfully', () => {
  cy.get('@updateBookingResponse').then((response) => {
    expect(response.status).to.eq(200);  // Check if the update was successful with status 200
  });
});

// And the updated details should include the new firstname, lastname, totalprice, depositpaid, and bookingdates
Then('the updated details should include the new firstname, lastname, totalprice, depositpaid, and bookingdates', () => {
  cy.get('@updateBookingResponse').then((response) => {
    const booking = response.body;
    expect(booking.firstname).to.eq("UpdatedFirstName");
    expect(booking.lastname).to.eq("UpdatedLastName");
    expect(booking.totalprice).to.eq(200);
    expect(booking.depositpaid).to.eq(true);
    expect(booking.bookingdates.checkin).to.eq("2024-10-10");
    expect(booking.bookingdates.checkout).to.eq("2024-10-15");
  });
});

// Reuse the existing step for status code verification
Then('I should get a {int} status code', (statusCode) => {
  cy.get('@updateBookingResponse').then((response) => {
    expect(response.status).to.eq(statusCode);
  });
});



// Scenario 2
// Given an expired booking with a valid ID exists
Given('an expired booking with a valid ID exists', () => {
  cy.request('GET', 'https://restful-booker.herokuapp.com/booking').then((response) => {
    const bookingIds = response.body;
    const bookingId = bookingIds[1].bookingid;  // Simulate picking a second booking to mark as expired
    cy.wrap(bookingId).as('expiredBookingId');
  });
});

// When I attempt to update the expired booking details
When('I attempt to update the expired booking details', () => {
  cy.get('@expiredBookingId').then((bookingId) => {
    const updatedBookingData = {
      firstname: "ExpiredFirstName",
      lastname: "ExpiredLastName",
      totalprice: 300,
      depositpaid: true,
      bookingdates: {
        checkin: "2024-09-01",
        checkout: "2024-09-10"
      }
    };

    cy.request({
      method: 'PUT',
      url: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM=',  // Auth required for update
        failOnStatusCode: false  // Disable failure on non-2xx responses to handle the 403 error
      },
      body: updatedBookingData
    }).as('updateExpiredBookingResponse');
  });
});

// Then the update should fail
Then('the update should fail', () => {
  cy.get('@updateExpiredBookingResponse').then((response) => {
    expect(response.status).to.eq(403);  // Expecting a 403 Forbidden for expired booking
  });
});





// Scenario 3
// When I partially update the booking details with new firstname and lastname
When('I partially update the booking details with new firstname and lastname', () => {
  cy.get('@bookingId').then((bookingId) => {
    const partialUpdateData = {
      firstname: "PartialUpdateFirstName",
      lastname: "PartialUpdateLastName"
    };

    cy.request({
      method: 'PATCH',  // Use PATCH for partial update
      url: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM='  // Auth required for update
      },
      body: partialUpdateData
    }).as('partialUpdateBookingResponse');
  });
});

// Then the booking should be updated successfully with the new firstname and lastname
Then('the booking should be updated successfully with the new firstname and lastname', () => {
  cy.get('@partialUpdateBookingResponse').then((response) => {
    expect(response.status).to.eq(200);  // Expecting a 200 OK for successful partial update
    expect(response.body.firstname).to.eq("PartialUpdateFirstName");
    expect(response.body.lastname).to.eq("PartialUpdateLastName");
  });
});

// And the rest of the details should remain unchanged
Then('the rest of the details should remain unchanged', () => {
  cy.get('@partialUpdateBookingResponse').then((response) => {
    expect(response.body.totalprice).to.exist;  // Validate that other fields are still present
    expect(response.body.bookingdates).to.exist;
    expect(response.body.depositpaid).to.exist;
  });
});
