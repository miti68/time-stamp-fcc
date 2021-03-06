 /******************************************************
 * PLEASE DO NOT EDIT THIS FILE
 * the verification process may break
 * ***************************************************/

'use strict';

var fs = require('fs');
var express = require('express');
var app = express();
var feedBackObject = { "unix": null, "natural": null};
var checkInput;
var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
app.use('/public', express.static(process.cwd() + '/public'));

app.route('/_api/package.json')
  .get(function(req, res, next) {
    console.log('requested');
    fs.readFile(__dirname + '/package.json', function(err, data) {
      if(err) return next(err);
      res.type('txt').send(data.toString());
    });
  });

app.route('/')
    .get(function(req, res) {
		  res.sendFile(process.cwd() + '/views/index.html');
    })

app.all('*', function (req, res,next) {
  checkInput = req.params['0'].slice(1); // 1 is ignore "/"
  
  var date = new Date(checkInput);
  
  for(var i=0;i<monthNames.length;i++){
    if(checkInput.search(/[^0-9]/)===-1){
      date = new Date(parseInt(checkInput)*1000);
      if(i===date.getMonth()){
        feedBackObject.unix = checkInput;
        feedBackObject.natural = monthNames[i] + " " + date.getDate().toString() + ", " + date.getFullYear().toString();
        res.type('JSON').send(feedBackObject);        
      } 
    }
    
    
    if(checkInput.split(/\s/)[0].toLowerCase() === monthNames[i].toLowerCase()){
      if(date.getDate().toString() !== "NaN" || date.getFullYear().toString() !== "NaN"){
        feedBackObject.unix =  date.getTime();
        feedBackObject.natural = monthNames[i] + " " + date.getDate().toString() + ", " + date.getFullYear().toString();
        res.type('JSON').send(feedBackObject);        
      }
    }
    else{
      feedBackObject = { "unix": null, "natural": null};
    }
    
  }
  next();
})
  


// Respond not found to all the wrong routes
app.use(function(req, res){
  feedBackObject = { "unix": null, "natural": null};
  res.type('JSON').send(feedBackObject);
});

// Error Middleware
app.use(function(err, req, res, next) {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }  
})

app.listen(3000, function () {
  console.log('Node.js listening ...');
});

