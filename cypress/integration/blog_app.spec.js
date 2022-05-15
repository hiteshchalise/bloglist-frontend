
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

    describe('when logged in', function () {
      beforeEach(function () {
        cy.login({
          username: 'Username',
          password: 'Password'
        })
      })

      it('a blog can be created', function () {
        const title = 'a new blog'
        const author = 'author'
        const url = 'www.author.com'
        cy.createBlog({ title, author, url })
        cy.get('.notification')
          .should('contain', `A new blog "${title}" by ${author} added.`)
        cy.get('.blog-list')
          .should('have.length', 1)
          .contains(title)
      })

      describe('a blog is added', function () {
        beforeEach(function () {
          cy.createBlog({ title: 'new', author: 'foo', url: 'www.bar.com' })
        })

        it('a blog can be liked', function () {
          cy.contains('show').click()
          cy.get('button').contains('like').click()
          cy.get('.notification')
            .should('contain', 'Liked a blog')
        })
      })
    })
  })
})