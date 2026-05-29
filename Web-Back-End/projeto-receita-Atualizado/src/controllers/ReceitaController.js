const { Receita, Categoria, Aluno, ReceitaAluno } = require('../models/index');
const Comentario = require('../models/Comentario');
const mongoose = require('mongoose');

function normalizarLista(valor) {
    // Checkbox/select com uma opção chega como string; com várias chega como array.
    if (!valor) {
        return [];
    }

    return Array.isArray(valor) ? valor : [valor];
}

async function usuarioPodeAlterarReceita(receitaId, usuario) {
    if (usuario.isAdmin) {
        return true;
    }

    // Pela regra do projeto, qualquer aluno responsável pode editar a receita.
    const receita = await Receita.findByPk(receitaId, { include: [Aluno] });
    if (!receita) {
        return false;
    }

    const autores = receita.Alunos || [];
    return autores.some((aluno) => aluno.id === usuario.id);
}

exports.novaReceitaView = async (req, res) => {
    try {
        const categorias = await Categoria.findAll({ order: [['nome', 'ASC']] });
        const alunos = await Aluno.findAll({ where: { isAdmin: false }, order: [['nome', 'ASC']] });

        res.render('pages/receita-nova', {
            categorias,
            alunos,
            usuarioLogado: req.session.usuario
        });
    } catch (erro) {
        console.error("Erro ao carregar formulário de receitas:", erro);
        res.status(500).send("Erro ao carregar a página.");
    }
};

exports.cadastrarReceita = async (req, res) => {
    const { nome, descricao, linkExterno, ingredientes, modoPreparo, categoriaId, coautores } = req.body;
    const alunoId = req.session.usuario.id;

    if (!nome || !descricao || !ingredientes || !modoPreparo) {
        return res.status(400).send("Preencha todos os campos obrigatórios da receita.");
    }

    let nomeDaImagem = null;
    if (req.file) {
        nomeDaImagem = req.file.filename;
    }

    try {
        const novaReceita = await Receita.create({
            nome,
            descricao,
            linkExterno,
            ingredientes,
            modoPreparo,
            imagem: nomeDaImagem
        });

        await novaReceita.setCategoria(normalizarLista(categoriaId));

        const coautoresNormalizados = normalizarLista(coautores);
        // Quem está logado e cadastrou a receita fica marcado como criador.
        await novaReceita.addAluno(alunoId, { through: { criador: true } });

        if (coautoresNormalizados.length > 0) {
            await novaReceita.addAlunos(coautoresNormalizados, { through: { criador: false } });
        }

        res.redirect('/aluno/painel');
    } catch (erro) {
        console.error(erro);
        res.status(500).send("Erro ao salvar.");
    }
};

exports.verReceita = async (req, res) => {
    try {
        const idDaReceita = Number(req.params.id);

        const receita = await Receita.findByPk(idDaReceita, {
            include: [Categoria, Aluno]
        });

        if (!receita) {
            return res.status(404).send("Receita não encontrada.");
        }

        // Se o Mongo cair, a página continua abrindo; ela só fica sem comentários.
        const comentarios = mongoose.connection.readyState === 1
            ? await Comentario.find({ receitaId: idDaReceita }).sort({ createdAt: -1 })
            : [];

        res.render('pages/receita-detalhes', { receita, comentarios });
    } catch (erro) {
        console.error("Erro ao abrir a receita:", erro);
        res.status(500).send("Erro ao carregar os detalhes.");
    }
};

exports.excluirReceita = async (req, res) => {
    try {
        const idDaReceita = req.params.id;
        const podeAlterar = await usuarioPodeAlterarReceita(idDaReceita, req.session.usuario);

        if (!podeAlterar) {
            return res.status(403).send("Você não pode excluir esta receita.");
        }

        await Receita.destroy({
            where: { id: idDaReceita }
        });

        res.redirect('/aluno/painel');
    } catch (erro) {
        console.error("Erro ao excluir receita:", erro);
        res.status(500).send("Erro ao excluir a receita.");
    }
};

exports.editarReceitaView = async (req, res) => {
    try {
        const idDaReceita = req.params.id;
        const receita = await Receita.findByPk(idDaReceita, { include: [Categoria, Aluno] });
        const categorias = await Categoria.findAll({ order: [['nome', 'ASC']] });
        const alunos = await Aluno.findAll({ where: { isAdmin: false }, order: [['nome', 'ASC']] });

        if (!receita) {
            return res.status(404).send("Receita não encontrada.");
        }

        const podeAlterar = await usuarioPodeAlterarReceita(idDaReceita, req.session.usuario);
        if (!podeAlterar) {
            return res.status(403).send("Você não pode editar esta receita.");
        }

        res.render('pages/receita-editar', {
            receita,
            categorias,
            alunos,
            usuarioLogado: req.session.usuario
        });
    } catch (erro) {
        console.error("Erro ao carregar edição:", erro);
        res.status(500).send("Erro ao carregar a página.");
    }
};

exports.atualizarReceita = async (req, res) => {
    try {
        const idDaReceita = req.params.id;
        const { nome, descricao, linkExterno, ingredientes, modoPreparo, categoriaId, coautores } = req.body;

        const podeAlterar = await usuarioPodeAlterarReceita(idDaReceita, req.session.usuario);
        if (!podeAlterar) {
            return res.status(403).send("Você não pode atualizar esta receita.");
        }

        if (!nome || !descricao || !ingredientes || !modoPreparo) {
            return res.status(400).send("Preencha todos os campos obrigatórios da receita.");
        }

        const dadosAtualizados = { nome, descricao, linkExterno, ingredientes, modoPreparo };

        if (req.file) {
            dadosAtualizados.imagem = req.file.filename;
        }

        await Receita.update(
            dadosAtualizados,
            { where: { id: idDaReceita } }
        );

        const receitaAtualizada = await Receita.findByPk(idDaReceita);
        if (receitaAtualizada) {
            await receitaAtualizada.setCategoria(normalizarLista(categoriaId));

            // Ao trocar responsáveis, tentamos manter o criador original se ele continuar na receita.
            const criadoresAtuais = await ReceitaAluno.findAll({
                where: {
                    receitaId: idDaReceita,
                    criador: true
                }
            });
            const idsCriadores = criadoresAtuais.map((registro) => registro.alunoId);
            const autores = [req.session.usuario.id].concat(normalizarLista(coautores));
            await receitaAtualizada.setAlunos(autores);

            const criadoresMantidos = idsCriadores.filter((id) => autores.map(String).includes(String(id)));
            // Se removerem o criador antigo, quem editou passa a ser o criador registrado.
            const criadoresParaMarcar = criadoresMantidos.length > 0 ? criadoresMantidos : [req.session.usuario.id];

            await ReceitaAluno.update(
                { criador: true },
                {
                    where: {
                        receitaId: idDaReceita,
                        alunoId: criadoresParaMarcar
                    }
                }
            );
        }

        res.redirect('/aluno/painel');
    } catch (erro) {
        console.error(erro);
        res.status(500).send("Erro ao atualizar.");
    }
};

exports.cadastrarComentario = async (req, res) => {
    try {
        const receitaId = Number(req.params.id);
        const { nomeAutor, texto } = req.body;

        // Comentário é a parte não relacional do projeto, então precisa do Mongo ativo.
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).send("MongoDB não conectado. Configure MONGO_URI para salvar comentários.");
        }

        const receita = await Receita.findByPk(receitaId);
        if (!receita) {
            return res.status(404).send("Receita não encontrada.");
        }

        if (!nomeAutor || !texto) {
            return res.status(400).send("Informe seu nome e comentário.");
        }

        await Comentario.create({
            receitaId,
            nomeAutor,
            texto
        });

        res.redirect(`/receita/${receitaId}`);
    } catch (erro) {
        console.error("Erro ao salvar comentário:", erro);
        res.status(500).send("Erro ao salvar comentário.");
    }
};
