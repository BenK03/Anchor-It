// Runs when popup opens
document.addEventListener("DOMContentLoaded", function () {
    // Grab the 3 slot sections by class
    var slot1 = document.querySelector(".slot1");
    var slot2 = document.querySelector(".slot2");
    var slot3 = document.querySelector(".slot3");

    // Wire each slot to a event listener
    wireSlot(slot1, 1); 
    wireSlot(slot2, 2);
    wireSlot(slot3, 3);

    // if saved slot data already exists get the data andcall applySlotState
    sendMessageToActiveTab({ type: "get_state" }, function (response) {
    if (!response || response.ok !== true) {
        return;
    }

    var pageData = response.pageData || {};

    applySlotState(slot1, 1, pageData);
    applySlotState(slot2, 2, pageData);
    applySlotState(slot3, 3, pageData);
    });
});

// Display existing anchors
function applySlotState(section, slotNumber, pageData) {
    var input = section.querySelector("input.name");
    var goBtn = section.querySelector("button.go");
    var clearBtn = section.querySelector("button.clear");

    var slotKey = String(slotNumber);
    var slotData = pageData[slotKey];

    if (slotData) {
        input.value = slotData.name || "";
        goBtn.disabled = false;
        clearBtn.disabled = false;
    } else {
        input.value = "";
        goBtn.disabled = true;
        clearBtn.disabled = true;
    }
}

// wires each slot to an event listener
function wireSlot(section, slotNumber) {

    // DOM missing so do nothing
    if (!section) {
        return;
    }

    // name the input variables
    var editWrap = section.querySelector(".slot-edit");
    var savedWrap = section.querySelector(".slot-saved");

    var input = editWrap ? editWrap.querySelector("input.name") : null;
    var saveBtn = editWrap ? editWrap.querySelector("button.save") : null;
    var goBtn = editWrap ? editWrap.querySelector("button.go") : null;
    var clearBtn = editWrap ? editWrap.querySelector("button.clear") : null;

    var savedNameEl = savedWrap ? savedWrap.querySelector(".saved-name") : null;
    var savedGoBtn = savedWrap ? savedWrap.querySelector("button.go") : null;
    var savedClearBtn = savedWrap ? savedWrap.querySelector("button.clear") : null;

    // make sure all data is there
    if (!editWrap || !savedWrap || !input || !saveBtn || !goBtn || !clearBtn || !savedNameEl || !savedGoBtn || !savedClearBtn) {
        return;
    }

    // when Pin button is clicked add name and type to the obj
    saveBtn.addEventListener("click", function () {
        var name = input.value.trim();

        // sends object to chrome then chrome sends to content script to activate corresponding function
        sendMessageToActiveTab({
        type: "save",
        slot: slotNumber,
        name: name
        });
    });

    // when Go button is clicked add type to the obj
    goBtn.addEventListener("click", function () {

        // sends object to chrome then chrome sends to content script to activate corresponding function
        sendMessageToActiveTab({
        type: "go",
        slot: slotNumber
        });
    });

    // when Delete button is clicked add type to the obj
    clearBtn.addEventListener("click", function () {

        // sends object to chrome then chrome sends to content script to activate corresponding function
        sendMessageToActiveTab({
        type: "clear",
        slot: slotNumber
        });
    });
}

// (Helper) get the current active tab then send the message to chrome which then sends it to content.js
function sendMessageToActiveTab(message, callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var tab = tabs[0];

        if (!tab || !tab.id) {
        return;
        }

        chrome.tabs.sendMessage(tab.id, message, function (response) {
        if (chrome.runtime.lastError) {
            return;
        }

        if (callback) {
            callback(response);
        }
        });
    });
}