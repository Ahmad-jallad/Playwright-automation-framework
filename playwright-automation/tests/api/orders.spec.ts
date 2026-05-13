import { expect, test } from '@playwright/test';
import { CreatedOrder, SimpleBooksApi } from '../../src/api/simpleBooksApi';
import apiData from '../../test-data/api-test-data.json';

test.describe.serial('Simple Books API - Auth & Orders', () => {
  let simpleBooksApi: SimpleBooksApi;
  let createdOrder: CreatedOrder;

  test.beforeAll(async () => {
    simpleBooksApi = new SimpleBooksApi();
    await simpleBooksApi.init();
  });

  test.afterAll(async () => {
    await simpleBooksApi.dispose();
  });

  test('TC_API_001 - [POST] Create New Book Order', async () => {
    createdOrder = await simpleBooksApi.createOrder(apiData.bookId, apiData.customerName);

    expect(createdOrder.orderId).toBeTruthy();
    expect(createdOrder.bookId).toBe(apiData.bookId);
    expect(createdOrder.customerName).toBe(apiData.customerName);
  });

  test('TC_API_002 - [GET] Fetch Created Order', async () => {
    const response = await simpleBooksApi.getOrder(createdOrder.token, createdOrder.orderId);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(createdOrder.orderId);
    expect(body.bookId).toBe(createdOrder.bookId);
    expect(body.customerName).toBe(createdOrder.customerName);
  });
});
