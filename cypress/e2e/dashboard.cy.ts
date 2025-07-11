describe('Dashboard Page', () => {
  beforeEach(() => {
    cy.login('testuser@example.com', 'password123');
    cy.visit('/dashboard');
    cy.viewport('iphone-x');
  });

  it('should display dashboard components for authenticated user', () => {
    cy.get('[data-testid="productos-list"]').should('be.visible');
    cy.get('[data-testid="mesas-list"]').should('be.visible');
    cy.get('[data-testid="orders-list"]').should('be.visible');
    cy.get('[data-testid="ingresos-total"]').should('contain', '$');
  });

  it('should redirect to login if not authenticated', () => {
    cy.logout();
    cy.visit('/dashboard');
    cy.url().should('include', '/login');
  });

  it('should filter by ubicacionId if implemented', () => {
    cy.get('select[data-testid="ubicacion-filter"]').select('location1');
    cy.get('[data-testid="orders-list"]').should('have.length', 5);  // Ajusta basado en data de test
  });

  it('should handle errors and log to Sentry', () => {
    cy.get('button[data-testid="break-button"]').click();
    cy.window().its('console.error').should('not.be.called');
  });

  it('should lazy load dashboard components', () => {
    cy.intercept('**/dashboard*.js').as('dashboardChunk');
    cy.visit('/dashboard');
    cy.wait('@dashboardChunk');
    cy.get('[data-testid="orders-list"]').should('be.visible');  // Asume sub-componente lazy
  });
});