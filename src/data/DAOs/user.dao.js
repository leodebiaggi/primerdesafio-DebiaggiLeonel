import userModel from "../mongoDB/models/user.model.js"

class UserDAO {
    async createUser(user) {
        return userModel.create(user);
    }

    async findUserByUsername(username) {
        return userModel.findOne({ username });
    }
}

export { UserDAO };
