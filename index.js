const http = require('http');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const handlebar = require('express-handlebars');

const app = express();

app.engine('hbs', handlebar({
  layoutsDir: 'views/layouts/',
  defaultLayout: 'main',
  extname: 'hbs'
}));

app.set('view engine', 'hbs');
app.set('views', 'views');

// direct hit at port from browser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
  res.redirect('/products');
})
// register entity wise routes
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
app.use('/users', userRoutes);
app.use('/products', productRoutes);

var port = 5020;
app.set('port', port);

const server = http.createServer(app);
server.listen(port);

server.on('listening', (s) => {
  console.log(`server is up at ${port}`);
});