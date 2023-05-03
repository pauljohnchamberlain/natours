module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next); // catch the error and pass it to the next middleware. Could also be written as fn(req, res, next).catch((err) => next(err));
  };
};
