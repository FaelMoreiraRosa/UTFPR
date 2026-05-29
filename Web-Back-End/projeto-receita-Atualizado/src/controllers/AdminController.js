const { Aluno, Categoria, Habilidade, Receita } = require('../models/index');
const bcrypt = require('bcryptjs');

function campoObrigatorio(valor) {
    return typeof valor === 'string' && valor.trim().length > 0;
}

exports.dashboard = async (req, res) => {
    try {
        const alunos = await Aluno.findAll({ order: [['nome', 'ASC']] });
        const receitas = await Receita.findAll({ order: [['nome', 'ASC']] });
        const habilidades = await Habilidade.findAll({ order: [['nome', 'ASC']] });
        const categorias = await Categoria.findAll({ order: [['nome', 'ASC']] });

        res.render('pages/admin-dashboard', {
            usuarioLogado: req.session.usuario || req.user,
            alunos,
            receitas,
            habilidades,
            categorias
        });
    } catch (error) {
        console.error("Erro ao carregar o dashboard:", error);
        res.status(500).send("Erro ao carregar o painel administrativo.");
    }
};

exports.cadastrarAluno = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!campoObrigatorio(nome) || !campoObrigatorio(email) || !campoObrigatorio(senha)) {
        return res.status(400).send("Nome, email e senha são obrigatórios.");
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(senha, salt);

        await Aluno.create({
            nome,
            email,
            senha: senhaCriptografada,
            isAdmin: false
        });

        res.redirect('/admin/dashboard');
    } catch (error) {
        res.status(500).send("Erro ao cadastrar aluno. O email já pode estar em uso.");
    }
};

exports.editarAluno = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!campoObrigatorio(nome) || !campoObrigatorio(email)) {
        return res.status(400).send("Nome e email são obrigatórios.");
    }

    try {
        const aluno = await Aluno.findByPk(req.params.id);
        if (!aluno) {
            return res.status(404).send("Aluno não encontrado.");
        }

        const dados = { nome, email };
        if (campoObrigatorio(senha)) {
            dados.senha = await bcrypt.hash(senha, 10);
        }

        await aluno.update(dados);
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error("Erro ao editar aluno:", error);
        res.status(500).send("Erro ao editar aluno.");
    }
};

exports.cadastrarCategoria = async (req, res) => {
    const { nome } = req.body;
    if (!campoObrigatorio(nome)) {
        return res.status(400).send("Nome da categoria é obrigatório.");
    }

    try {
        await Categoria.create({ nome });
        res.redirect('/admin/dashboard');
    } catch (error) {
        res.status(500).send("Erro ao cadastrar categoria.");
    }
};

exports.editarCategoria = async (req, res) => {
    const { nome } = req.body;
    if (!campoObrigatorio(nome)) {
        return res.status(400).send("Nome da categoria é obrigatório.");
    }

    try {
        await Categoria.update({ nome }, { where: { id: req.params.id } });
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error("Erro ao editar categoria:", error);
        res.status(500).send("Erro ao editar categoria.");
    }
};

exports.cadastrarHabilidade = async (req, res) => {
    const { nome } = req.body;
    if (!campoObrigatorio(nome)) {
        return res.status(400).send("Nome da habilidade é obrigatório.");
    }

    try {
        await Habilidade.create({ nome });
        res.redirect('/admin/dashboard');
    } catch (erro) {
        console.error("Erro ao cadastrar habilidade:", erro);
        res.status(500).send("Erro ao cadastrar habilidade.");
    }
};

exports.editarHabilidade = async (req, res) => {
    const { nome } = req.body;
    if (!campoObrigatorio(nome)) {
        return res.status(400).send("Nome da habilidade é obrigatório.");
    }

    try {
        await Habilidade.update({ nome }, { where: { id: req.params.id } });
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error("Erro ao editar habilidade:", error);
        res.status(500).send("Erro ao editar habilidade.");
    }
};

exports.excluirAluno = async (req, res) => {
    try {
        const aluno = await Aluno.findByPk(req.params.id);
        if (!aluno) {
            return res.status(404).send("Aluno não encontrado.");
        }

        if (aluno.isAdmin) {
            return res.status(403).send("Não é permitido excluir administrador.");
        }

        await aluno.destroy();
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error("Erro ao excluir aluno:", error);
        res.status(500).send("Erro ao excluir aluno.");
    }
};

exports.excluirReceita = async (req, res) => {
    try {
        await Receita.destroy({ where: { id: req.params.id } });
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error("Erro ao excluir receita:", error);
        res.status(500).send("Erro ao excluir receita.");
    }
};

exports.excluirHabilidade = async (req, res) => {
    try {
        await Habilidade.destroy({ where: { id: req.params.id } });
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error("Erro ao excluir habilidade:", error);
        res.status(500).send("Erro ao excluir habilidade.");
    }
};

exports.excluirCategoria = async (req, res) => {
    try {
        await Categoria.destroy({ where: { id: req.params.id } });
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error("Erro ao excluir categoria:", error);
        res.status(500).send("Erro ao excluir categoria.");
    }
};
