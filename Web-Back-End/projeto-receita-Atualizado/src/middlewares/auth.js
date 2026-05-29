module.exports = {
  isLogged: (req, res, next) => {
    if (req.session.usuario) {
      return next();
    }
    return res.redirect('/login');
  },

  isAdmin: (req, res, next) => {
    if (req.session.usuario && req.session.usuario.isAdmin) {
      return next();
    }
    return res.status(403).send("Acesso negado. Apenas administradores.");
  }
};