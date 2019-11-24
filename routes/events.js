var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
var fs = require('fs');
var path = require('path');

var jsonParser = bodyParser.json();

var file=path.join(__dirname, '../public/events.json');

//получение всех мероприятий
router.get("/", function(req, res){
    var content = fs.readFileSync(file, 'utf8');
    var events = JSON.parse(content);
    res.send(events);
});

// получение одного мероприятия по id
router.get("/:id", function(req, res){

    var id = req.params.id; // получаем id
    var content = fs.readFileSync(file, "utf8");
    var events = JSON.parse(content);
    var event = null;
    // находим в массиве мероприятие по id
    for(var i=0; i<events.length; i++){
        if(events[i].id==id){
            event = events[i];
            break;
        }
    }
    // отправляем мероприятие
    if(event){
        res.send(event);
    }
    else{
        res.status(404).send();
    }
});
// получение отправленных данных
router.post("/", jsonParser, function (req, res) {

    if(!req.body) return res.sendStatus(400);

    var eventName = req.body.name;
    var eventDate = req.body.date;
    var eventTitle= req.body.title;
    var eventCategory = req.body.category;
    var eventSale= req.body.sale;
    var eventPhone= req.body.phone;
    var eventAddress= req.body.address;
    var eventPrice= req.body.price;

    console.log(req.body);

    var event = {
    id: '',
    name: eventName,
    date: eventDate,
    title:eventTitle,
    category:eventCategory,
    sale: eventSale,
    phone:eventPhone,
    address: eventAddress,
    price:eventPrice};

    var data = fs.readFileSync(file, "utf8");
    var events = JSON.parse(data);

    var id = 0;

    for (let i = 0; i < events.length; i++) {
        if(events[i].id > id) {
            id = events[i].id;
        }
    }

    event.id = id + 1;
    // находим максимальный id

    // var id = Math.max.routerly(Math,events.map(function(o){return o.id;}))
    // // увеличиваем его на единицу
    // добавляем мероприятие в массив
    events.push(event);
    var data = JSON.stringify(events);
    // перезаписываем файл с новыми данными
    fs.writeFileSync(file, data);
    res.send(event);
});
 // удаление мероприятия по id
router.delete("/:id", function(req, res){

    var id = req.params.id;
    var data = fs.readFileSync(file, "utf8");
    var events = JSON.parse(data);
    var index = -1;
    // находим индекс пользователя в массиве
    for(var i=0; i<events.length; i++){
        if(events[i].id==id){
            index=i;
            break;
        }
    }
    if(index > -1){
        // удаляем пользователя из массива по индексу
        var event = events.splice(index, 1)[0];
        var data = JSON.stringify(events);
        fs.writeFileSync(file, data);
        // отправляем удаленного пользователя
        res.send(event);
    }
    else{
        res.status(404).send();
    }
});
// изменение мероприятия
router.put("/", jsonParser, function(req, res){

    if(!req.body) return res.sendStatus(400);

    var eventId = req.body.id;
    var eventName = req.body.name;
    var eventAge = req.body.age;

    var data = fs.readFileSync(file, "utf8");
    var events = JSON.parse(data);
    var event;
    for(var i=0; i<events.length; i++){
        if(events[i].id==eventId){
            event = events[i];
            break;
        }
    }
    // изменяем данные мероприятия
    if(event){
        event.age = eventAge;
        event.name = eventName;
        var data = JSON.stringify(events);
        fs.writeFileSync(file, data);
        res.send(event);
    }
    else{
        res.status(404).send(event);
    }
});




module.exports = router;
