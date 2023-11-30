import supertest from 'supertest';
import chai from 'chai';
import app from '../app.js';

const expect = chai.expect;
const request = supertest(app);

describe('Productos API', () => {
  it('debería obtener la lista de productos', async () => {
    const response = await request.get('/api/products/');
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('status', 'success');
    expect(response.body).to.have.property('payload').that.is.an('array');
  });

  it('debería obtener un producto por ID', async () => {
    const productId = 'someProductId';
    const response = await request.get(`/api/products/${productId}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('title');
  });

  it('debería crear un nuevo producto con datos válidos', async () => {
    const newProductData = {
      title: 'Nuevo Producto',
      description: 'Descripción del nuevo producto',
      code: 'TST01',
      price: 15000,
      stock: 7,
      category: 'Varios',
      thumbnails: []
    };

    const response = await request.post('/api/products/')
      .send(newProductData);

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('title', newProductData.title);
  });
});
