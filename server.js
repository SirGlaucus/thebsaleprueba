//Cargando librerias
const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const pool = require('./src/database')

const app = express()

// Configuracion del handlebars 
app.set('view engine', 'handlebars')
app.engine('handlebars', exphbs.engine({ layoutsDir: __dirname + '/views' }))

app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/css'))
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/js'))
app.use('/js', express.static(__dirname + '/assets/js'))

app.get('/', async (req, res) => {
    const data = await pool.query('SELECT * FROM product')
    console.log(data)
    res.render('index', {
        layout: 'index'
    })
})


app.listen(3000, () => console.log("Servidor encendido en el puerto 3000!"))