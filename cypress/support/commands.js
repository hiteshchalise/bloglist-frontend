Cypress.Commands.add('login', (credentials) => {
  cy
    .request('POST', 'http://localhost:3003/api/login', credentials)
    .then(({ body }) => {
      localStorage.setItem('loggedBlogUser', JSON.stringify(body))
      cy.visit('http://localhost:3000')
    })

})

Cypress.Commands.add('createBlog', ({ title, author, url }) => {
  cy.contains('create new blog').click()
  cy.get('#title').type(title)
  cy.get('#author').type(author)
  cy.get('#url').type(url)
  cy.get('#blog-submit-button').click()
})
