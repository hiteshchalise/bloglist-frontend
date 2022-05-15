
describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('log in to application')
    cy.get('.username-input')
    cy.get('.password-input')
    cy.get('.submit-button')
  })

  describe('Login', function () {
    beforeEach(function () {
      cy.request('POST', 'http://localhost:3003/api/testing/reset')
      const user = {
        name: 'User Name',
        username: 'Username',
        password: 'Password'
      }

      cy.request('POST', 'http://localhost:3003/api/users', user)
      cy.visit('http://localhost:3000/')
    })

    it('succeeds with right credentials', function () {
      cy.get('#username').type('Username')
      cy.get('#password').type('Password')
      cy.get('.submit-button').click()

      cy.contains('User Name logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('Username')
      cy.get('#password').type('wrongPassword')
      cy.get('.submit-button').click()
      cy.get('.notification').should('have.css', 'color', 'rgb(255, 0, 0)')
      cy.contains('Wrong Credentials')
    })
  })
})