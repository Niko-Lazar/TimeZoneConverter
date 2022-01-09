const dom = {
    //left box
    inputTime: document.getElementById('input_time'),
    searchBar_left: document.getElementById('searchBar_left'),
    searchList_left: document.getElementById('searchList_left'),
    resultList_left: document.querySelectorAll('.searchList_left li'),
    // right box
    resultTime: document.getElementById("converted_time"),
    searchBar_right: document.getElementById('searchBar_right'),
    searchList_right: document.getElementById('searchList_right'),
    resultList_right: document.querySelectorAll('.searchList_right li'),
}


window.addEventListener('load', function() {
    (function init() {
        console.log('stranica ucitana');

        const config = {
            key: 'NM9O6L74C3B2',
            api: 'http://api.timezonedb.com',
        }

        geoLocation()
        pretragaZona()
        // ********************     GET CURRENT LOCATION TIME   ********************
        function geoLocation(){
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
            } else { 
                alert('Geolocation is not supported by this browser.');
                }
            function showPosition(position) {
                const lat = position.coords.latitude;
                const long = position.coords.longitude;
                getCurrentLocation(lat, long)
            }
        }

        function getCurrentLocation(lat, long){
            var url = `http://api.timezonedb.com/v2.1/get-time-zone?key=${config.key}&format=json&by=position&lat=${lat}&lng=${long}`;
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url);

            xhr.setRequestHeader("accept", "application/json");

            xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                //console.log(xhr.status);
                //console.log(JSON.parse(xhr.response));
                var data = JSON.parse(xhr.response);
                let m = moment(data.formatted)
                dom.inputTime.value = m.format("HH:mm");
                dom.searchBar_left.value = data.countryName
            }};
            xhr.send();
        }

        // ********************     PRETRAGA MOGUCIH ZONA       ********************
        function pretragaZona() {
            var url = "/AvailableTimeZones";
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.setRequestHeader("accept", "application/json");
    
            xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                //console.log(xhr.status);
                var jsonData = JSON.parse(xhr.responseText).zones;
                var data = jsonData;
    
                //  ***** DESNO *****
                dom.searchBar_right.addEventListener("input", (event) => {
                    dom.searchList_right.style.visibility = 'visible';
                    dom.searchList_right.style.display = 'block';
                    let zona = event.target.value;
                        if(zona && zona.trim().length > 0){
                            zona = zona.trim().toLowerCase();
                            setList(dom.searchList_right, data.filter(z => {
                                return z.countryName.toLowerCase().includes(zona);
                            }).sort((zonaA, zonaB) => {
                                return getRelevancy(zonaB, zona) - getRelevancy(zonaA, zona);
                            }));
                        } else{
                            clearList(dom.searchList_right);
                        }
                });
    
                //  ***** LEVO  *****
                dom.searchBar_left.addEventListener("input", (event) => {
                    dom.searchList_left.style.visibility = 'visible';
                    dom.searchList_left.style.display = 'block';
                    let zona  = event.target.value;
                        if(zona && zona.trim().length > 0){
                            zona = zona.trim().toLowerCase();
                            setList(dom.searchList_left, data.filter(z => {
                                return z.countryName.toLowerCase().includes(zona);
                            }).sort((zonaA, zonaB) => {
                                return getRelevancy(zonaB, zona) - getRelevancy(zonaA, zona);
                            }));
                        } else{
                            clearList(dom.searchList_left);
                        }
                });
    
            }};
            xhr.send();
        }

        // HELPER funkcije za pretragu
        function setList(el, data){
            clearList(el);
            for(let i=0;i<data.length;i++){
                const li = document.createElement('li');
                const text = document.createTextNode(data[i].countryName);
                li.appendChild(text);
                el.appendChild(li);
            }
            if(data.length == 0) {
                setNoResults(el);
            }
        }

        function getRelevancy(value, searchTerm) {
            if(value.countryName == searchTerm){
                return 2;
            } else if(value.countryName.toLowerCase().startsWith(searchTerm)){
                return 1;
            } else{
                return 0;
            }
        }

        function clearList(el){
            while(el.firstChild){
                el.removeChild(el.firstChild);
            }
        }

        function setNoResults(el){
            const li = document.createElement('li');
                const text = document.createTextNode('No results found');
                li.appendChild(text);
                el.appendChild(li);
        }

        function getZoneInfo(zona) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "/AvailableTimeZones", false);
            xhr.send();
            // stop the engine while xhr isn't done
            for(; xhr.readyState !== 4;) 
            if (xhr.status === 200) {
                //console.log('SUCCESS', xhr.responseText);
            } else console.warn('request_error');

            var jsonData = JSON.parse(xhr.responseText).zones;
            var data = jsonData;
            var zona = data.filter(z => {
                return z.countryName == zona;
            });
            return zona;
        }
        function getCurrentTime(input) {
            var zoneName = getZoneInfo(input)[0].zoneName
            var xhr = new XMLHttpRequest();
                xhr.open("GET", `http://api.timezonedb.com/v2.1/get-time-zone?key=${config.key}&format=json&by=zone&zone=${zoneName}`, false);
                xhr.send();
                // stop the engine while xhr isn't done
                for(; xhr.readyState !== 4;) 
                if (xhr.status === 200) {
                    //console.log('SUCCESS', xhr.responseText);
                } else console.warn('request_error');
                var jsonData = JSON.parse(xhr.responseText)
                data = jsonData
                return data;
        }
        // f-ja za konverziju
        function getTimeWhen(from, to, input){
            var from = getZoneInfo(from)[0];
            var to = getZoneInfo(to)[0];
            var fromOffset = from.gmtOffset / 3600;
            var toOffset = to.gmtOffset / 3600;
            var fromTime = moment(input, "HH:mm").add(-fromOffset, 'hours').format('HH:mm');
            var toTime =  moment(fromTime, "HH:mm").add(toOffset, 'hours').format('HH:mm');
            return toTime
        }

        // ******************** EVENT LISTENERS ******************** //
        dom.searchList_right.addEventListener('click', function(event) {
            var data = event.target.textContent;
            dom.searchBar_right.value = data;
            dom.searchList_right.style.visibility = 'hidden';

            var date = getCurrentTime(dom.searchBar_right.value).formatted;
            dom.resultTime.value = moment(date).format("HH:mm")        
        });

        dom.searchList_left.addEventListener('click', function(event) {
            var data = event.target.textContent;
            dom.searchBar_left.value = data;
            dom.searchList_left.style.visibility = 'hidden';

            var date = getCurrentTime(dom.searchBar_left.value).formatted;
            dom.inputTime.value = moment(date).format("HH:mm")
        });

        dom.inputTime.addEventListener('input', function(){
            if(dom.inputTime.value != "" || dom.resultTime.value != ""){
                dom.resultTime.value = getTimeWhen(dom.searchBar_left.value, dom.searchBar_right.value, dom.inputTime.value)
            }
            
        });

        dom.resultTime.addEventListener('input', function(){
            if(dom.inputTime.value != "" || dom.resultTime.value != ""){
                dom.inputTime.value =  getTimeWhen(dom.searchBar_left.value, dom.searchBar_right.value, dom.resultTime.value)
            }
        });


    })();
});