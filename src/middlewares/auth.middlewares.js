export function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ error: 'Usted no posee los permisos para realizar esta operación.' });
    }
}

export function isUser(req, res, next) {
    if (req.user && req.user.role === 'usuario') {
        next();
    } else {
        res.status(403).json({ error: 'Usted no posee los permisos para realizar esta operación.' });
    }
}

export function isPremium(req, res, next) {
    if (req.user && req.user.role === 'premium') {
        next();
    } else {
        res.status(403).json({ error: 'Usted no posee los permisos para realizar esta operación.' });
    }
}