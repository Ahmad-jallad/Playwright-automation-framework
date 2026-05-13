import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  readonly firstNameInput = this.page.locator('[data-test="firstName"]');
  readonly lastNameInput = this.page.locator('[data-test="lastName"]');
  readonly postalCodeInput = this.page.locator('[data-test="postalCode"]');
  readonly continueButton = this.page.locator('[data-test="continue"]');
  readonly finishButton = this.page.locator('[data-test="finish"]');
  readonly itemTotalLabel = this.page.locator('[data-test="subtotal-label"]');
  readonly completeHeader = this.page.locator('[data-test="complete-header"]');
  readonly completeText = this.page.locator('[data-test="complete-text"]');

  constructor(page: Page) {
    super(page);
  }

  async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  async expectItemTotal(expectedTotal: number): Promise<void> {
    await expect(this.itemTotalLabel).toContainText(`Item total: $${expectedTotal.toFixed(2)}`);
  }

  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }

  async expectOrderCompleted(header: string, text: string): Promise<void> {
    await expect(this.completeHeader).toHaveText(header);
    await expect(this.completeText).toHaveText(text);
  }
}
