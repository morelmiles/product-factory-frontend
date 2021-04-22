describe('registration of user', () => {
    before(() => {
        cy.visit('http://localhost:3000/')
        cy.get('.ant-row').eq(1).find('button').eq(1).click()
        cy.url().should('include', '/switch-test-user')
        });
    it('Test Registration Page create account', () => {
        const button = cy.get('form').find('button').eq(1)
        button.should('have.text', 'Login with AuthMachine')
        button.click()
        cy.location('host').should('eq', 'ou-am.herokuapp.com')
        })    
})