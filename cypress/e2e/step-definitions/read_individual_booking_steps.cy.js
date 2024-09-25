import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";


// Given step for the individual booking feature
Given('the booking API endpoint is reachable for individual booking', () => {
  cy.request('GET', 'https://restful-booker.herokuapp.com/ping').then((response) => {
    expect(response.status).to.eq(201);
  });
});

// Request a specific booking by a valid ID
When('I request a booking with a valid ID', () => {
  cy.request('GET', 'https://restful-booker.herokuapp.com/booking').then((response) => {
    const bookingIds = response.body;
    const bookingId = bookingIds[0].bookingid;

    cy.request('GET', `https://restful-booker.herokuapp.com/booking/${bookingId}`).as('getBookingById');
  });
});

// Then step for checking booking details
Then('the booking details should be returned for individual booking', () => {
  cy.get('@getBookingById').then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body).to.have.property('firstname');
    expect(response.body).to.have.property('lastname');
    expect(response.body).to.have.property('totalprice');
    expect(response.body).to.have.property('depositpaid');
    expect(response.body).to.have.property('bookingdates');
  });
});

// Then step for status code
Then('I should get a {int} status code for individual booking', (statusCode) => {
  cy.get('@getBookingById').then((response) => {
    expect(response.status).to.eq(statusCode);
  });
});


