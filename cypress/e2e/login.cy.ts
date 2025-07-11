describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.viewport('iphone-x');  // Mobile-first
  });

  it('should display login form', () => {
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('contain', 'Login');  // Ajusta texto
  });

  it('should login successfully with valid credentials', () => {
    cy.login('testuser@example.com', 'password123');  // Usa comando custom
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="dashboard-title"]').should('be.visible');
  });

  it('should show error on invalid credentials', () => {
    cy.get('input[type="email"]').type('invalid@example.com');
    cy.get('input[type="password"]').type('wrongpass');
    cy.get('button[type="submit"]').click();
    cy.get('.error-message').should('contain', 'Invalid credentials');
  });

  it('should handle offline mode', () => {
    cy.window().then(win => { win.navigator.onLine = false; });
    cy.visit('/login');
    cy.get('input[type="email"]').should('be.visible');
  });
});
