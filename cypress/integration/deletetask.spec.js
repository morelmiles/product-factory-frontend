describe('Deleting product', () => {
    before(() => {
        cy.visit('/')
        cy.get('.ant-row').eq(1).find('button').click()
        cy.url().should('include', '/switch-test-user')
        })
    it('Test Delete Product', () => {
            cy.get('form').find('button').first().should('have.text', 'Sign in')
            cy.get('form').find('span').eq(1).click()
            cy.get('.ant-select-item-option').eq(4).click()
            cy.get('.ant-select-item-option').eq(1).should('not.have.text', 'Select')
            const button = cy.get('form').find('button').first()
            button.should('have.text', 'Sign in')
            button.click()
            cy.get('.ant-message-notice-content').should('have.text', 'User was successfully log in')
            cy.get('.ant-tabs-tab-btn').first().click()
            cy.get('.ant-tabs-tab-btn').first().should('have.text', 'Tasks')
            cy.get('.task-box-title').first().click()
            cy.get('.ant-spin-container').find('.ant-btn').first().contains('Delete').click()
            cy.get('.ant-modal-footer').find('.ant-btn-danger').click()
            cy.get('.ant-message-notice-content').should('have.text', 'Item is successfully deleted!')

        })
})