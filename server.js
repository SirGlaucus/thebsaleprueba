//Cargando librerias
const express = require('express')
const path = require('path')

const app = express()

app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/css'))
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/js'))
app.use('/js', express.static(__dirname + '/assets/js'))

app.get('/', (req, res) => {
    const ruta = path.join(__dirname, 'index.html')
    res.sendFile(ruta)
})


app.listen(3000, () => console.log("Servidor encendido en el puerto 3000!"))