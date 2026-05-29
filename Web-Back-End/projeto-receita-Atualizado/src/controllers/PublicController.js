const { Receita, Categoria, Aluno, Habilidade } = require('../models');

exports.home = async (req, res) => {
    try {
        const categoriaId = req.query.categoria;
        const categorias = await Categoria.findAll({ order: [['nome', 'ASC']] });

        // Começa trazendo tudo; se vier categoria na URL, o include vira o filtro.
        const filtros = {
            include: [Categoria, Aluno],
            order: [['nome', 'ASC']]
        };

        if (categoriaId) {
            filtros.include = [
                {
                    model: Categoria,
                    where: { id: categoriaId }
                },
                Aluno
            ];
        }

        const receitas = await Receita.findAll(filtros);

        res.render('pages/home', {
            receitas,
            categorias,
            categoriaSelecionada: categoriaId || ''
        });
    } catch (erro) {
        console.error("Erro ao carregar a home:", erro);
        res.status(500).send("Erro ao carregar a página inicial.");
    }
};

exports.relatorioHabilidades = async (req, res) => {
    try {
        const totalAlunos = await Aluno.count({ where: { isAdmin: false } });
        // required: false mantém habilidades sem alunos no relatório, aparecendo com 0%.
        const habilidades = await Habilidade.findAll({
            include: [{
                model: Aluno,
                through: { attributes: ['nivel'] },
                where: { isAdmin: false },
                required: false
            }],
            order: [['nome', 'ASC']]
        });

        const relatorio = habilidades.map((habilidade) => {
            const alunos = habilidade.Alunos || [];
            const quantidade = alunos.length;
            // Evita divisão por zero quando ainda não existe aluno cadastrado.
            const proporcao = totalAlunos > 0 ? Math.round((quantidade / totalAlunos) * 100) : 0;

            return {
                id: habilidade.id,
                nome: habilidade.nome,
                quantidade,
                totalAlunos,
                proporcao
            };
        });

        res.render('pages/relatorio-habilidades', { relatorio, totalAlunos });
    } catch (erro) {
        console.error("Erro ao carregar relatório de habilidades:", erro);
        res.status(500).send("Erro ao carregar o relatório.");
    }
};
