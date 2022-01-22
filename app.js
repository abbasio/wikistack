//---------DEPENDENCIES
const express = require('express');
const app = express();
const morgan = require('morgan');
const layout = require('./views/layout');
const { db } = require('./models');
const wikiRouter = require('./routes/wiki');
const userRouter = require('./routes/users');

//---------MIDDLEWARE
app.use(morgan('dev'));
app.use(express.static('/public'));
app.use(express.urlencoded({extended: true}));
app.use('/wiki', wikiRouter);
app.use('/user', userRouter);

//---------ROUTES
app.get('/', (req, res, next) => {
  try{
    res.redirect('/wiki');
  }
  catch(error){
    next(error);
  }
})

//---------DATABASE
db.authenticate()
  .then(() => {
    console.log('connected to the database');
  })

  const syncDb = async() => {
    await db.sync({force: true});
  }

  syncDb();

//---------LISTENER

  const PORT = 3000;

app.listen(PORT, () =>{
  console.log(`Listening on port ${PORT}`);
})
