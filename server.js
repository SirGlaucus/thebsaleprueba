//Cargando librerias
const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const pool = require('./src/database')
const bodyparser = require('body-parser')

const app = express()

// Para poder utilizar el body
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: false }))

// Configuracion del handlebars 
app.set('view engine', 'handlebars')
app.engine('handlebars', exphbs.engine({ layoutsDir: __dirname + '/views' }))

app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/css'))
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/js'))
app.use('/js', express.static(__dirname + '/assets/js'))

app.get('/', async (req, res) => {
    const data = await pool.query('SELECT * FROM product')
    const categoryList = await pool.query('SELECT * FROM category')


    const dataDiscounted = data.map((item) => {
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
        product: dataDiscounted,
        categorias: categoryList
    })
})

app.get('/:category', async (req, res) => {
    const categoryList = await pool.query('SELECT * FROM category')

    const { category } = req.params
    const data = await pool.query(`SELECT * FROM product WHERE category = ${category}`)

    const dataDiscounted = data.map((item) => {
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
        product: dataDiscounted,
        categorias: categoryList
    })
})

app.post('/', async (req, res) => {
    const categoryList = await pool.query('SELECT * FROM category')

    const { text } = req.body
    const data = await pool.query(`SELECT * FROM product `)
    console.log(data)
    const filteredData = data.filter((product) => {
        const nameLower = product.name.toLowerCase()
        const textLower = text.toLowerCase()
        return nameLower.includes(textLower)
    })


    const dataDiscounted = filteredData.map((item) => {
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
        product: dataDiscounted,
        categorias: categoryList
    })
})


app.listen(3000, () => console.log("Servidor encendido en el puerto 3000!"))