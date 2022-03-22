// set alarm to do an API call every minute
chrome.alarms.create("check", {periodInMinutes: 1});
chrome.alarms.onAlarm.addListener(() => {
    check();
});

// listen for messages from other components
chrome.runtime.onMessage.addListener((request) => {
    if (request.do === "check") {
        check();
        return true;
    }
})

// checks reviews/lessons and updates badge
function check() {
    chrome.storage.sync.get(["WKapikey","notifyWKlessons", "vacationModeActive"], function(result) {
        var WKToken = result.WKapikey;
        var lessonsenabled = result.notifyWKlessons;
        var onvacation = result.vacationModeActive;

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
            chrome.action.setBadgeText({text: ''}); 
        } else if (onvacation) {
            chrome.action.setIcon({path: {16: 'images/icon_16_grayscale.png', 32: 'images/icon_32_grayscale.png'}});
            chrome.action.setBadgeText({text: 'REST'});
            chrome.action.setBadgeBackgroundColor({color: '#d4d4d4'});
        } else {
            chrome.action.setIcon({path: {16: 'images/icon_16.png', 32: 'images/icon_32.png'}});
            fetch(apiEndpoint('assignments?immediately_available_for_review', WKToken))
                .then(response => response.json())
                .then(responseBody => {

                    if(responseBody.total_count > 0) {
                        chrome.action.setBadgeText({text: String(responseBody.total_count)});
                        chrome.action.setBadgeBackgroundColor({color: '#00aaff'});

                    } else if(lessonsenabled) {
                        fetch(apiEndpoint('assignments?immediately_available_for_lessons', WKToken))
                            .then(response => response.json())
                            .then(responseBody => {
                                if(responseBody.total_count > 0) {
                                    chrome.action.setBadgeText({text: String(responseBody.total_count)});
                                    chrome.action.setBadgeBackgroundColor({color: '#f100a1'});
                                } else {
                                    chrome.action.setBadgeText({text: ''});
                                }
                            })

                    } else {
                        chrome.action.setBadgeText({text: ''});
                    }
                })
        }
    })
}