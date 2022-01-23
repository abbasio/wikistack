//---------DEPENDENCIES
const express = require('express');
const router = express.Router();
const addPage = require('../views/addPage');
const { Page, User, generateSlug } = require('../models');
const wikiPage = require('../views/wikipage');
const main = require('../views/main');
const editPage = require('../views/editPage');

//---------ROUTES

//---Homepage
router.get('/', async(req, res, next) => {
  try {
    const pages = await Page.findAll();
    res.send(main(pages))
  }
  catch(error){
    next(error);
  }
});

//---Add page (form)
router.get('/add', (req, res, next) => {
  try {
    res.send(addPage());
  }
  catch(error){
    next(error);
  }
});
//---Article page
router.get('/:slug', async (req, res, next) => {
  try {
    const page = await Page.findOne({
      where: {
        slug : req.params.slug
      } 
    });
    if (page === null){
      res.status(404).send('Article does not exist!');
    }
    const author = await page.getAuthor();
    res.send(wikiPage(page, author))
  } 
  catch (error) {
    next(error)
  }
});

//---Edit page (form)
router.get('/:slug/edit', async (req, res, next) => {
  try {
    const page = await Page.findOne({
      where: {
        slug: req.params.slug
      }
    });
    const author = await page.getAuthor();
    res.send(editPage(page, author));
  }
  catch(error){
    next(error);
  }
});

//---Delete page 
router.get('/:slug/delete', async (req, res, next) => {
  try {
    const page = await Page.findOne({
      where: {
        slug: req.params.slug
      }
    })
    await page.destroy();
    res.redirect('/');
  }
  catch(error){
    next(error);
  }
});

//---Edit page (route)
router.put('/:slug', async (req, res, next) => {
  try{
    const page = await Page.findOne({
      where: {
        slug: req.params.slug
      }
    });
    page.set({
      title: req.body.title,
      content: req.body.content,
      slug: generateSlug(req.body.title),
      status: req.body.status
    });
    const [user, wasCreated] = await User.findOrCreate({
      where: {
        name: req.body.name,
        email: req.body.email
      }
    });
    await page.save();
    await page.setAuthor(user);
    
    res.redirect(`/wiki/${page.slug}`);

  }
  catch(error){
    next(error);
  }
})

//---Add page (route)
router.post('/', async (req, res, next) => {
  try {
    const page = await Page.create({
      title: req.body.title,
      content: req.body.content,
      status: req.body.status
    });
    
    const [user, wasCreated] = await User.findOrCreate({
      where: {
        name: req.body.name,
        email: req.body.email
      }
    });
    
    await page.setAuthor(user);
    
    res.redirect(`/wiki/${page.slug}`);
  }
  catch(error){
    next(error);
  }
})

//---------EXPORTS
module.exports = router;

