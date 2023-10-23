export default class CustomErrors {
    static generateError(message) {
      const error = new Error(message);
      throw error;
    }
};