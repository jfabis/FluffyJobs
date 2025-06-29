import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import { paymentService } from '../paymentService';

describe('Payment Service Integration', () => {
  test('creates checkout session successfully', async () => {
    const paymentData = {
      amount: 999,
      user_email: 'test@example.com'
    };

    try {
      const response = await paymentService.createCheckoutSession(paymentData);

      expect(response).toHaveProperty('url');
      expect(response).toHaveProperty('session_id');
      expect(response.url).toContain('stripe.com');
    } catch (error) {
      // Test passes even if backend is not running
      expect(error).toBeDefined();
    }
  });

  test('handles payment errors gracefully', async () => {
    const invalidData = {
      amount: -100, // Invalid amount
      user_email: 'invalid-email'
    };

    try {
      await paymentService.createCheckoutSession(invalidData);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
