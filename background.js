function check() {
    chrome.storage.sync.get(["WKapikey","notifyWKlessons"], function(result) {
        var WKToken = result.WKapikey;
        var lessonsenabled = result.notifyWKlessons;
  
        function apiEndpoint(path, token) {
            let requestHeaders =
                new Headers({
                'Wanikani-Revision': '20170710',
                Authorization: 'Bearer ' + token,
                });
            let request =
                new Request('https://api.wanikani.com/v2/' + path, {
                method: 'GET',
                headers: requestHeaders
                });
            return request;
        }
  
        if (typeof WKToken === "undefined") {
            chrome.browserAction.setBadgeText({text: ''});
        } else {
            fetch(apiEndpoint('assignments?immediately_available_for_review', WKToken))
                .then(response => response.json())
                .then(responseBody => {

                    if(responseBody.total_count > 0) {
                        chrome.browserAction.setBadgeText({text: String(responseBody.total_count)});
                        chrome.browserAction.setBadgeBackgroundColor({color: '#00aaff'});
                    
                    } else if(lessonsenabled) {
                        fetch(apiEndpoint('assignments?immediately_available_for_lessons', WKToken))
                            .then(response => response.json())
                            .then(responseBody => {
                                if(responseBody.total_count > 0) {
                                    chrome.browserAction.setBadgeText({text: String(responseBody.total_count)});
                                    chrome.browserAction.setBadgeBackgroundColor({color: '#f100a1'});
                                } else {
                                    chrome.browserAction.setBadgeText({text: ''});
                                }
                            })

                    } else {
                        chrome.browserAction.setBadgeText({text: ''});
                    }
                })
        }
    })
    window.setTimeout(check, 10000);
}

check();