function check() {
    chrome.storage.sync.get("WKapikey", function(result) {
        var WKToken = result.WKapikey;
  
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
                    } else {
                        chrome.browserAction.setBadgeText({text: ''});
                    }
                })
        }
    })
    window.setTimeout(check, 10000);
}

check();