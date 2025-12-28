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

// Above are all helper functions for this function
// Saves the users Pin
function savePin(slotNumber, name) {
    var pageKey = getPageKey(); // get URL

    // read existing data for the URL e.g., existing pins
    readPageData(pageKey, function (pageData) {

        // get the current scroll position
        var y = getCurrentScrollPosition();

        // update the object with the name and current scroll position
        pageData[String(slotNumber)] = { // saves it in the current slot number (converts slot number to a str)
        name: name, // stores anchor name
        y: y // stores scroll position
        };

        // save the updated data to the chrome storage
        writePageData(pageKey, pageData, function () {
        if (callback) {
            callback(pageData);
        }
        });
    });
}