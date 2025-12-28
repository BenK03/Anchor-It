// Runs when popup opens
document.addEventListener("DOMContentLoaded", function () {
    // Grab the 3 slot sections by class
    window.slot1 = document.querySelector(".slot1");
    window.slot2 = document.querySelector(".slot2");
    window.slot3 = document.querySelector(".slot3");

    // Wire each slot to a event listener
    wireSlot(window.slot1, 1); 
    wireSlot(window.slot2, 2);
    wireSlot(window.slot3, 3);
    refreshUI();
});

// if there is existing anchors show them
function refreshUI() {
    sendMessageToActiveTab({ type: "get_state" }, function (response) {
        if (!response || response.ok !== true) {
            return;
        }

        var pageData = response.pageData || {};

        renderSlot(window.slot1, 1, pageData);
        renderSlot(window.slot2, 2, pageData);
        renderSlot(window.slot3, 3, pageData);
    });
}

// decides which UI to show for each slot
function renderSlot(section, slotNumber, pageData) {
    var editWrap = section.querySelector(".slot-edit");
    var savedWrap = section.querySelector(".slot-saved");

    var input = editWrap.querySelector("input.name");
    var savedNameEl = savedWrap.querySelector(".saved-name");

    var slotKey = String(slotNumber);
    var slotData = pageData && pageData[slotKey] ? pageData[slotKey] : null;

    if (slotData) {
        savedNameEl.textContent = slotData.name || "";
        savedWrap.style.display = "block";
        editWrap.style.display = "none";
    } else {
        input.value = "";
        savedWrap.style.display = "none";
        editWrap.style.display = "block";
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
        sendMessageToActiveTab(
            { type: "save", slot: slotNumber, name: name },

            // when chrome is done run refreshUI()
            function () {
                refreshUI();
            }
        );
    });

    // when Go button is clicked add type to the obj (edit UI)
    goBtn.addEventListener("click", function () {

        // sends object to chrome then chrome sends to content script to activate corresponding function
        sendMessageToActiveTab({
            type: "go",
            slot: slotNumber
        });
    });

    // when Go button is clicked add type to the obj (saved UI)
    savedGoBtn.addEventListener("click", function () {
        sendMessageToActiveTab({
            type: "go",
            slot: slotNumber
        });
    });

    // when Delete button is clicked add type to the obj (edit UI)
    clearBtn.addEventListener("click", function () {

        // sends object to chrome then chrome sends to content script to activate corresponding function
        sendMessageToActiveTab(
            { type: "clear", slot: slotNumber },

            // when chrome is done run refreshUI()
            function () {
                refreshUI();
            }
        );
    });

    // when Delete button is clicked add type to object (saved UI)
    savedClearBtn.addEventListener("click", function () {
        sendMessageToActiveTab(
            { type: "clear", slot: slotNumber },
            function () {
                refreshUI();
            }
        );
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