const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let tasks = [
    { id: 1, description: 'Comprar pão' },
    { id: 2, description: 'Estudar Node.js' },
    { id: 3, description: 'Fazer exercícios' }
];

//GET /tasks - Listar todas as tarefas
app.get('/tasks', (req, res) => {
    res.status(200).json(tasks);
});

//GET /tasks/:id - Buscar uma tarefa por ID
app.get('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    res.status(200).json(task);
});

//POST /tasks - Cadastrar uma nova tarefa
app.post('/tasks', (req, res) => {
    const newTask = req.body;

    if (!newTask.description) {
        return res.status(400).json({ error: 'A descrição da tarefa é obrigatória' });
    }

    newTask.id = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
    
    tasks.push(newTask);
    res.status(201).json(newTask);
});

//PUT /tasks/:id - Atualizar uma tarefa existente
app.put('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedData = req.body;

    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...updatedData,
        id: id
    };

    res.status(200).json(tasks[taskIndex]);
});

//DELETE /tasks/:id - Remover uma tarefa
app.delete('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    tasks.splice(taskIndex, 1);

    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});