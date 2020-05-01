describe("Test Form for Bugs", function() {
    beforeEach(function(){
        cy.visit("http://localhost:3000");
    })

    it("Adds Text to Form", function(){
        cy.get('[data-cy="name"]')
        .type("Harry Potter")
        .clear(); // oops
        cy.get('[data-cy="email"]')
        .type("hpotter@hogwarts.com")
        .should("have.value","hpotter@hogwarts.com");
        cy.get('[data-cy="password"]')
        .type("dracoisaloser")
        .should("have.value","dracoisaloser");
        cy.get('[type="checkbox"]')
        .check()
        .should("be.checked");
        cy.contains('Submit')
        .should('be.disabled');
        cy.get('[data-cy="name"]')
        .type("Harry Potter")
        .should("have.value","Harry Potter");
        cy.contains('Submit')
        .click();
    });
});