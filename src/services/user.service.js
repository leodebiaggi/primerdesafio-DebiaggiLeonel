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
    async findUserById(id) {
        try {
            const user = await usersManager.findUserById(id);
            return user;
        } catch (error) {
            throw new Error('Error al intentar encontrar usuario por ID');
        }
    }

    async findAllUsers() {
        try {
            const users = await usersManager.findAllUsers();
            return users;
        } catch (error) {
            throw new Error('Error al intentar obtener todos los usuarios');
        }
    }

    async deleteInactiveUsers(twoDaysAgo) {
        try {
            const deletedUsers = await usersManager.deleteManyInactiveUsers(twoDaysAgo);
            return deletedUsers;
        } catch (error) {
            throw new Error('Error al intentar eliminar usuarios inactivos');
        }
    }

    async deleteUserById(userId) {
        try {
            const deletedUser = await usersManager.deleteUserById(userId);
            return deletedUser;
        } catch (error) {
            throw new Error('Error al intentar eliminar usuario por ID');
        }
    }
}

export { UserService };
