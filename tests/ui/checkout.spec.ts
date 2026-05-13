import { test } from '../fixtures/pages.fixture';
import uiData from '../../test-data/ui-test-data.json';

test.describe('Checkout Tests', () => {
  test('TC_UI_003 - End-to-End Checkout Flow', async ({ loginPage, productsPage, cartPage, checkoutPage }) => {
    await loginPage.goto(uiData.baseUrl);
    await loginPage.login(uiData.validUser.username, uiData.validUser.password);
    await productsPage.expectLoaded();

    const selectedProducts = await productsPage.addTwoMostExpensiveProducts();
    const expectedItemTotal = selectedProducts.reduce((total, product) => total + product.price, 0);

    await productsPage.openCart();
    await cartPage.expectItemsCount(2);
    await cartPage.proceedToCheckout();

    await checkoutPage.fillCheckoutInformation(
      uiData.checkoutCustomer.firstName,
      uiData.checkoutCustomer.lastName,
      uiData.checkoutCustomer.postalCode
    );

    await checkoutPage.expectItemTotal(expectedItemTotal);
    await checkoutPage.finishOrder();
    await checkoutPage.expectOrderCompleted(
      uiData.checkoutMessages.completeHeader,
      uiData.checkoutMessages.completeText
    );
  });
});
