import { Router } from 'express';
import userModel from '../dao/models/user.model.js';
import passport from 'passport';
import bcrypt from 'bcrypt'

const router = Router();

router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

    const exist = await userModel.findOne({ email });

    if (exist) {
        return res.status(400).send({ status: "error", error: "El usuario ya se encuentra registrado" });
    }

    const user = {
        first_name, last_name, email, age, password
    };

    const result = await userModel.create(user);
    res.send({ status: "success", message: "El usuario se ha registrado correctamente" });
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).send({ status: "error", error: "Datos incorrectos" })
    }

    // Validar password hasheada en DB
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Validar password sin hasear
    if (!isPasswordValid && password === user.password) {

    } else if (!isPasswordValid) {
        return res.status(400).send({ status: "error", error: "Datos incorrectos" });
    }

    //Validacion Admin Coder
    if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
        user.role = 'ADMIN';
    }

    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        role: user.role,
    }

    res.redirect('/api/views/products');
})

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send({ status: "error", error: "Error al cerrar la sesion" })
        res.redirect('/api/views/login');
    })
})

//Llamado a Github

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { })

router.get('/githubcallback', passport.authenticate('github', { failureRedicrect: '/login' }), async (req, res) => {
    req.session.user = req.user
    res.redirect('/api/views/profile')
})


export default router;