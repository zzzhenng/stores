/*
  NOT Found Error Handler
  如果路由中没有这个页面，将错误传递给处理错误的中间件显示。
*/
exports.notFound = (req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
};

/*
  Catch Errors Handler
  在这里使用这个函数代替在 async/await 中使用 try{} catch(e) {} 捕捉错误。
*/
exports.catchErrors = (fn) => {
  return function(req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

/*
  Development Error Handler
*/
exports.developmentErrors = (err, req, res, next) => {
  err.stack = err.stack || '';
  const errorDetails = {
    message: err.message,
    status: err.status,
    stackHighlighted: err.stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>'),
  };
  res.status(err.status || 500);
  res.format({
    'text/html': () => {
      res.render('error', errorDetails);
    },
    'application/json': () => res.json(errorDetails),
  });
};

/*
  Production Error Handler
*/
exports.productionErrors = (err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
};
