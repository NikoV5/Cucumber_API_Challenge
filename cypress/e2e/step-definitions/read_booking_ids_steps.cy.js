import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// Ensure the API endpoint is reachable
Given('the booking API endpoint is reachable', () => {
  cy.request('GET', 'https://restful-booker.herokuapp.com/ping').then((response) => {
    expect(response.status).to.eq(201);
  });
});

// Request all booking IDs
When('I request all booking IDs', () => {
  cy.request('GET', 'https://restful-booker.herokuapp.com/booking').as('getAllBookings');
});

// Verify the list of booking IDs is returned
Then('the list of booking IDs should be returned', () => {
  cy.get('@getAllBookings').then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body).to.be.an('array').that.is.not.empty;  // Ensure it's a non-empty array
  });
});

// Retrieve a specific booking by ID
When('I request a booking by ID', () => {
  // Get the list of booking IDs, then request one of them
  cy.request('GET', 'https://restful-booker.herokuapp.com/booking').then((response) => {
    const bookingIds = response.body;
    const randomBookingId = bookingIds[0].bookingid;  // Pick the first booking ID (or random)
    
    cy.request('GET', `https://restful-booker.herokuapp.com/booking/${randomBookingId}`).as('getSingleBooking');
  });
});

// Verify booking details are returned
Then('the booking details should be returned', () => {
  cy.get('@getSingleBooking').then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body).to.have.property('firstname');
    expect(response.body).to.have.property('lastname');
    expect(response.body).to.have.property('totalprice');
    expect(response.body).to.have.property('depositpaid');
    expect(response.body).to.have.property('bookingdates');
  });
});

// Status code validation (can be reused across scenarios)
Then('I should get a {int} status code', (statusCode) => {
  cy.get('@getAllBookings').then((response) => {
    expect(response.status).to.eq(statusCode);
  });
});
