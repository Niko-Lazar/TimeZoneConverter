// index.js

/**
 * Required External Modules
 */
const express = require("express");
const path = require("path");
const fs = require('fs');
const res = require("express/lib/response");
const { start } = require("repl");
var moment = require('moment');
/**
 * App Variables
 */
const app = express();
const port = process.env.PORT || "8000";
// JSON time zones
const allTimeZonesRaw = fs.readFileSync(__dirname + "/routes/list-time-zone.json");


/**
 *  App Configuration
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded());
app.use(express.json());

/**
 * Routes Definitions
 */

app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/views/index.html'));
});

app.get("/AvailableTimeZones", function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.end(allTimeZonesRaw);
});

// Create event
app.post('/create-event-form', function(req, res){
    var data = {
        "startTime": req.body.startTime,
        "endTime": req.body.endTime,
        "date": req.body.date,
        "location": req.body.location,
        "title": req.body.title,
        "eventURL": req.body.eventURL,
        "desc": req.body.desc,
        "textColor": req.body.eventTextColor,
        "linkColor": req.body.eventLinkColor,
        "bgColor": req.body.eventBgColor,
    }
    var jsonData = JSON.stringify(data)
    fs.writeFile (__dirname +"/routes/events.json", jsonData, function(err) {
        if (err) throw err;
        //console.log('Event created / updated');
        }
    );
    res.redirect("/event-page")
});

// time caculator
app.post('/time-calculate-between', function(req, res){
    var startS = req.body.startS;
    var endS = req.body.endS;
    if(endS < startS){
        endS += 86400
    }
    var rezS = endS - startS;
    var rezM = Math.floor(rezS / 60);
    var rezH = Math.floor(rezM / 60);

    var data = {
        start: req.body.startS,
        end: req.body.endS,
        returnS: rezS,
        returnM: rezM,
        returnH: rezH,
    }
    var jsonData = JSON.stringify(data)
    fs.writeFile (__dirname + "/routes/timeCalcData.json", jsonData, function(err) {
        if (err) throw err;
        //console.log('time data created / updated');
        }
    );
    res.end();
});

app.post('/time-calculate-after', function(req, res){
    var startS = req.body.startS;
    var endS = req.body.endS;

    var returnS = endS + startS;
    var m = moment();
    m.set({hour:0,minute:0,second:0,millisecond:0});
    var returnTime = m.add(returnS, 'seconds').format("HH:mm");

    var data = {
        start: startS,
        end: endS,
        return: returnTime,
    }
    var jsonData = JSON.stringify(data)
    fs.writeFile (__dirname + "/routes/timeCalcData.json", jsonData, function(err) {
        if (err) throw err;
        //console.log('time data created / updated');
        }
    );
    res.end();
});

app.get("/eventData", function(req, res) {
    var eventInfoRaw = fs.readFileSync(__dirname + "/routes/events.json");
    res.setHeader('Content-Type', 'application/json');
    res.end(eventInfoRaw);
});

app.get("/timeCalcData", function(req, res) {
    var timeCalcData = fs.readFileSync(__dirname + "/routes/timeCalcData.json");
    res.setHeader('Content-Type', 'application/json');
    res.end(timeCalcData);
});

app.get('/create-event',function(req,res){
    res.sendFile(path.join(__dirname+'/views/createEvent.html'));
});

app.get('/event-page',function(req,res){
    res.sendFile(path.join(__dirname+'/views/event-page.html'));
});

app.get('/time-calculator-between',function(req,res){
    res.sendFile(path.join(__dirname+'/views/time-calculator-between.html'));
});

app.get('/time-calculator-after',function(req,res){
    res.sendFile(path.join(__dirname+'/views/time-calculator-after.html'));
});

app.get("/download", function(req, res){
    res.download(__dirname + "/uploads/izvestaj.pdf")
});

/**
 * Server Activation
 */
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});
