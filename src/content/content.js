// HELPER FUNCTIONS
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

// PIN FUNCTION
// Saves the users Pin
function savePin(slotNumber, name, callback) {
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

// GO FUNCTION
// scroll to saved anchor
function goPin(slotNumber) {
    var pageKey = getPageKey(); // get URL 

    readPageData(pageKey, function (pageData) {
        var slotKey = String(slotNumber);
        var slotData = pageData[slotKey];

        if (slotData === undefined) { // if anchor doesn't exist, return
        return;
        }

        // if anchor exists go to the saved position
        var y = slotData.y;

        window.scrollTo({
        top: y,
        behavior: "smooth"
        });
    });
}

// DELETE FUNCTION
function clearPin(slotNumber, callback) {
    var pageKey = getPageKey();

    readPageData(pageKey, function (pageData) {
        delete pageData[String(slotNumber)];

        writePageData(pageKey, pageData, function () {
        if (callback) {
            callback(pageData);
        }
        });
    });
}