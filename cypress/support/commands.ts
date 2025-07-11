// Asegura que los comandos custom de Cypress siempre reciban un string
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('input[type="email"]').type(email ?? '');
  cy.get('input[type="password"]').type(password ?? '');
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('logout', () => {
  cy.visit('/logout');  // Ajusta según tu ruta de logout en Logout.tsx
});