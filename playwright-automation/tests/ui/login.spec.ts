import { test } from '../fixtures/pages.fixture';
import uiData from '../../test-data/ui-test-data.json';

test.describe('Login Tests', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto(uiData.baseUrl);
  });

  test('TC_UI_001 - Login with valid credentials', async ({ loginPage, productsPage }) => {
    await loginPage.login(uiData.validUser.username, uiData.validUser.password);
    await productsPage.expectLoaded();
  });

  for (const scenario of uiData.invalidLoginScenarios) {
    test(`TC_UI_002 - Invalid login validation - ${scenario.name}`, async ({ loginPage }) => {
      await loginPage.login(scenario.username, scenario.password);
      await loginPage.expectErrorMessage(scenario.expectedError);
      await loginPage.expectToBeVisible(loginPage.errorMessage);
    });
  }
});
