const express = require('express');
const router = express.Router();

const PublicController = require('../controllers/PublicController');
const AuthController = require('../controllers/AuthController');
const ReceitaController = require('../controllers/ReceitaController');
const AdminController = require('../controllers/AdminController');
const AlunoController = require('../controllers/AlunoController');
const upload = require('../middlewares/upload');

const { Aluno } = require('../models'); 
const bcrypt = require('bcrypt'); 

const { isLogged, isAdmin } = require('../middlewares/auth');

// --- Rotas Públicas ---
router.get('/', PublicController.home);
router.get('/receita/:id', ReceitaController.verReceita);
router.post('/receita/:id/comentarios', ReceitaController.cadastrarComentario);
router.get('/relatorio/habilidades', PublicController.relatorioHabilidades);

// --- Rotas de Autenticação ---
router.get('/login', AuthController.loginView);
router.post('/login', AuthController.login);
router.get('/logout', AuthController.logout);

// --- Rotas do Aluno ---
router.get('/aluno/painel', isLogged, AlunoController.painel); 
router.get('/aluno/receita/nova', isLogged, ReceitaController.novaReceitaView);
router.post('/aluno/receita/nova', isLogged, upload.single('imagem'), ReceitaController.cadastrarReceita);
router.get('/aluno/receita/excluir/:id', isLogged, ReceitaController.excluirReceita);
router.get('/aluno/receita/editar/:id', isLogged, ReceitaController.editarReceitaView);
router.post('/aluno/receita/editar/:id', isLogged, upload.single('imagem'), ReceitaController.atualizarReceita);
router.get('/aluno/habilidade/nova', isLogged, AlunoController.novaHabilidadeView);
router.post('/aluno/habilidade/nova', isLogged, AlunoController.adicionarHabilidade);
router.post('/aluno/habilidade/editar/:id', isLogged, AlunoController.atualizarHabilidade);
router.post('/aluno/habilidade/excluir/:id', isLogged, AlunoController.removerHabilidade);

// --- Rotas do Administrador ---
router.get('/admin/dashboard', isAdmin, AdminController.dashboard);

// Cadastros Admin
router.post('/admin/aluno/novo', isAdmin, AdminController.cadastrarAluno);
router.post('/admin/categoria/nova', isAdmin, AdminController.cadastrarCategoria);
router.post('/admin/habilidade/nova', isAdmin, AdminController.cadastrarHabilidade);
router.post('/admin/aluno/editar/:id', isAdmin, AdminController.editarAluno);
router.post('/admin/categoria/editar/:id', isAdmin, AdminController.editarCategoria);
router.post('/admin/habilidade/editar/:id', isAdmin, AdminController.editarHabilidade);

// Exclusões Admin
router.post('/admin/aluno/excluir/:id', isAdmin, AdminController.excluirAluno);
router.post('/admin/receita/excluir/:id', isAdmin, AdminController.excluirReceita);
router.post('/admin/habilidade/excluir/:id', isAdmin, AdminController.excluirHabilidade);
router.post('/admin/categoria/excluir/:id', isAdmin, AdminController.excluirCategoria);

router.get('/reset-admin', async (req, res) => {    
    try {
        await Aluno.destroy({ where: { email: 'admin@admin.com' } });
        const senhaHash = await bcrypt.hash('123', 10);

        await Aluno.create({
            nome: "Administrador",
            email: "admin@admin.com", 
            senha: senhaHash,
            isAdmin: true 
        });

        res.send("<h1>Admin criado com sucesso!</h1><a href='/login'>Fazer Login</a>");
    } catch (erro) {
        res.status(500).send("Erro: " + erro.message);
    }
});

module.exports = router;
