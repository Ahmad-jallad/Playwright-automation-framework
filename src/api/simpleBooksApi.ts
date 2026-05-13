import { APIRequestContext, expect, request } from '@playwright/test';
import apiData from '../../test-data/api-test-data.json';
import { RandomUtil } from '../utils/random.util';

export type CreatedOrder = {
  token: string;
  orderId: string;
  bookId: number;
  customerName: string;
};

export class SimpleBooksApi {
  private apiContext?: APIRequestContext;

  async init(): Promise<void> {
    this.apiContext = await request.newContext({ baseURL: apiData.baseUrl });
  }

  async dispose(): Promise<void> {
    await this.apiContext?.dispose();
  }

  private get context(): APIRequestContext {
    if (!this.apiContext) throw new Error('API context is not initialized. Call init() first.');
    return this.apiContext;
  }

  async generateToken(): Promise<string> {
    const response = await this.context.post('/api-clients/', {
      data: {
        clientName: `${apiData.clientName} ${RandomUtil.randomNumber()}`,
        clientEmail: RandomUtil.randomEmail('simple-books-client')
      }
    });

    await expect(response).toBeOK();
    const body = await response.json();
    expect(body.accessToken).toBeTruthy();
    return body.accessToken;
  }

  async createOrder(bookId = apiData.bookId, customerName = apiData.customerName): Promise<CreatedOrder> {
    const token = await this.generateToken();
    const response = await this.context.post('/orders', {
      headers: { Authorization: `Bearer ${token}` },
      data: { bookId, customerName }
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.created).toBe(true);
    expect(body.orderId).toBeTruthy();

    return { token, orderId: body.orderId, bookId, customerName };
  }

  async getOrder(token: string, orderId: string) {
    return this.context.get(`/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}
