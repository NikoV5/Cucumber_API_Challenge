import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const apiUrl = "https://restful-booker.herokuapp.com";

Given('the booking API is available', () => {
  cy.request('GET', 'https://restful-booker.herokuapp.com/ping').then((response) => {
    expect(response.status).to.eq(201);
  });
});

When('I create a booking with valid details', () => {
  cy.request({
    method: 'POST',
    url: 'https://restful-booker.herokuapp.com/booking',
    body: {
      firstname: 'John',
      lastname: 'Doe',
      totalprice: 120,
      depositpaid: true,
      bookingdates: {
        checkin: '2023-10-01',
        checkout: '2023-10-10'
      },
      additionalneeds: 'Breakfast'
    }
  }).as('createBooking');
});

// Status code validation
Then('I should get a {int} status code', (statusCode) => {
  cy.get('@createBooking').then((response) => {
    expect(response.status).to.eq(statusCode);
  });
});

Then('the booking should be created successfully', () => {
  cy.get('@createBooking').then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body).to.have.property('bookingid');
  });
});




When('I create a booking with invalid details', () => {
  cy.request({
    method: 'POST',
    url: 'https://restful-booker.herokuapp.com/booking',
    failOnStatusCode: false,  // Allow Cypress to capture error response
    body: {
      firstname: '',  // Invalid: missing first name
      lastname: '',   // Invalid: missing last name
      totalprice: 'abc',  // Invalid: price should be a number
      depositpaid: true,
      bookingdates: {
        checkin: '2023-10-01',
        checkout: '2023-10-10'
      }
    }
  }).as('invalidBooking');
});


Then('the booking creation should fail', () => {
  cy.get('@invalidBooking').then((response) => {
    expect(response.status).to.eq(400);  // Expecting the API to handle invalid input properly
  });
});
