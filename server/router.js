"use strict"
const UsersModel = require('.models/users.model');
const _          = require('loudash');
const config     = require('.config');
const bcrypt     = require('bcryptjs');
const express    = require('express');
const async      = require('async');
const passport   = require('passport');
const jwt        = require('jsonwebtoken');

function chekAuth (req, res, next){    //проверяем аутентификацыю   //next то есть по окончанию этой функции пойдет следю функцыя которая описана следом
    passport.authenticate('jwt', { session: false}, (err, decryptToken, jwtError) =>{ //1 с помощью jwt, 2 -нет сесий, 3 функция обработчик типа
       //  здесь происходит проверка подписан и токен сервером , с использыванем секретного ключа
       if(jwtError != void(0) || err != void(0))
        return res.render('index.html' , { error: err || jwtError});
       req.user = decryptToken;
       next();
    })(req, res, next); // передаем в passport аргументы, чтоб он знал как ему авторизироваться
}

function createToken (body) {
   return jwt.sign(
    body,
    config.jwt.secretOrKey,
    { expiresIn: config.expiresIn}
  );
}


module.exports = app =>{
  app.get('/', chekAuth ,(req,res) =>{   //endpoint, callback
    //res.sendFile('../client/index.html'); // не верный метод создания путей
    // res.sendFile(path.join(__dirname,'..','client','index.html'))//path.join(__dirname - показывает путь к директории,подымаемся на папку выше,папка где файл, файл)
    res.render('index.html',{ //1 шаблон,2 значения которые можно юзать в шаблоне
      date: new Date()
    });
  });

  app.post('/login', async(req, res) => {
    try {
      let user = await UsersModel.findOne({ username: {$regex: _.escapeRegExp(req.body.username), $options: "i" }}).lean().exec();
      if(user != void(0) && bcrypt.compareSync(req.body.password, user.password)){ // проверяем совпадает ли пароль, если он введен
        const token = createToken({id: user._id, username: user.username});
        res.cookie('token', token, {
          httpOnly: true
        });
        res.status(200).send({message: "user login succes."});
      }
      else{
        res.status(400).send({ message : "User not exsist or password not correct"});
      }
    } catch (e) {
      console.error("E, login,", e);
      res.status(500).send({message: "Some error"});
    }

  });

  app.post('/register', async(req, res) => { //Сщздаем юзера
    try{
      // let user = await UsersModel.find({ username: {$regex: req.body.name, $optionsL "i"}).lean().exec();
      //regexp поиск в не зависимости от регистра, но чтобы не было иньекций в БД, юзай loudash
      // Сюда теперь никакая инекция не пройдет
      let user = await UsersModel.findOne({ username: {$regex: _.escapeRegExp(req.body.username), $options: "i" }}).lean().exec();
      if(user != void(0))
        return res.status(400).send({ message : "User already exsist"});
      user = await UsersModel.create({
        username: req.body.username,
        password: req.body.password
      });

      const token = createToken({id: user._id, username: user.username});
// передаем токен сервером
      res.cookie('token', token, {
        httpOnly: true
      });
      res.status(200).send({message: "user created."});

    }catch (e){
      console.error("E, register,", e);
      res.status(500).send({message: "Some error"});
    }

  });

  app.post('/logout', (req, res) =>{
    res.clearCookie('token');  //так как авторизация по куки , то чистим куки и происходит logout
    res.status(200).send({message : "Logout succes."})
  });

};
