// Finds which page the user is on
function getPageKey() {
  const u = new URL(window.location.href);
  return u.origin + u.pathname + u.search;
}

// Read saved page data from the chrome storage
function readPageData(pageKey, callback) {
    // get the pageKey data and store it in storedData
    chrome.storage.local.get(pageKey, function (result) {
        var storedData = result[pageKey];

        // if nothing 
        if (storedData === undefined) {
        callback({});

        // if data exists it gives us the data
        } else {
        callback(storedData);
        }
    });
}

// Saves updated pin data to chrome storage
function writePageData(pageKey, data, callback) { // pageKey: where to store, data: what to store, callback: code to run after
    var objToSave = {}; // create an empty obj
    objToSave[pageKey] = data;

    // saves obj to chrome storage
    chrome.storage.local.set(objToSave, function () {
        callback();
    });
}

// get current scroll position (returns vertical scroll position)
function getCurrentScrollPosition() {
    return window.scrollY;
}

function savePin(slotNumber, name) {
    var pageKey = getPageKey();

}