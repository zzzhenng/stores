const mongoose = require('mongoose');



// import environmental
require('dotenv').config({ path: 'variables.env' });

// connect to our Database
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE, function(error) {
  console.error(error.message);
});


// import all of our models
require('./models/Store');

// start app
const app = require('./app');

app.set('port', process.env.PORT || 3000);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running at PORT ${server.address().port}`);
});
