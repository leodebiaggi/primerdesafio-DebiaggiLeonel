import { fakerFR as faker } from "@faker-js/faker";


export const generateMockingProducts = () => {
  const mockProducts = {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    //code: FALTA BUSCAR EN LA DOCUMENTACIÓN UN RANDOMIZADOR DE DE CODIGO PARA EL CAMPO CODE QUE DEBE SER RANDOM
    price: faker.commerce.price(),
    stock: faker.number.int(100),
    //status: FALTA BUSCAR EN LA DOCU UN GENERADOR DE STATUS TRUE/FALSE
    category: faker.commerce.department(),
    thumbnails: [faker.image.url()],
  };
  return mockProducts;
};