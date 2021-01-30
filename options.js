// Saves options to chrome.storage
function save_options() {
    let usertoken = document.getElementById('apikey').value;

    chrome.storage.sync.set({"WKapikey": usertoken});
    
    let alert = document.getElementById('alert');
    alert.innerHTML = 'API token saved';
    setTimeout(function() {window.close();}, 2000);
}

function clear_options() {
    chrome.storage.sync.remove("WKapikey");
    
    let alert = document.getElementById('alert');
    alert.innerHTML = 'All cleared';
    setTimeout(function() {window.close();}, 1000);
}

document.getElementById('save').addEventListener('click', save_options);
document.getElementById('clear').addEventListener('click', clear_options);