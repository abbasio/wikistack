//---------DEPENDENCIES
const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/wikistack');

//---------HELPER FUNCTIONS
function generateSlug(title){
  return title.replace(/\s+/g, '_').replace(/\W/g, '');
}

//---------SCHEMAS
const Page = db.define('page', {
  title:{
    type: Sequelize.STRING,
    allowNull: false
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM('open', 'close')
  }
});

Page.addHook('beforeValidate', (page) => {
  page.slug = generateSlug(page.title);
});

const User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email:{
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  }
});


//---------EXPORTS
module.exports = {
  db,
  Page,
  User
};
