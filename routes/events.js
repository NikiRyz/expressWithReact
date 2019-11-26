var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var fs = require("fs");
var path = require("path");

var jsonParser = bodyParser.json();

var file = path.join(__dirname, "../public/events.json");

//получение всех мероприятий
router.get("/events", function(req, res) {
  var content = fs.readFileSync(file, "utf8");
  var events = JSON.parse(content);
  res.send(events);
});

// получение одного мероприятия по id
router.get("/events/:id", function(req, res) {
  var id = req.params.id; // получаем id
  var content = fs.readFileSync(file, "utf8");
  var events = JSON.parse(content);
  var event = null;
  // находим в массиве мероприятие по id
  for (var i = 0; i < events.length; i++) {
    if (events[i].id == id) {
      event = events[i];
      break;
    }
  }
  // отправляем мероприятие
  if (event) {
    res.send(event);
  } else {
    res.status(404).send();
  }
});
// получение отправленных данных
router.post("/events_add", jsonParser, function(req, res) {
  res.render("index", { title: "Вы успешно добавили мероприятие!" });

  if (!req.body) return res.sendStatus(400);

  var eventOrganizer = req.body.organizer;
  var eventDate = req.body.date;
  var eventTitle = req.body.title;
  var eventCategory = req.body.category;
  var eventSale = req.body.sale;
  var eventTime = req.body.time;
  var eventAddress = req.body.address;
  var eventPrice = req.body.price;
  var eventDescription = req.body.description;
  var eventLink = req.body.link;


  var event = {
    id: "",
    organizer: eventOrganizer,
    date: eventDate,
    title: eventTitle,
    category: eventCategory,
    sale: eventSale,
    time: eventTime,
    address: eventAddress,
    price: eventPrice,
    description: eventDescription,
    link: eventLink
  };

  var data = fs.readFileSync(file, "utf8");
  var events = JSON.parse(data);

  var id = 0;

  for (let i = 0; i < events.length; i++) {
    if (events[i].id > id) {
      id = events[i].id;
    }
  }

  event.id = id + 1;
  events.push(event);
  var data = JSON.stringify(events);
  // перезаписываем файл с новыми данными
  fs.writeFileSync(file, data);
  res.send(event);
});

// удаление мероприятия по id
router.delete("/delete/:id", function(req, res) {
  var id = req.params.id;
  var data = fs.readFileSync(file, "utf8");
  var events = JSON.parse(data);
  var index = -1;
  // находим индекс мероприятия в массиве
  for (var i = 0; i < events.length; i++) {
    if (events[i].id == id) {
      index = i;
      break;
    }
  }
  if (index > -1) {
    // удаляем мероприятие из массива по индексу
    var event = events.splice(index, 1)[0];
    var data = JSON.stringify(events);
    fs.writeFileSync(file, data);
    // отправляем удаленное мероприятие
    res.send(event);
  } else {
    res.status(404).send();
  }
});
// изменение мероприятия
router.put("/event/change_event", jsonParser, function(req, res) {
  if (!req.body) return res.sendStatus(400);

  var eventId = req.body.id;
  var eventOrganizer = req.body.organizer;
  var eventDate = req.body.date;
  var eventTitle = req.body.title;
  var eventCategory = req.body.category;
  var eventSale = req.body.sale;
  var eventTime = req.body.time;
  var eventAddress = req.body.address;
  var eventPrice = req.body.price;
  var eventDescription = req.body.description;
  var eventLink = req.body.link;

  var data = fs.readFileSync(file, "utf8");
  var events = JSON.parse(data);
  var event;
  for (var i = 0; i < events.length; i++) {
    if (events[i].id == eventId) {
      event = events[i];
      break;
    }
  }
  // изменяем данные мероприятия
  if (event) {
    event.organizer = eventOrganizer,
    event.date= eventDate,
    event.title= eventTitle,
    event.category= eventCategory,
    event.sale= eventSale,
    event.time= eventTime,
    event.address= eventAddress,
    event.price= eventPrice,
    event.description= eventDescription,
    event.link= eventLink
    var data = JSON.stringify(events);
    fs.writeFileSync(file, data);
    res.send(event);
  } else {
    res.status(404).send(event);
  }
});

module.exports = router;
