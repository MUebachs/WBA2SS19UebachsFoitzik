var express = require("express");
var app = express();

const admin = require('firebase-admin');
var serviceAccount = require('./restourant-c87ba-c4fb35e484e0.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
var db = admin.firestore();
app.use(express.json());

//aufgrund von Problemen mit der Datenbank werden alle resouren in der Index Datei umgesetzt

//Ressource: Worker

//Verb:GET / gibt alle Arbeitskräfte der Datenbank aus

app.get("/worker", function(request, response){

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
  var workerRef = db.collection('worker').doc(request.params.id);
  var getDoc = workerRef.get()
    .then(doc => {
      if (!doc.exists) {
        console.log('No such document!');
      } else {
        console.log('Document data:', doc.data());
        response.json(doc.data());
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });
});


//Verb: POST/ Erstellt neue Arbeitskraft

app.post("/worker", function(request, response){
  var p = request.body;
  var tisch;

  var tisch = db.collection('table').get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      if(doc.vergeben == False){
        tisch=doc.id;
      }
    });
    if(tisch>0){
      db.collection('worker').doc(p.id).set({
        "nachname"  : p.nachname,
        "name"      : p.name,
        "tZeit"     : p.tZeit,
        "wZeit"     : p.wZeit,
        "table"     : tisch
      });
    }
    else{
      db.collection('worker').doc(p.id).set({
        "nachname"  : p.nachname,
        "name"      : p.name,
        "tZeit"     : p.tZeit,
        "wZeit"     : p.wZeit
      });
    }
  });




  return response.send("Neue Arbeitskraft mit der ID " + p.id + " erstellt.");

});
//Verb: PATCH / Bearbeitet vorhandene arbeitskraft mit bestimmter ID

app.patch("/worker/:id", function(request, response){

  var workerRef = db.collection('worker').doc(request.params.id);

  var transaction = db.runTransaction(t => {
  return t.get(workerRef)
    .then(doc => {

      if(request.body.nachname != null){
        t.update(workerRef, {nachname: request.body.nachname});
      }

      if(request.body.name != null){
        t.update(workerRef, {name: request.body.name});
      }

      if(request.body.tZeit != null){
        t.update(workerRef, {tZeit: request.body.tZeit});
      }

      if(request.body.wZeit != null){
        t.update(workerRef, {wZeit: request.body.wZeit});
      }

      if(request.body.table != null){
        t.update(workerRef, {table: request.body.table});
      }

    });
}).then(result => {
  console.log('Transaction success!');
}).catch(err => {
  console.log('Transaction failure:', err);
});

  return response.send("Arbeitskraft mit der ID" + request.params.id + "wurde angepasst.")
})
//Verb: DELETE / Löscht Nutzer mit bestimmter ID

app.delete("/worker/:id", function(request, response){

  var workerRef = db.collection('worker').doc(request.params.id);
  var getDoc = workerRef.delete();

  return response.send("Lösche Arbeiter mit der ID" + request.params.id + ".");
});

//--------------------------------------------------------------------------------------------------


//Ressource: customer

//Verb:GET / gibt alle Kunden der Datenbank aus

app.get("/customer", function(request, response){

  var docList= [];
  var worker = db.collection('customer').get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {

      docList.push(doc.data());

    });
      response.json(docList);
  })
  .catch((err) => {
    response.json('Error getting documents', err);
  });

});


//Verb:GET / gibt einen bestimmten Kunden der Datenbank aus

app.get("/customer/:id", function(request, response){

  var customerRef = db.collection('customer').doc(request.params.id);
  var getDoc = customerRef.get()

    .then(doc => {
      if (!doc.exists) {
        console.log('No such document!');
      } else {
        console.log('Document data:', doc.data());
        response.json(doc.data());
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });
});

//Verb: POST/ Erstellt einen neuen Kunden

app.post("/customer", function(request, response){
  var p = request.body;
  db.collection('worker').doc(p.id).set({
    "lieblingsgericht"  : p.lieblingsgericht,
    "name"      : p.name,
    "nachname"     : p.nachname,
    "lieblingstisch"     : p.lieblingstisch
  });
  return response.send("Neuer Kunde mit der ID " + p.id + " erstellt.");
});

//Verb: DELETE / Löscht Nutzer mit bestimmter ID

app.delete("/customer/:id", function(request, response){

  var workerRef = db.collection('customer').doc(request.params.id);
  var getDoc = workerRef.delete();

  return response.send("Lösche Kunden mit der ID" + request.params.id + ".");
});

//------------------------------------------------------------------------------

//Ressource: reservation

//Verb:GET / gibt alle Reservierungen der Datenbank aus

app.get("/reservation", function(request, response){

  var docList= [];
  var worker = db.collection('reservation').get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {

      docList.push(doc.data());

    });
      response.json(docList);
  })
  .catch((err) => {
    response.json('Error getting documents', err);
  });

});

//Verb:GET / gibt einen bestimmte Reservierung der Datenbank aus

app.get("/reservation/:id", function(request, response){

  var reservRef = db.collection('reservation').doc(request.params.id);
  var getDoc = reservRef.get()

    .then(doc => {
      if (!doc.exists) {
        console.log('No such document!');
      } else {
        console.log('Document data:', doc.data());
        response.json(doc.data());
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });
});

//Verb: POST/ Erstellt einen neuen Kunden

app.post("/reservation", function(request, response){
  var p = request.body;
  var newReserv;
  if(p.tisch.exists){
  newReserv = {
    "datum"  : p.datum,
    "kunde"      : p.kunde,
    "tisch"     : p.tisch
  }
}
else {

  var docList= [];
  var worker = db.collection('table').get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {

      if(doc.Reservierung != p.datum){
        newReserv = {
          "datum"  : p.datum,
          "kunde"      : p.kunde,
          "tisch"     : doc.id
        }
      }

    });
      response.json(docList);
  })
  .catch((err) => {
    response.json('Error getting documents', err);
  });

}
  db.collection('reservation').doc(p.id).set(newReserv);
  return response.send("Neue Reservierung mit der ID " + p.id + " erstellt.");
});

//Verb: PATCH / Bearbeitet vorhandene arbeitskraft mit bestimmter ID

app.patch("/reservation/:id", function(request, response){

  var reservRef = db.collection('reservation').doc(request.params.id);

  var transaction = db.runTransaction(t => {
  return t.get(reservRef)
    .then(doc => {

      if(request.body.datum != null){
        t.update(reservRef, {datum: request.body.datum});
      }

      if(request.body.kunde != null){
        t.update(reservRef, {kunde: request.body.kunde});
      }

      if(request.body.tisch != null){
        t.update(reservRef, {tisch: request.body.tisch});
      }

    });
}).then(result => {
  console.log('Transaction success!');
}).catch(err => {
  console.log('Transaction failure:', err);
});

  return response.send("Arbeitskraft mit der ID" + request.params.id + "wurde angepasst.")
})

//Verb: DELETE / Löscht Reservierung mit bestimmter ID

app.delete("/reservation/:id", function(request, response){

  var reservRef = db.collection('reservation').doc(request.params.id);
  var getDoc = reservRef.delete();

  return response.send("Lösche Reservierung mit der ID" + request.params.id + ".");
});

//------------------------------------------------------------------------------

//Ressource: table

//Verb:GET / gibt alle Reservierungen der Datenbank aus

app.get("/table", function(request, response){
  var docList= [];
  var table = db.collection('table').get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {

      docList.push(doc.data());

    });
      response.json(docList);
  })
  .catch((err) => {
    response.json('Error getting documents', err);
  });

});

//Verb:GET / gibt einen bestimmten Tisch der Datenbank aus

app.get("/table/:id", function(request, response){

  var tableRef = db.collection('table').doc(request.params.id);
  var getDoc = tableRef.get()

    .then(doc => {
      if (!doc.exists) {
        console.log('No such document!');
      } else {
        console.log('Document data:', doc.data());
        response.json(doc.data());
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });
});

//Verb: POST/ Erstellt einen neuen Tisch

app.post("/table", function(request, response){
  var p = request.body;
  db.collection('table').doc(p.id).set({
    "vergeben" : False
  });

  return response.send("Neuer Tisch mit der ID " + p.id + " erstellt.");
});

//Verb: PATCH / Bearbeitet vorhandene arbeitskraft mit bestimmter ID

app.patch("/table/:id", function(request, response){

  var tableRef = db.collection('table').doc(request.params.id);

  var transaction = db.runTransaction(t => {
  return t.get(tableRef)
    .then(doc => {

      if(request.body.datum != null){
        t.update(tableRef, {datum: request.body.datum});
      }

      if(request.body.kunde != null){
        t.update(tableRef, {kunde: request.body.kunde});
      }

    });
}).then(result => {
  console.log('Transaction success!');
}).catch(err => {
  console.log('Transaction failure:', err);
});

  return response.send("Arbeitskraft mit der ID" + request.params.id + "wurde angepasst.")
})

//Verb: DELETE / Löscht Reservierung mit bestimmter ID

app.delete("/table/:id", function(request, response){

  var tableRef = db.collection('table').doc(request.params.id);
  var getDoc = tableRef.delete();

  return response.send("Lösche Reservierung mit der ID" + request.params.id + ".");
});

//Verb: PUT / Weist dem Tisch eine Reservierung zu

app.put("/table/:id", function(request, response){

});


//------------------------------------------------------------------------------
app.listen(1337, function(){
console.log("Server gestartet");
})
