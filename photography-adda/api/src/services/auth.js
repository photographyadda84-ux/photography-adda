// simple JWT auth middleware (placeholder)
import jwt from 'jsonwebtoken';
export function authMiddleware(req, res, next){
  const auth = req.headers.authorization;
  if(!auth) return res.status(401).json({error:'no token'});
  const token = auth.split(' ')[1];
  try{
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    req.user = payload;
    return next();
  }catch(e){
    return res.status(401).json({error:'invalid token'});
  }
}
