import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartItems = this.page.locator('[data-test="inventory-item"]');
  readonly checkoutButton = this.page.locator('[data-test="checkout"]');

  constructor(page: Page) {
    super(page);
  }

  async expectItemsCount(count: number): Promise<void> {
    await expect(this.cartItems).toHaveCount(count);
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
