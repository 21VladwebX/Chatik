"use srtict"

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const bcrypt    = require('bcryptjs');

const UserSchema = new Schema({
  username: {type: String},
  password: {type: String},
  addedAt:  {type: Date, default: Date.now } // когда была создана запись в БД, если дата не передано, то она устаноовиться по дефолту Монжно писать лиш название ф-цыи
},{
  versionKey: false,
  collection: "UsersCollection"
});

UserSchema.pre('save', function(next){  //перед записью, тоесть сохранением..
  if(this.isModified('password') || this.isNew()) //Если пароль изменён или создан, то шифружм пароль
    this.password = bcrypt.hashSync(this.password, 12);
    next();
});

module.exports = mongoose.model('UsersModel', UserSchema);
