"use strict"

function ExtractJwt(req)  {
  let token = null;
  if(req.cookies && req.cookies.token !=void(0))
    token = req.cookies['token'];
  return token;
}

module.exports = {
  jwt: {
    // jwtFromRequest:  ExtractJwt.fromAuthHeaderAsBearerToken(), //Здесь нам нужен ораюотчик , который бы брал с куки а не с хедера запроса
    jwtFromRequest:  ExtractJwt,
    secretOrKey : 'secret'         //secret for algorithm for passport
  },

  expiresIn: '1 day' //??
};
