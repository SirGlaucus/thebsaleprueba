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
    const categoryList = await pool.query('SELECT * FROM category')


    const dataDescuento = data.map((item) => {
        let newPrice = item.price
        let newUrl = item.url_image
        if (item.discount > 0) {
            newPrice = item.price - ((item.discount * item.price) / 100)
        }
        if (item.url_image === '' || !item.url_image) {
            newUrl = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
        }
        return { name: item.name, url_image: newUrl, price: newPrice, category: item.category }
    })

    res.render('index', {
        layout: 'index',
        product: dataDescuento,
        categorias: categoryList
    })
})

app.get('/:category', async (req, res) => {
    const categoryList = await pool.query('SELECT * FROM category')

    const {category} = req.params
    const data = await pool.query(`SELECT * FROM product WHERE category = ${category}`)

    const dataDescuento = data.map((item) => {
        let newPrice = item.price
        let newUrl = item.url_image
        if (item.discount > 0) {
            newPrice = item.price - ((item.discount * item.price) / 100)
        }
        if (item.url_image === '' || !item.url_image) {
            newUrl = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
        }
        return { name: item.name, url_image: newUrl, price: newPrice, category: item.category }
    })

    res.render('index', {
        layout: 'index',
        product: dataDescuento,
        categorias: categoryList
    })
})


app.listen(3000, () => console.log("Servidor encendido en el puerto 3000!"))