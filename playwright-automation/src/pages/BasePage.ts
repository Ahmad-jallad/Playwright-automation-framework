import { expect, Locator, Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async click(locator: Locator): Promise<void> {
    await locator.click();
  }

  async fill(locator: Locator, value: string): Promise<void> {
    await locator.fill(value);
  }

  async expectToBeVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  async expectToHaveText(locator: Locator, text: string | RegExp): Promise<void> {
    await expect(locator).toHaveText(text);
  }

  async expectToHaveURL(url: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(url);
  }

  async wait(timeout: number): Promise<void> {  
    await this.page.waitForTimeout(timeout);
  }

  async getNumberFromText(locator: Locator): Promise<number> {
    const text = await locator.innerText();
    const number = text.match(/\d+(\.\d+)?/);
    if (!number) throw new Error(`No number found in text: ${text}`);
    return Number(number[0]);
  }
}
