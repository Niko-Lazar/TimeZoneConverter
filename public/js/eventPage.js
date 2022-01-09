const domEvent = {
    title: document.getElementById("event_page_title"),
    desc: document.getElementById("event_page_desc"),
    startTime: document.getElementById("event_page_start_time"),
    endTime: document.getElementById("event_page_end_time"),
    date: document.getElementById("event_page_date"),
    loc: document.getElementById("event_page_loc"),
    body: document.getElementsByTagName("BODY")[0],
}

window.addEventListener('load', function() {
    (function init() {
        function getEventZone() {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "/eventData", false);
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

        function appendData(data) {
            domEvent.title.innerText = data.title;
            domEvent.title.href = data.eventURL;
            domEvent.title.innerText = data.title;
            domEvent.desc.innerText = data.desc;
            domEvent.startTime.innerText = data.startTime;
            domEvent.endTime.innerText = data.endTime;
            domEvent.date.innerText = data.date;
            domEvent.loc.innerText = data.location;

            if(data.linkColor != "#000000"){
                domEvent.title.style.color = data.linkColor;
            }
            if(data.textColor != "#000000"){
                domEvent.body.style.color = data.textColor;
            }
            if(data.bgColor != "#000000"){
                domEvent.body.style.backgroundColor = data.bgColor;
            }
        }

        appendData(getEventZone())
    })();
});
