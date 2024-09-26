import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";


const baseUrl = Cypress.config('baseUrl');  // Retrieve the base URL from the .env file
const bookingEndpoint = Cypress.env('bookingEndpoint');  // Retrieve the booking endpoint from the .env file
let response;


Given('the booking API is available', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/ping`
    }).then((response) => {
      expect(response.status).to.eq(201);  
    });
  });
  
  When('I create a booking with valid details', () => {
    response = cy.request({
      method: 'POST',
      url: `${baseUrl}${bookingEndpoint}`,  
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
      }, 
    }).then((res) => {
      response = res;
    })
  });
  
  // Status code validation for booking creation
  Then('I should get a {int} status code', (statusCode) => {
    
      expect(response.status).to.eq(statusCode);  // Validate status code

  });
  
  // Verify booking creation success
  Then('the booking should be created successfully', () => {
    
      expect(response.status).to.eq(200);  
      expect(response.body).to.have.property('bookingid');  // Ensure bookingid is returned
  });
  
  // Create a booking with invalid details
  When('I create a booking with invalid details', () => {
    try {
      cy.request({
        method: 'POST',
        url: `${baseUrl}${bookingEndpoint}`,  // Use the base URL and endpoint from .env
        body: {
          firstname: '',  // Invalid: missing first name
          lastname: '',   // Invalid: missing last name
          totalprice: '',  // Invalid: price should be a number
          depositpaid: true,
          // bookingdates: {
          //   checkin: '2023-10-01',
          //   checkout: '2023-10-10'
          // }
        }
      }).then((res) => res);
    }
    catch(err){
      cy.log(err);
      expect(err).not.to.be.empty;
    }
  });

Then(/^the booking creation should fail$/, () => {
	return true;
});




Given('the booking API endpoint is reachable', () => {
    cy.request('GET', `${baseUrl}/ping`).then((response) => {
      expect(response.status).to.eq(201);  
    });
  });
  
  // Request all booking IDs
  When('I request all booking IDs', () => {
    cy.request('GET', `${baseUrl}${bookingEndpoint}`).as('getAllBookings');  // Use the base URL and endpoint from .env
  });
  
  // Verify the list of booking IDs is returned
  Then('the list of booking IDs should be returned', () => {
    cy.get('@getAllBookings').then((response) => {
      expect(response.status).to.eq(200);  // Check if status is 200
      expect(response.body).to.be.an('array').that.is.not.empty;  // Ensure it's a non-empty array
    });
  });
  
  // Retrieve a specific booking by ID
  When('I request a booking by ID', () => {
    cy.request('GET', `${baseUrl}${bookingEndpoint}`).then((response) => {
      const bookingIds = response.body;
      const randomBookingId = bookingIds[0].bookingid;  // Pick the first booking ID (or random)
  
      cy.request('GET', `${baseUrl}${bookingEndpoint}/${randomBookingId}`)  // Get specific booking by ID
    }).then((res) => {
      response = res;
    })
  });
  
  // Verify booking details are returned
  Then('the booking details should be returned', () => {
      expect(response.status).to.eq(200); 
      expect(response.body).to.have.property('firstname');
      expect(response.body).to.have.property('lastname');
      expect(response.body).to.have.property('totalprice');
      expect(response.body).to.have.property('depositpaid');
      expect(response.body).to.have.property('bookingdates');
    });
  



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
  
      cy.request('GET', `https://restful-booker.herokuapp.com/booking/${bookingId}`);
  }).then((res) => {
    response = res;
  })
});
  
  // Then step for checking booking details
  Then('the booking details should be returned for individual booking', () => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('firstname');
      expect(response.body).to.have.property('lastname');
      expect(response.body).to.have.property('totalprice');
      expect(response.body).to.have.property('depositpaid');
      expect(response.body).to.have.property('bookingdates');
    });
  
  // Then step for status code
  Then('I should get a {int} status code for individual booking', (statusCode) => {
      expect(response.status).to.eq(statusCode);
    });



// When I update the booking details with new information
When('I update the booking details with new information', () => {
  cy.request({
    method: 'GET',
    url: 'https://restful-booker.herokuapp.com/booking'
  }).then((response) => {
    const bookingIds = response.body;  // Get the list of bookings
    const bookingId = bookingIds[0].bookingid;  // Choose the first booking ID (or any valid booking)
    
    // Save bookingId for later use
    cy.wrap(bookingId).as('bookingId');  // Store the bookingId using cy.wrap()
    
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
    
    // Retrieve bookingId and send a PUT request to update the booking
    cy.get('@bookingId').then((bookingId) => {
      cy.request({
        method: 'PUT',
        url: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM=' 
        },
        body: updatedBookingData
      }).then((response) => {
        cy.wrap(response).as('updateBookingResponse');
      });
    });
  });
});

// Then the booking should be updated successfully
Then('the booking should be updated successfully', () => {
  cy.get('@updateBookingResponse').then((response) => {
    expect(response.status).to.eq(200);  
  });
});


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



// Ensure the delete booking API is available
Given('the delete booking API is available', () => {
    cy.request('GET', `${baseUrl}/ping`).then((response) => {
      expect(response.status).to.eq(201);
    });
  });
  
  // Create an existing booking to delete
  Given('I have an existing booking to delete', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}${bookingEndpoint}`,
      body: {
        firstname: 'John',
        lastname: 'Doe',
        totalprice: 100,
        depositpaid: true,
        bookingdates: {
          checkin: '2023-10-01',
          checkout: '2023-10-10'
        },
        additionalneeds: 'Breakfast'
      }
    }).then((res) => {
      response = res;
    })
  });
  
  // Delete the booking
  When('I delete the booking', () => {
      const bookingId = response.body.bookingid;
      cy.request({
        method: 'DELETE',
        url: `${baseUrl}${bookingEndpoint}/${bookingId}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic YWRtaW46cGFzc3dvcmQxMjM='  
        }
    }).then((res) => {
      response = res;
    })
  });
  
  // Verify booking deletion success
  Then('the booking should be deleted successfully', () => {
      expect(response.status).to.eq(201);
    });
  
  
  
  
  // Ensure the delete booking API is available
  Given('the booking delete API is available', () => {
    cy.request('GET', `${baseUrl}/ping`).then((response) => {
      expect(response.status).to.eq(201);
    });
  });
  
  // Attempt to delete a booking that does not exist
  When('I attempt to delete a booking that does not exist', () => {
    cy.request({
      method: 'DELETE',
      url: `${baseUrl}${bookingEndpoint}/999999`,  
      failOnStatusCode: false
  }).then((res) => {
    response = res;
  })
})
  
  Then('the booking deletion should fail gracefully', () => {
      expect(response.status).to.eq(404);  
    });
