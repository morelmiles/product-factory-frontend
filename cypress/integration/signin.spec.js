describe('sign In', () => {

it('Test Sign In Page', () => {
    cy.visit('http://localhost:3000/switch-test-user')
    cy.get('form').find('button').eq(0).should('have.text', 'Sign in')
    cy.get('form').find('span').eq(1).click()
    cy.get('.ant-select-item-option').eq(1).click()
    cy.get('.ant-select-item-option').eq(1).should('not.have.text', 'Select')
    const button = cy.get('form').find('button').eq(0)
    button.should('have.text', 'Sign in')
    button.click()
    cy.location('host').should('eq', 'localhost:3000')
})
})