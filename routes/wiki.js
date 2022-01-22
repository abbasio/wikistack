//---------DEPENDENCIES
const express = require('express');
const router = express.Router();
const addPage = require('../views/addPage');
const { Page, User } = require('../models');
const wikiPage = require('../views/wikipage');
const main = require('../views/main');

//---------ROUTES
router.get('/', async(req, res, next) => {
  try {
    const pages = await Page.findAll();
    res.send(main(pages))
  }
  catch(error){
    next(error);
  }
});

router.get('/add', (req, res, next) => {
  try {
    res.send(addPage());
  }
  catch(error){
    next(error);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const page = await Page.findOne({
      where: {
        slug : req.params.slug
      } 
    });

    const author = await page.getAuthor();

    res.send(wikiPage(page, author))
  } 
    catch (error) {
    next(error)
  }
});

router.post('/', async (req, res, next) => {
  try {
    const page = await Page.create({
      title: req.body.title,
      content: req.body.content
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

