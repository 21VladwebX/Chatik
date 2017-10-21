"use strict"
const express = require('express'),
      app     = express(),
      // path    = require('path'),
     server = require('http').Server(app),
     io = require('socket.io')(server, {serveClient: true}), //serverClient - будет ли храниться на нашем веб сервере храниться soket.io то-есть усть сокети для фронт и бєк енда, и чтобы они обновлялись синхронно
     mongoose = require('mongoose'),
     nunjucks = require('nunjucks');

mongoose.connect('mongodb://localhost:27017/chat', {useMongoClient: true})//URI chat название колекции,

mongoose.Promise  = require('bluebird');//bluebird - библиотека для Promise

nunjucks.configure('../client/views',{ //client дириктория где храняться шаблоны
    autoescape: true,
    express: app
});
/*---------------------------------------------*/

app.use('/assets',express.static('../client/public')) // обьявляем статические файлы

app.get('/',(req,res) =>{   //endpoint, callback
  //res.sendFile('../client/index.html'); // не верный метод создания путей
  // res.sendFile(path.join(__dirname,'..','client','index.html'))//path.join(__dirname - показывает путь к директории,подымаемся на папку выше,папка где файл, файл)
  res.render('index.html',{//шаблон, значения которые можно юзать в шаблоне
    date: new Date()
  });
});


require('./sockets')(io);     //реквйрим файл, и передаем в него io




server.listen('7777',() =>{ // port , ip adress, function
  console.log('Server started on port 7777');
})
