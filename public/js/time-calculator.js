// time calculator.js
const domTimeCalc = {
    timeBetween: document.getElementById("time_calc_between"),
    timeAfter: document.getElementById("time_calc_after"),
    inputStart: document.getElementById("time_calc_start"),
    inputEnd: document.getElementById("time_calc_end"),
    rezult: document.getElementById("time_calc_rez"),
}


function getTimeRez() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/timeCalcData", false);
    xhr.send();
    // stop the engine while xhr isn't done
    for(; xhr.readyState !== 4;) 
    if (xhr.status === 200) {
        //console.log('SUCCESS', xhr.responseText);
    } else console.warn('request_error');

    var jsonData = JSON.parse(xhr.responseText);
    var data = jsonData;
    return data;
}

function checkTimeInput(input){
    var checkTime = /^[0-9]{1,2}:[0-9]{1,2}$/
    if(input.match(checkTime)){
        return true
    } else{
        return false
    }
}


function calculateBetween() {
    
    function sendTime(){
        var start = domTimeCalc.inputStart.value;
        var end = domTimeCalc.inputEnd.value;

        if(start != "" && end != ""){
            if(checkTimeInput(start)){
                var startH = start.split(":")[0];
                var startM = start.split(":")[1];
                if(startH >= 0 && startH <= 24){
                    var startS = parseInt(startH)*3600 + parseInt(startM)*60;
                }
            } else{
                startS = parseInt(start)*3600;
            }

            if(checkTimeInput(end)){
                var endH = end.split(":")[0];
                var endM = end.split(":")[1];
                if(endH >= 0 && endH <= 24){
                    var endS = parseInt(endH)*3600 + parseInt(endM)*60;
                }
            } else{
                var endS = parseInt(end)*3600;
            }
        }
        var xmlhttp = new XMLHttpRequest();url
        var url = "/time-calculate-between";
        xmlhttp.open("POST", url);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify({ "startS": startS, "endS": endS, }));
    }

    function appendData() {
        if(domTimeCalc.inputStart.value != "" && domTimeCalc.inputEnd.value != ""){
            //sendTime();
            var data = getTimeRez();
            var textNodeS = data.returnS;
            var textNodeM = data.returnM;
            var textNodeH = data.returnH;
            domTimeCalc.rezult.style.color = "white"
            if(textNodeM%60 == 0){
                domTimeCalc.rezult.innerHTML = `
                ${textNodeS} seconds<br>
                ${textNodeM} minutes<br>
                ${textNodeH} hours
            `;
            } else{
                var mod = textNodeH*60;
                domTimeCalc.rezult.innerHTML = `
                ${textNodeS} seconds<br>
                ${textNodeM} minutes<br>
                ${textNodeH} hours ${textNodeM - mod} minutes
            `;
            }
        }
    }

    sendTime()
    appendData()
}

function calculateAfter(){
    function sendTime(){
        var start = domTimeCalc.inputStart.value;
        var end = domTimeCalc.inputEnd.value;
        
        if(start.charAt(start.toLowerCase().indexOf('h')).startsWith('h')){
            start = parseInt(start);
            var startS = start*3600;
        } else if(start.charAt(start.toLowerCase().indexOf('m')).startsWith('m')){
            start = parseInt(start);
            var startS = start*60;
        } else if(start.charAt(start.toLowerCase().indexOf('s')).startsWith('s')){
            startS = parseInt(start);
        } else {
            startS = "";
        }
        
        if(checkTimeInput(end)){
            var endH = end.split(":")[0];
            var endM = end.split(":")[1];
            if(endH >= 0 && endH <= 24){
                var endS = parseInt(endH)*3600 + parseInt(endM)*60;
            }
        } else{
            var endS = parseInt(end)*3600;
        }   

        var xmlhttp = new XMLHttpRequest();url
        var url = "/time-calculate-after";
        xmlhttp.open("POST", url);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify({ "startS": startS, "endS": endS, }));
    }

    function appendData() {
        if(domTimeCalc.inputStart.value != "" && domTimeCalc.inputEnd.value != ""){
            var data = getTimeRez();
            var time = data.return;
            domTimeCalc.rezult.style.color = 'white'
            domTimeCalc.rezult.innerHTML = time;
        }
    }

    sendTime()
    getTimeRez()
    appendData()
}