describe('Add task', () => {
    
    it('Test Create Task', () => {
        cy.visit('/')
        cy.get('.ant-row').eq(1).find('button').click()
        cy.url().should('include', '/switch-test-user')
        cy.get('form').find('button').first().should('have.text', 'Sign in')
        cy.get('form').find('span').eq(1).click()
        cy.get('.ant-select-item-option').eq(1).click()
        cy.get('.ant-select-item-option').eq(1).should('not.have.text', 'Select')
        const button = cy.get('form').find('button').first()
        button.contains('Sign in')
        button.click()
        cy.get('.ant-message-notice-content').should('have.text', 'User was successfully log in')
        cy.get('.ant-tabs-tab-btn').eq(1).click()
        cy.get('.ant-card-body').contains('AuthMachine').click()
        // cy.wait(5000)
        cy.get('li').eq(1).click()
        cy.wait(5000)
        cy.get('button').eq(1).contains('Add new initiative').click()
        cy.get('.ant-input').type('test')
        cy.get('.ant-input').should('not.have.text', ' ')
        cy.get('.rdw-editor-main').type('testing demo')
        cy.get('.rdw-editor-main').should('not.have.text', ' ')
        //cy.get('.ant-select-selection-item').type('{enter}')
        cy.get('.ant-select-selection-item').contains('Active').click()
        cy.get('.ant-modal-footer').find('button').contains('Add').click()
        
        cy.get('.ant-message-notice-content').should('have.text', 'Initiative is created successfully!')

        
    })
})