const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcryptjs');

const app = express();
const port = 4000;

// Configuración del middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Jssm-2012007',
    database: 'sena'
});

// Comprobar la conexion a la base de datos
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Rutas
app.get('/',(req, res) => {res.sendFile(path.join(__dirname, '../html/login.html'));});
app.get('/register',(req, res) => {res.sendFile(path.join(__dirname, '../html/register.html'));});

// Ruta para manejar el registro
app.post('/register', (req, res) => {
    const { nombre , apellido, correo, contraseña, confirmarContraseña } = req.body;

    if (contraseña !== confirmarContraseña){
        return res.status(500).send('La contraseña no coincide');
    }

    const sql = 'INSERT INTO users (nombre, apellido, correo, contraseña) VALUES (?, ?, ?, ?)';
        db.query(sql, [nombre , apellido, correo, contraseña], (err, result) => {
            if (err) {
                throw err;
            }
        res.send('Registro exitoso');
    });
});

// Ruta para manejar el login
app.post('/', (req, res) => {
    const { correo, contraseña } = req.body;

    const sql = 'SELECT * FROM users WHERE correo = ?';
    db.query(sql, [correo], (err, results) => {
        if (err) {
            return res.status(500).send('Error al buscar el usuario');
        }

        if (results.length === 0) {
            return res.status(400).send('Usuario no encontrado');
        }     
        
        const user = results[0];

        if (contraseña === user.contraseña) { 
            res.send('Login exitoso');
        } else {
            res.status(400).send('Contraseña incorrecta');
        }
    });
});

// Para abrir el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});