const express = require('express');
const mysql = require('mysql2'); // Alterado para mysql2
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3001;

// Configuração do banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Mysqljavier3.',  // Substitua pela sua senha
    database: 'nunes_sports',
    port: 3307  // Ou a porta que você está usando
});

// Conectar ao banco de dados
db.connect(err => {
    if (err) throw err;
    console.log('Conectado ao banco de dados!');
});

// Configuração do middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve arquivos estáticos

// Rotas para CRUD
app.get('/produtos', (req, res) => {
    db.query('SELECT * FROM produtos', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/produtos', (req, res) => {
    const { nome, codigo, descricao, preco } = req.body;
    const sql = 'INSERT INTO produtos (nome, codigo, descricao, preco) VALUES (?, ?, ?, ?)';
    db.query(sql, [nome, codigo, descricao, preco], (err, result) => {
        if (err) throw err;
        res.send('Produto adicionado!');
    });
});

app.put('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const { nome, codigo, descricao, preco } = req.body;
    const sql = 'UPDATE produtos SET nome = ?, codigo = ?, descricao = ?, preco = ? WHERE id = ?';
    db.query(sql, [nome, codigo, descricao, preco, id], (err, result) => {
        if (err) throw err;
        res.send('Produto atualizado!');
    });
});

app.delete('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM produtos WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) throw err;
        res.send('Produto deletado!');
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
