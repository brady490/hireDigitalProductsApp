const express = require('express');
const router = express.Router();

const Product = require('../models/products');
const Users = require('../models/users');

router.get('/', async (req, res, next) => {
  let userId = req.cookies && req.cookies["userId"] ? req.cookies["userId"] : undefined;
  let products = await Product.getAll()
  res.render('products-list', {
    'products': products,
    'recommended': Users.getRecommendedProducts(userId)
  });
});

// get add page
router.get('/add', async (req, res, next) => {
  res.render('add-product')
});

router.get('/:id', async (req, res, next) => {
  let product = await Product.getById(req.params.id);
  if (product) {
    res.render('product-details', {
      'product': product
    })
  }
  else {
    res.status(404).render('404')
  }
});

// add new 
router.post('/', async (req, res, next) => {
  try {
    let product = new Product(req.body);
    await product.add();

    res.redirect(`/products`);
  }
  catch (err) {
    res.status(500).render('error', { "name": err.name, "message": err.message });
  }
});

// get edit page 
router.get('/edit/:id', async (req, res, next) => {
  let product = await Product.getById(req.params.id);
  if (product) {
    res.render('edit-product', {
      'product': product
    })
  }
  else {
    res.status(404).render('404')
  }
});

// update product 
router.post('/edit/:id', async (req, res, next) => {
  try {
    let editedFields = req.body;
    let product = new Product(editedFields);
    await product.update(req.params.id);

    res.redirect(`/products`);
  }
  catch (err) {
    res.status(500).render('error', { "name": err.name, "message": err.message });
  }
});
module.exports = router;