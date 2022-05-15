Cypress.Commands.add('login', (credentials) => {
  cy
    .request('POST', 'http://localhost:3003/api/login', credentials)
    .then(({ body }) => {
      localStorage.setItem('loggedBlogUser', JSON.stringify(body))
      cy.visit('http://localhost:3000')
    })

})


