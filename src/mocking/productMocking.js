import { fakerFR as faker } from "@faker-js/faker";


export const generateMockingProducts = () => {
  const mockProducts = {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    stock: faker.number.int(100),
    category: faker.commerce.department(),
    thumbnails: [faker.image.url()],
  };
  return mockProducts;
};