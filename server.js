//Cargando librerias
const express = require('express')
const path = require('path')

const app = express()

app.get('/', (req, res) => {
    const ruta = path.join(__dirname, 'index.html')
    res.sendFile(ruta)
})


app.listen(3000, () => console.log("Servidor encendido en el puerto 3000!"))