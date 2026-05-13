export class RandomUtil {
  static randomString(prefix = 'test'): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  }

  static randomEmail(prefix = 'qa'): string {
    return `${this.randomString(prefix)}@example.com`;
  }

  static randomNumber(max = 99999): number {
    return Math.floor(Math.random() * max);
  }
}
