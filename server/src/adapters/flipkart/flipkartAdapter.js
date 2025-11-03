const MOCK_ITEMS = Array.from({ length: 10 }).map(
  (_, index) => ({
    id: `flipkart-mock-${index + 1}`,
    marketplace: 'flipkart',
    title: `Flipkart Mock Product ${index + 1}`,
    imageUrl: 'https://rukminim1.flixcart.com/image/placeholder.jpg',
    price: 499 + index * 25,
    rating: 4.1,
    reviews: 120 + index * 10,
    categoryPath: ['Home', 'Mock Category'],
    bestSellerRank: 100 + index,
    sellersCount: 5,
  }),
);

export class FlipkartAdapter {
  async searchProducts() {
    // TODO: Integrate Flipkart Marketplace APIs once partner credentials are provisioned.
    // https://seller.flipkart.com/sell-online/api-docs for live implementation guidance.
    return MOCK_ITEMS;
  }
}

export const flipkartAdapter = new FlipkartAdapter();

