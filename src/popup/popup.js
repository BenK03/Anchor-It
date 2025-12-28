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
});

// wires each slot to an event listener
function wireSlot(section, slotNumber) {

    // DOM missing so do nothing
    if (!section) {
        return;
    }

    // name the input variables
    var input = section.querySelector("input.name");
    var saveBtn = section.querySelector("button.save");
    var goBtn = section.querySelector("button.go");
    var clearBtn = section.querySelector("button.clear");

    // make sure all data is there
    if (!input || !saveBtn || !goBtn || !clearBtn) {
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
function sendMessageToActiveTab(message) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var tab = tabs[0];

    if (!tab || !tab.id) {
      return;
    }

    chrome.tabs.sendMessage(tab.id, message);
  });
}