// Check URL
function getPageKey() {
  const u = new URL(window.location.href);
  return u.origin + u.pathname + u.search;
}

// Storage helper
function readPageData(pageKey, callback) {
  chrome.storage.local.get(pageKey, function (result) {
    var storedValue = result[pageKey];

    if (storedValue === undefined) {
      callback({});
    } else {
      callback(storedValue);
    }
  });
}
// Storage helper
function writePageData(pageKey, data, callback) {
  var objToSave = {};
  objToSave[pageKey] = data;

  chrome.storage.local.set(objToSave, function () {
    callback();
  });
}