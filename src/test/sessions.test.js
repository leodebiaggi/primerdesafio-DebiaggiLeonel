import supertest from 'supertest';
import chai from 'chai';
import app from '../app.js';

const expect = chai.expect;
const request = supertest(app);

describe('Sesiones API', () => {
  it('debería registrar un nuevo usuario', async () => {
    const newUser = {
      first_name: 'Nuevo',
      last_name: 'Usuario',
      email: 'nuevousuario@test.com',
      age: 18,
      password: '123456789',
    };

    const response = await request.post('/api/sessions/register')
      .send(newUser);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('status', 'success');
  });

  it('debería iniciar sesión con credenciales válidas', async () => {
    const credentials = {
      email: 'usuario@test.com',
      password: '123456789',
    };

    const response = await request.post('/api/sessions/login')
      .send(credentials);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('user');
  });

  it('debería cerrar sesión correctamente', async () => {
    const response = await request.get('/api/sessions/logout');
    expect(response.status).to.equal(200);
  });
});
