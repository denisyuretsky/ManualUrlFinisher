"use strict";

var rowsCount = 4;

function updateTextInput(val) {
  document.getElementById("textInput").value = val;
}

function save_options() {
  var numbers = [];

  for (var i = 0; i < rowsCount; i++) {
    var number = document.getElementById("muf-number-" + i).value;
    numbers[i] = number;
  }

  var url = document.getElementById("muf-url").value;

  chrome.storage.sync.set(
    {
      contentUrl: url,
      numbers: numbers,
    },
    function () {
      var status = document.getElementById("status");
      status.textContent = "Options saved.";
      setTimeout(function () {
        status.textContent = "";
      }, 750);
    }
  );
}

function restore_options() {
  chrome.storage.sync.get(
    {
      contentUrl: "",
      numbers: [-1, -1, -1, -1],
    },
    function (items) {
      for (var i = 0; i < rowsCount; i++) {
        var element = document.getElementById("muf-number-" + i);
        element.value = items.numbers[i];
      }

      document.getElementById("muf-url").value = items.contentUrl;
    }
  );
}

document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);
