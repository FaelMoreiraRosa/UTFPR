const path = require('path');
const express = require('express');

const app = express();
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.get("/cadastro", function (req, res) {
    res.sendFile(path.join(__dirname + '/cadastro.html'));
});

app.listen(8081, function () {
    console.log("Servidor no http://localhost:8081")
});