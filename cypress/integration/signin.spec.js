describe('sign In', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080/')
        cy.get('.ant-row').eq(1).find('button').click()
        cy.url().should('include', '/switch-test-user')
        })
    it('Test Sign In Page', () => {
        const button = cy.get('form').find('button').eq(0)
        button.click()
        cy.get('.ant-message-notice-content').should('have.text', 'Please select user before clicking sign in button')
        })
    it('Test Sign In Page by Selecting all required fields', () => {
    cy.get('button[type=submit]').as('submitBtn')
    cy.get('form').find('button').eq(0).should('have.text', 'Sign in')
    cy.get('form').find('span').eq(1).click()
    cy.get('.ant-select-item-option').eq(1).click()
    cy.get('.ant-select-item-option').eq(1).should('not.have.text', 'Select')
    const button = cy.get('form').find('button').eq(0)
    button.should('have.text', 'Sign in')
    button.click()
    cy.get('.ant-message-notice-content').should('have.text', 'User was successfully log in')
    })
})