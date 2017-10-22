"use stict"

const MessageModel = require('./models/messages.model');

module.exports = io =>{ //получаем io и запускаем ф-цыю
  io.on('connection', function (socket) {// в колбеке приходит тот же сокет, который вызвал соединение
    socket.emit('connected',"You are connected!");//emit отправить в этот же сокет ответ
    // в чатах есть комнаты, и когда мы подключаемся к чату, еужно подклячиться к определенной комнате

    socket.join('all');               //пока что у нас только одна комната чата
    socket.on('msg', content =>{    // on -сокеты которые ми получаем
      console.log('ada', content);
      // console.log("MSG");
      const obj = {                   //так как на клиенте ф-цыя ожидает обьект, сервер его формирует и отправляет
        date: new Date(),
        content: content,
        username: "Kotik"
      };
   //есть два метода как сохранить что то в бд используя монгу, 1 -..
      // const model = new MessageModel(obj); // сдесь модель пройдет валидацию
      // model.save(); // save in mongo
      //2 - ..
      MessageModel.create(obj, err => {
        if(err){
          return console.log("MessageModel", err);
        }
        // console.log(obj);
        socket.emit('message', obj);            //первый аргумент - ивент которому будем отправлять data, второй сами данные
        socket.to('all').emit('message', obj);  //;//отправляем сообщеие в камнату чата , то есть users всем в камнaтe all
      });


    });

    socket.on('receiveHistory', () =>{
      MessageModel
      .find({})                       //поиск но у нас критериев нет это булеи масив, а findOne достанет одну запись, строку
        .sort(({date: -1}))           //сортируем по дате по убыванию
        .limit(50)                    // вытащить последние 50 записей
        .sort({date: 1})              //сортируем то что отсортировано но уже верно
        .lean()
        .exec( (err, messages) => {
          if(!err){
            socket.emit("history", messages);
            // socket.to("all").emit("message", messages); не нужно так как выше жестко привязали все сокеты к комнате all
          }

        })
    });
  });

}
