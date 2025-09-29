import { faker } from '@faker-js/faker';
import { Order } from '@io/grpc-types';

/**
 * Generate mock orders for a specific user
 * @param userId - The user ID to generate orders for
 * @param count - Number of orders to generate (default: 5)
 * @returns Array of mock Order objects
 */
export function generateMockOrders(userId: string, count = 5): Order[] {
  const orderStatuses = [
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ];

  return Array.from({ length: count }, () => {
    const createdAt = faker.date.past();
    const updatedAt = faker.date.between({ from: createdAt, to: new Date() });

    return {
      id: faker.string.uuid(),
      userId: userId,
      productId: faker.string.uuid(),
      productName: faker.commerce.productName(),
      quantity: faker.number.int({ min: 1, max: 5 }),
      status: faker.helpers.arrayElement(orderStatuses),
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    };
  });
}
