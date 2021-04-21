describe('registration of user', () => {

    it('Test Registration Page create account', () => {
        cy.visit('http://localhost:3000/switch-test-user', {timeout: 30000})
        const button = cy.get('form').find('button').eq(1)
        button.should('have.text', 'Login with AuthMachine')
        button.click()
        cy.location('host').should('eq', 'ou-am.herokuapp.com')
    })    
})