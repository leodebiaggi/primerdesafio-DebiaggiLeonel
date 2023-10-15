import { UserDAO } from '../data/DAOs/user.dao.js';

class UserService {
    constructor() {
        this.userDAO = new UserDAO();
    }

    async createUser(user) {
        try {
            return await this.userDAO.createUser(user);
        } catch (error) {
            throw new Error('Error al crear un usuario: ' + error.message);
        }
    }

    async findUserByUsername(username) {
        try {
            return await this.userDAO.findUserByUsername(username);
        } catch (error) {
            throw new Error('Error al buscar un usuario por nombre de usuario: ' + error.message);
        }
    }
}

export { UserService };
