const { Aluno } = require('../models/index');
const bcrypt = require('bcryptjs');

exports.loginView = (req, res) => {
  res.render('pages/login');
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await Aluno.findOne({ where: { email } });

    if (!usuario) {
      return res.status(401).send("Email não encontrado.");
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).send("Senha incorreta.");
    }

    req.session.usuario = {
      id: usuario.id,
      nome: usuario.nome,
      isAdmin: usuario.isAdmin
    };

    if (usuario.isAdmin) {
      res.redirect('/admin/dashboard');
    } else {
      res.redirect('/aluno/painel');
    }
  } catch (error) {
    res.status(500).send("Erro no servidor.");
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};
