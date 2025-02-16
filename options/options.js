"use strict";

import { ROWS_COUNT, DEFAULT_NUMBER } from "../shared/constants.js";
import { loadStoredData } from "../shared/storage.js";

const saveOptions = () => {
  var numbers = [];

  for (var i = 0; i < ROWS_COUNT; i++) {
    var parsedNumber = Number(document.getElementById(`muf-number-${i}`).value) || DEFAULT_NUMBER;
    numbers.push(parsedNumber);
  }

  var url = document.getElementById("muf-url").value.trim();

  chrome.storage.sync.set(
    {
      contentUrl: url,
      numbers: numbers,
    },
    function () {
      var status = document.getElementById("muf-status");
      status.textContent = "Options saved.";
      setTimeout(function () {
        status.textContent = "";
      }, 750);
    }
  );
};

const initialize = () => {
  loadStoredData().then((items) => {
    items.numbers.forEach((value, index) => {
      document.getElementById(`muf-number-${index}`).value = value;
    });

    document.getElementById("muf-url").value = items.contentUrl;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initialize();
  document.getElementById("muf-save").addEventListener("click", saveOptions);
});
