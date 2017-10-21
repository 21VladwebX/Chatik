"use strict"

const mongoose = require('mongoose');
const Schema    = mongoose.Schema;

const MessageSchema = new Schema({      //1 - название полей и их типы , 2 - опции
  date: {type : Date},
  content: {type : String},
  username: {type : String}
},{
  versionKey: false,             //внутреность монгуса , которая добавляет в каждую запись вот токое поле "__v" когда идет апдейт в базе, эта переменная (с __v ) инкрементируеться
  collection: "MessageCollection"                  //название колекии с которой будет эта модель работать
});

module.exports = mongoose.model('MessageModel', MessageSchema );  //Название модели, схема
