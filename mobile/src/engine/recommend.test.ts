import { recommend } from './recommend';

describe('mobile recommend engine', () => {
  it('recommends 5% Prime cashback: ₹2000 -> ₹100, effective ₹1900', () => {
    const { winner } = recommend({
      merchantId: 'amazon',
      amount: 2000,
      cardIds: ['icici-apay', 'axis-flipkart'],
      hasPrime: true,
    });
    expect(winner?.card.id).toBe('icici-apay');
    expect(winner?.totalBenefit).toBe(100);
    expect(winner?.effectiveCost).toBe(1900);
    expect(winner?.status).toBe('verified');
  });

  it('is honest when nothing is eligible', () => {
    const { winner } = recommend({ merchantId: 'other', amount: 500, cardIds: ['icici-apay'], hasPrime: false });
    expect(winner).toBeNull();
  });
});
