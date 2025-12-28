// Finds which page the user is on
function getPageKey() {
  const u = new URL(window.location.href);
  return u.origin + u.pathname + u.search;
}

// Read saved page data from the chrome storage
function readPageData(pageKey, callback) {

}

// Saves updated pin data to chrome storage
function writePageData(pageKey, Data, callback) {

}

// get current scroll position (returns vertical scroll position)
function getCurrentScrollPosition() {

}

function savePin(slotNumber, name) {

}