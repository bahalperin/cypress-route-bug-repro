const testCase = (description, timeBetweenRequests) => {
    context(description, () => {
      beforeEach(() => {
        cy.server()
        cy.route('https://jsonplaceholder.typicode.com/todos/1', { title: 'foo' }).as('getTodo')
        cy.visit('/', {
          onBeforeLoad: (win) => {
            win.timeBetweenRequestsInMs = timeBetweenRequests
          },
        })
      })
  
      it('can re-mock requests', () => {
        cy.wait('@getTodo')
        cy.route('https://jsonplaceholder.typicode.com/todos/1', { title: 'bar' }).as('getTodo')
        cy.wait('@getTodo')
        cy.route('https://jsonplaceholder.typicode.com/todos/1', { title: 'baz' }).as('getTodo')
        cy.wait('@getTodo')
  
        cy.get('#api-response-list li')
          .first().should('have.text', 'foo')
          .next().should('have.text', 'bar')
          .next().should('have.text', 'baz')
      })
    })
  }
  
  context('cy.request() bug', () => {
    testCase('when requests to the same endpoint happen with pauses in between', 200)
    testCase('when requests to the same endpoint happen with little time in between')
  })
  
  