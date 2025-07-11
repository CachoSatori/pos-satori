import { defineConfig } from 'cypress';
import { attachCustomCommands } from 'cypress-firebase';
import firebase from './cypress/firebase';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    setupNodeEvents(_, config) {
      attachCustomCommands({ Cypress, cy, firebase });
      return config;
    },
  },
});
