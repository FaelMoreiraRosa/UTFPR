const { Aluno, Receita, Habilidade } = require('../models');

exports.painel = async (req, res) => {
    try {
        const alunoId = req.session.usuario.id;

        const alunoCompleto = await Aluno.findByPk(alunoId, {
            include: [
                { model: Receita },
                { model: Habilidade }
            ]
        });

        let receitasDoAluno = [];
        let habilidadesDoAluno = [];

        if (alunoCompleto) {
            receitasDoAluno = alunoCompleto.Receitas || alunoCompleto.Receita || [];
            habilidadesDoAluno = alunoCompleto.Habilidades || alunoCompleto.Habilidade || [];
        }

        res.render('pages/aluno-painel', {
            usuarioLogado: req.session.usuario,
            receitas: receitasDoAluno,
            habilidades: habilidadesDoAluno
        });
    } catch (erro) {
        console.error("Erro ao carregar o painel do aluno:", erro);
        res.status(500).send("Erro ao carregar o painel.");
    }
};

exports.novaHabilidadeView = async (req, res) => {
    try {
        const habilidades = await Habilidade.findAll({ order: [['nome', 'ASC']] });
        res.render('pages/aluno-habilidade-nova', { habilidades });
    } catch (erro) {
        console.error("Erro ao carregar habilidades:", erro);
        res.status(500).send("Erro ao carregar a página.");
    }
};

exports.adicionarHabilidade = async (req, res) => {
    const { habilidadeId, nivel } = req.body;
    const idAlunoLogado = req.session.usuario.id;

    try {
        const nivelNum = parseInt(nivel, 10);
        if (!habilidadeId || Number.isNaN(nivelNum) || nivelNum < 0 || nivelNum > 10) {
            return res.status(400).send("Escolha uma habilidade e informe um nível entre 0 e 10.");
        }

        const aluno = await Aluno.findByPk(idAlunoLogado);
        await aluno.addHabilidade(habilidadeId, { through: { nivel: nivelNum } });

        res.redirect('/aluno/painel');
    } catch (error) {
        console.error("Erro ao adicionar habilidade:", error);
        res.status(500).send("Erro ao adicionar habilidade.");
    }
};

exports.atualizarHabilidade = async (req, res) => {
    const { nivel } = req.body;
    const habilidadeId = req.params.id;
    const idAlunoLogado = req.session.usuario.id;

    try {
        const nivelNum = parseInt(nivel, 10);
        if (Number.isNaN(nivelNum) || nivelNum < 0 || nivelNum > 10) {
            return res.status(400).send("O nível deve ser entre 0 e 10.");
        }

        const aluno = await Aluno.findByPk(idAlunoLogado);
        await aluno.addHabilidade(habilidadeId, { through: { nivel: nivelNum } });

        res.redirect('/aluno/painel');
    } catch (error) {
        console.error("Erro ao atualizar habilidade:", error);
        res.status(500).send("Erro ao atualizar habilidade.");
    }
};

exports.removerHabilidade = async (req, res) => {
    try {
        const aluno = await Aluno.findByPk(req.session.usuario.id);
        await aluno.removeHabilidade(req.params.id);
        res.redirect('/aluno/painel');
    } catch (error) {
        console.error("Erro ao remover habilidade:", error);
        res.status(500).send("Erro ao remover habilidade.");
    }
};
