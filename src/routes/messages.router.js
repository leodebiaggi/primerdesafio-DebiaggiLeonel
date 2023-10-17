import { Router } from "express";
import { transporter } from "../nodemailer.js";
const router = Router()

router.get('/', async (req, res) => {
    const messageOpt = {
        from: "leodebiaggi@gmail.com", 
        to: "leodebiaggi@gmail.com",
        subject: "TU PEDIDO FUE CONFIRMADO",
        text: "Gracias por tu compra!",
    }
    await transporter.sendMail(messageOpt);
    res.send('mail sent')
})
export default router