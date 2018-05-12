const app = require('./app');

// import environmental
require('dotenv').config({ path: 'variables.env' });

// start app
app.set('port', process.env.PORT || 9997);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running at PORT ${server.address().port}`);
});
