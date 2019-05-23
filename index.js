var express = require("express");
var app = express();
var w = require("./worker");
var r = require("./reservation");
var t = require("./table");
var c = require("./customer");
const admin = require('firebase-admin');
var serviceAccount = require('./restourant-c87ba-c4fb35e484e0.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
var db = admin.firestore();
app.use(express.json());
/*
app.use("/worker", w);

app.use("/reservation", r);

app.use("/table", t);

app.use("/customer", c);*/

//aufgrund von Problemen mit der Datenbank werden alle resouren in der Index Datei umgesetzt

//Ressource: Worker

//Verb:GET / gibt alle Arbeitskräfte der Datenbank aus

app.get("/worker", function(request, response){
  //response.json("Hier eine Liste mit allen eingetragenen Arbeitern.");
  var docList= [];
  var worker = db.collection('worker').get().then((snapshot) => {
    snapshot.forEach((doc) => {

      docList.push(doc.data());

    });
      response.json(docList);
  })
  .catch((err) => {
    response.json('Error getting documents', err);
  });

});



//Verb:GET / gibt eine bestimmte Arbeitskraft mit der genannten ID aus

app.get("/worker/:id", function(request,response){

}



  //response.end(JSON.stringify("Hier ist ein bestimmter Arbeiter mit der ID: " + request.params.id + "."));
//Verb: POST/ Erstellt neue Arbeitskraft
app.post("/worker", function(request, response){
  var p = request.body;
  db.collection('worker').doc(p.id).set({
    "nachname"  : p.nachname,
    "name"      : p.name,
    "tZeit"     : p.tZeit,
    "wZeit"     : p.wZeit,
    "table"     : p.table
  });
  return response.send("Neue Arbeitskraft mit der ID " + p.id + " erstellt.");

});
//Verb: PATCH / Bearbeitet vorhandene arbeitskraft mit bestimmter ID
app.patch("/worker:id", function(request, response){

  return response.send("Arbeitskraft mit der ID" + request.params.id + "wurde angepasst.")
})
//Verb: DELETE / Löscht Nutzer mit bestimmter ID
app.delete("/worker:id", function(request, response){

  return response.send("Lösche Nutzer mit der ID" + request.params.id + ".");
});


//Ressource: customer

//Verb:GET / gibt alle Arbeitskräfte der Datenbank aus

app.get("/worker", function(request, response){
  //response.json("Hier eine Liste mit allen eingetragenen Arbeitern.");
  var docList= [];
  var worker = db.collection('worker').get().then((snapshot) => {
    snapshot.forEach((doc) => {

      docList.push(doc.data());

    });
      response.json(docList);
  })
  .catch((err) => {
    response.json('Error getting documents', err);
  });

});


app.listen(1337, function(){
console.log("Server gestartet");
})
