// Saves options to chrome.storage
function save_options() {
    let usertoken = document.getElementById('apikey').value;
    let notifylessons = document.getElementById('notifylessons').checked;

    chrome.storage.sync.set({"notifyWKlessons": notifylessons});

    if(usertoken.length > 0) {
        chrome.storage.sync.set({"WKapikey": usertoken});
    }
    
    let alert = document.getElementById('alert');
    alert.innerHTML = 'All saved! - Ready to go';
    setTimeout(function() {window.close();}, 2000);
}

function clear_options() {
    chrome.storage.sync.remove("WKapikey");
    chrome.storage.sync.remove("notifyWKlessons");
    
    let alert = document.getElementById('alert');
    alert.innerHTML = 'All cleared! - Now add your API token';
}

document.getElementById('save').addEventListener('click', save_options);
document.getElementById('clear').addEventListener('click', clear_options);

// retrieve current status and updates checkbok
function update_checkbox() {
    chrome.storage.sync.get("notifyWKlessons", function(result) {
        var lessonsenabled = result.notifyWKlessons;

        // set to false if nothing in storage
        if (typeof lessonsenabled === "undefined") {
            chrome.storage.sync.set({"notifyWKlessons": false});
        }

        document.getElementById('notifylessons').checked = lessonsenabled;
    })
}

update_checkbox();