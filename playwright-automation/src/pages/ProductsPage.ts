import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export type Product = {
  name: string;
  price: number;
  addButton: Locator;
};

export class ProductsPage extends BasePage {
  readonly pageTitle = this.page.locator('[data-test="title"]');
  readonly inventoryItems = this.page.locator('[data-test="inventory-item"]');
  readonly shoppingCartLink = this.page.locator('[data-test="shopping-cart-link"]');

  constructor(page: Page) {
    super(page);
  }

  async expectLoaded(): Promise<void> {
    await this.expectToHaveURL(/.*inventory.html/);
    await this.expectToHaveText(this.pageTitle, 'Products');
    await this.expectToBeVisible(this.inventoryItems.first());
  }

  async getProducts(): Promise<Product[]> {
    const products: Product[] = [];
    const count = await this.inventoryItems.count();

    for (let index = 0; index < count; index++) {
      const item = this.inventoryItems.nth(index);
      const name = await item.locator('[data-test="inventory-item-name"]').innerText();
      const priceText = await item.locator('[data-test="inventory-item-price"]').innerText();
      const price = Number(priceText.replace('$', ''));
      const addButton = item.getByRole('button', { name: /Add to cart/i });
      products.push({ name, price, addButton });
    }

    return products;
  }

  async addTwoMostExpensiveProducts(): Promise<Product[]> {
    const products = await this.getProducts();
    const twoMostExpensive = products.sort((a, b) => b.price - a.price).slice(0, 2);

    for (const product of twoMostExpensive) {
      await product.addButton.click();
    }

    return twoMostExpensive;
  }

  async openCart(): Promise<void> {
    await this.shoppingCartLink.click();
  }
}
