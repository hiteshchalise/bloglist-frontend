
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
          cy.createBlog({ title: 'A very new title', author: 'foo', url: 'www.bar.com' })
        })

        it('a blog can be liked', function () {
          cy.contains('show').click()
          cy.get('button').contains('like').click()
          cy.get('.notification')
            .should('contain', 'Liked a blog')
        })

        it('a blog can be deleted by user that created it', function () {
          cy.contains('show').click()
          cy.log(window.localStorage.getItem('loggedBlogUser'))
          cy.get('button').contains('Remove').click()
          cy.get('.blog-item').should('not.exist')
        })


        it('a blog cannot be deleted by other users', function () {
          const newUser = {
            name: 'New User',
            username: 'NewUsername',
            password: 'NewPassword'
          }

          cy.request('POST', 'http://localhost:3003/api/users', newUser)
          cy.visit('http://localhost:3000')
          cy.login({ username: newUser.username, password: newUser.password })
          cy.contains('show').click()
          cy.get('button').contains('Remove').click()
          cy.get('.blog-item').should('exist')
        })

        it('blogs are ordered based on likes', function () {
          cy.createBlog({ title: 'Blog 2', author: 'author', url: 'www.author.com' })
          cy.createBlog({ title: 'Blog 3', author: 'author', url: 'www.author.com' })
          cy.wait(2000)
          // last child is selected and show button is clicked followed by like button.
          cy.get('.blog-item').eq(2).find('button').contains('show').click()
          cy.get('.blog-item').eq(2).find('button').contains('like').click()
          cy.wait(1000)
          // first child is selected and total like is 1, meaning blog list is
          // sorted by like count
          cy.get('.blog-list').children().first().as('first')
          cy.get('@first').contains('likes 1')
        })
      })
    })
  })
})