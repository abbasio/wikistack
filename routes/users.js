//---------DEPENDENCIES
const express = require('express');
const { User } = require('../models');
const { Page } = require('../models');
const router = express.Router();
const userList = require('../views/userList');
const userPages = require('../views/userPages');

//---------ROUTES
router.get('/', async(req, res, next) => {
    try {
        const users = await User.findAll();
        res.send(userList(users));
    }
    catch(error){
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        const pages = await Page.findAll({
            where: {
                authorId: req.params.id
            }
        })
        res.send(userPages(user, pages))
    }
    catch(error){
        next(error);
    }
})


//---------EXPORTS
module.exports = router;
