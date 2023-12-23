import { Router } from 'express';
import userModel from '../data/mongoDB/models/user.model.js';
import { transporter } from "../nodemailer.js";

const router = Router();

// GET Listar usuarios
router.get('/', async (req, res) => {
  try {
    const users = await userModel.find({}, 'first_name last_name email role lastConnection');
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT Actualizar rol usuarios 
router.put('/:uid/updateRole', async (req, res) => {
  const userId = req.params.uid;
  const { role } = req.body;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({ message: 'Rol de usuario actualizado correctamente', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE Depurar usuarios inactivos
router.delete('/deleteInactive', async (req, res) => {
  try {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    console.log('Fecha actual:', twoDaysAgo.toISOString());

    const deletedUsers = await userModel.find({ lastConnection: { $lt: twoDaysAgo.toISOString() } }, 'email lastConnection');
    console.log('Usuarios a eliminar:', deletedUsers);

    const deletedUsersInfo = await userModel.deleteMany({ lastConnection: { $lt: twoDaysAgo.toISOString() } });
    const deletedCount = deletedUsersInfo.deletedCount;

    for (const user of deletedUsers) {
      const messageOpt = {
        from: "leodebiaggi@gmail.com",
        to: user.email,
        subject: "Eliminación de cuenta por inactividad",
        text: "Su cuenta ha sido eliminada por inactividad"
      }
      await transporter.sendMail(messageOpt);
    }

    res.status(200).json({ message: 'Usuarios eliminados por inactividad', deletedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE Eliminar usuarios por ID
router.delete('/delete/:uid', async (req, res) => {
  const userId = req.params.uid;
  try {
    const deletedUser = await userModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json({ message: 'Usuario eliminado correctamente', deletedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;