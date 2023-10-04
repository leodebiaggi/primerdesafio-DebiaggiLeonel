import { usersManager } from "../dao/usersManager";

//Crear user en bd
export const createUser = async (req, res) => {
  try {
    const newUser = await usersManager.create(req.body);
    res.status(201).json({ user: newUser });
  } catch (error) {
    res.status(500).json({ error: "Error al intentar generar el usuario" });
  }
};

//Buscar user por nombre
export const findUserByUsername = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await usersManager.findUser(username);
    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(404).json({ message: "El usuario no ha sido encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al intentar buscar el usuario" });
  }
};