"use strict"
const express = require('express'),
      app     = express(),
      // path    = require('path'),
     server = require('http').Server(app),
     io = require('socket.io')(server, {serveClient: true}), //serverClient - будет ли храниться на нашем веб сервере храниться soket.io то-есть усть сокети для фронт и бєк енда, и чтобы они обновлялись синхронно
     mongoose = require('mongoose'),
     passport = require('passport'),
     bodyParser = require('body-parser'),
     cookieParser = require('cookie-parser'),
     nunjucks = require('nunjucks');

const { Strategy } = require('passport-jwt');

const  { jwt } = require('./config');

passport.use(new Strategy(jwt, function(jwt_payload, done) {    //1- откуда берем токен, 2- как проверють токен
  if(jwt_payload != void(0)){                                   //проверка не равно ли нулю, вроде как такаю проверка происходит быстрее for object
    return done(false, jwt_payload);
  }
  done();
}));

mongoose.connect('mongodb://localhost:27017/chat', {useMongoClient: true})//URI chat название колекции,

mongoose.Promise  = require('bluebird');//bluebird - библиотека для Promise

mongoose.set('debug', true);

nunjucks.configure('../client/views',{ //client дириктория где храняться шаблоны
    autoescape: true,
    express: app
});

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

/*---------------------------------------------*/

app.use('/assets',express.static('../client/public')) // обьявляем статические файлы



require('./router')(app);

require('./sockets')(io);     //реквeйрим файл, и передаем в него io




server.listen('7777',() =>{ // port , ip adress, function
  console.log('Server started on port 7777');
})
