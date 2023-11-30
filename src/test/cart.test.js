import supertest from 'supertest';
import chai from 'chai';
import app from '../app.js';

const expect = chai.expect;
const request = supertest(app);

describe('Carritos API', () => {
  it('debería crear un nuevo carrito', async () => {
    const response = await request.post('/api/carts/');
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('cartId');
  });

  it('debería agregar un producto al carrito', async () => {
    const cartId = 'someCartId';
    const productId = 'someProductId';

    const response = await request.post(`/api/carts/${cartId}/product/${productId}`);
    expect(response.status).to.equal(200);
  });

  it('debería eliminar un producto del carrito', async () => {
    const cartId = 'someCartId';
    const productId = 'someProductId';

    const response = await request.delete(`/api/carts/${cartId}/products/${productId}`);
    expect(response.status).to.equal(200);
  });
});
