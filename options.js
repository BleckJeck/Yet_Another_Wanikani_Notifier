// Saves options to chrome.storage
function save_options() {
    let usertoken = document.getElementById('apikey').value;
    let notifylessons = document.getElementById('notifylessons').checked;
    let onvacation = document.getElementById('vacationmode').checked;

    chrome.storage.sync.set({"notifyWKlessons": notifylessons});
    chrome.storage.sync.set({"vacationModeActive": onvacation});

    if(usertoken.length > 0) {
        chrome.storage.sync.set({"WKapikey": usertoken});
    }

    let alert = document.getElementById('alert');
    alert.innerHTML = 'All saved! - Ready to go';
    setTimeout(function() {window.close();}, 2000);

    chrome.runtime.sendMessage({do: "check"});
}

function clear_options() {
    chrome.storage.sync.remove("WKapikey");
    document.getElementById('apikey').value = "";

    chrome.storage.sync.remove("notifyWKlessons");
    document.getElementById('notifylessons').checked = false;

    chrome.storage.sync.remove("vacationModeActive");
    document.getElementById('vacationmode').checked = false;

    let alert = document.getElementById('alert');
    alert.innerHTML = 'All cleared! - Now add your API token';

    chrome.runtime.sendMessage({do: "check"});
}

document.getElementById('save').addEventListener('click', save_options);
document.getElementById('clear').addEventListener('click', clear_options);


// Retrieve options from chrome.storage
function load_options() {
    chrome.storage.sync.get(["notifyWKlessons", "WKapikey", "vacationModeActive"], function(result) {
        if (result.WKapikey != undefined) {
            document.getElementById('apikey').value = result.WKapikey;
        }
        
        // set to false if nothing in storage
        if (typeof result.notifyWKlessons === "undefined") {
            chrome.storage.sync.set({"notifyWKlessons": false});
        }
        if (typeof result.vacationModeActive === "undefined") {
            chrome.storage.sync.set({"vacationModeActive": false});
        }

        document.getElementById('notifylessons').checked = result.notifyWKlessons;
        document.getElementById('vacationmode').checked = result.vacationModeActive;
    });
}

load_options();
chrome.runtime.sendMessage({do: "check"});