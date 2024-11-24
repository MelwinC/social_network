import xss from 'xss';

export const sanitizeInput = (req, _, next) => {
  if(req.body){
    req.body = sanitizeObject(req.body);
  }
  if(req.params){
    req.params = sanitizeObject(req.params);
  }
  if(req.query){
    req.query = sanitizeObject(req.query);
  }
  next();
};

const sanitizeObject = (obj) => {
  if (typeof obj === 'object' && obj !== null) {
    for (let key in obj) {
      if (typeof obj[key] === 'object') {
        sanitizeObject(obj[key]);
      } else if (typeof obj[key] === 'string') {
        obj[key] = xss(obj[key]);
      }
    }
  }
  return obj;
};