window.onload = function () {
  initElements();

  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })
}

function initElements() {
  annotationListeners();
  exportListeners();
  updateCounters();
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })
}

function annotationListeners() {
  $(document).on('click', '#BugBtn', showBugReport);
  $(document).on('click', '#QuestionBtn', showQuestionReport);
  $(document).on('click', '#addNewBugBtn', () => {
    addNewBug("")
  });
  $(document).on('click', '#addNewQuestionBtn', () => {
    //addNewQuestion("")
    addActionClick()
  });
  $(document).on('click', '#addNewBugSCBtn', () => {
    addNewAnnotationWithScreenShot("bug")
  });
  $(document).on('click', '#addNewQuestionSCBtn', () => {
    addNewAnnotationWithScreenShot("question"),
      $("#footerCard").fadeIn();
  });
}

function showBugReport() {
  hideAllReports();
  $("#addNewBug").fadeIn();
  $('#newBugDescription').focus();
};


function showQuestionReport() {
  hideAllReports();
  $("#addNewQuestion").fadeIn();
  $('#newQuestionDescription').focus();
};


function addNewBug(imageURL) {
  var bugName = $('#newBugDescription').val().trim();
  if (bugName == "") return;

  chrome.extension.sendMessage({
    type: "addBug",
    name: bugName,
    imageURL: imageURL
  }, function (response) {
    updateCounters();
  });

  clearAllReports();
  hideAllReports();
};

function addActionClick(){
  /*
  document.addEventListener('click', function (e) {
    e = e || window.event;
    var target = e.target || e.srcElement,
      text = target.textContent || target.innerText;
      alert('Click on, desde el nuevo archivo= ' + text);
  }, false);*/
  chrome.browserAction.onClicked.addListener(function(tab){
    chrome.tabs.executeScript(null,{file:"js/actionclick.js"})
})
};

function addNewQuestion(imageURL) {
  var questionName = $('#newQuestionDescription').val().trim();
  var background = chrome.extension.getBackgroundPage();
  var session = background.session;
  var currentUrl;
  if (questionName == "") {
    /*
    document.addEventListener('click', function (e) {
      e = e || window.event;
      var target = e.target || e.srcElement,
        text = target.textContent || target.innerText;
        alert('Click on = ' + text);
    }, false);*/

    /*chrome.browserAction.onClicked.addListener(function(tab){
      chrome.tabs.executeScript(null,{file:"js/actionclick.js"})})*/
    chrome.tabs.query({
        currentWindow: true,
        active: true
      },
      function (tabs) {
        currentUrl = tabs[0].title;
        questionName = "Action: " + currentUrl;

        chrome.extension.sendMessage({
          type: "addQuestion",
          name: questionName,
          imageURL: imageURL
        }, function (response) {
          updateCounters();
        });

        clearAllReports();
        hideAllReports();
      });
  } else {
    chrome.extension.sendMessage({
      type: "addQuestion",
      name: questionName,
      imageURL: imageURL
    }, function (response) {
      updateCounters();
    });

    clearAllReports();
    hideAllReports();
  }
};

function addNewAnnotationWithScreenShot(type) {
  chrome.tabs.captureVisibleTab((screenshotUrl) => {
    if (screenshotUrl === 'undefined') screenshotUrl = "";
    switch (type) {
      case "bug":
        addNewBug(screenshotUrl);
        break;
      case "question":
        addNewQuestion(screenshotUrl);
        break;
    }
  })
}

/* Export to CSV  */
function exportSessionCSV() {
  chrome.extension.sendMessage({
    type: "exportSessionCSV"
  });
};

function exportListeners() {
  $(document).on('click', '#exportCSVBtn', exportSessionCSV);
  $(document).on('click', '#exportJsonBtn', exportSessionJSon);
  $(document).on('click', '#importJsonBtn', () => {
    $('#importJsonInput').click()
  });
  $(document).on('change', '#importJsonInput', importSessionJSon);
}

/* Export to JSon */
function exportSessionJSon() {
  chrome.extension.sendMessage({
    type: "exportSessionJSon"
  });
};


/* Import from JSon */
function importSessionJSon(evt) {
  debugger;
  var files = evt.target.files; // FileList object

  var reader = new FileReader();
  reader.onload = onReaderLoad;
  reader.readAsText(files[0]);
};

function onReaderLoad(event) {
  clearAllReports();
  var importSession = event.target.result;
  chrome.extension.sendMessage({
    type: "importSessionJSon",
    jSonSession: importSession
  }, function (response) {
    updateCounters();
    //Reset input value
    $('#importJsonInput').val("");
  });

}


document.addEventListener('DOMContentLoaded', function () {
  var cancelAnnotationBtn = document.getElementsByName("Cancel");
  for (var i = 0; i < cancelAnnotationBtn.length; i++) {
    cancelAnnotationBtn[i].addEventListener('click', cancelAnnotation);
  }
}, false);

function cancelAnnotation() {
  clearAllReports();
  hideAllReports();
};

function clearAllReports() {
  var descriptions = document.getElementsByTagName("textarea");
  for (i = 0; i < descriptions.length; i++) {
    descriptions[i].value = "";
  }
};

function hideAllReports() {
  $("#newBugDescription").val('');
  $("#newQuestionDescription").val('');

  $("#addNewBug").slideUp();
  $("#addNewQuestion").slideUp();
};

document.addEventListener('DOMContentLoaded', function () {
  var previewBtn = document.getElementById('previewBtn');
  previewBtn.addEventListener('click', function () {
    var background = chrome.extension.getBackgroundPage();
    var session = background.session;

    if (session.getAnnotations().length == 0) return;

    chrome.tabs.create({
      url: chrome.extension.getURL("HTMLReport/preview.html"),
      'active': false
    }, function (tab) {
      var selfTabId = tab.id;
      chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (changeInfo.status == "complete" && tabId == selfTabId) {
          // send the data to the page's script:
          var tabs = chrome.extension.getViews({
            type: "tab"
          });
          tabs[0].loadData();
        }
      });
    });
  }, false);
}, false);

function updateCounters() {
  var background = chrome.extension.getBackgroundPage();
  var session = background.session;

  var bugs = session.getBugs().length;
  var questions = session.getQuestions().length;

  bugs > 0 ? $("#bugCounter").html(" " + bugs + " ") : $("#bugCounter").html("");
  questions > 0 ? $("#questionCounter").html(" " + questions + " ") : $("#questionCounter").html("");
};

document.addEventListener('DOMContentLoaded', function () {
  var newBugDescription = document.getElementById("newBugDescription");
  newBugDescription.addEventListener("keypress", function (e) {
    var key = e.which || e.keyCode;
    // if ((e.keyCode == 10 || e.keyCode == 13) && e.ctrlKey) {
    //   $('#newBugDescription').val($('#newBugDescription').val() + '\n');
    // }
    if ((e.keyCode == 10 || e.keyCode == 13) && e.ctrlKey) {
      addNewBug("");
      $("#resetBtn").fadeIn();
    }
    if (key == 13) { // 13 is enter
      if (e.shiftKey == true) {
        addNewAnnotationWithScreenShot("bug");
        $("#resetBtn").fadeIn();
      }
    }
  }, false);
}, false);


document.addEventListener('DOMContentLoaded', function () {
  var newQuestionDescription = document.getElementById("newQuestionDescription");
  newQuestionDescription.addEventListener("keypress", function (e) {
    var key = e.which || e.keyCode;
    if ((e.keyCode == 10 || e.keyCode == 13) && e.ctrlKey) {
      addNewQuestion("");
      $("#footerCard").fadeIn();
    }
    if (key == 13) { // 13 is enter
      if (e.shiftKey == true) {
        addNewAnnotationWithScreenShot("question");
        $("#footerCard").fadeIn();
      }
    }
  }, false);
}, false);

document.addEventListener('DOMContentLoaded', function () {
  var newQuestionDescription = document.getElementById("newQuestionDescription");
  newQuestionDescription.addEventListener("dblclick", function (e) {
    addNewAnnotationWithScreenShot("question");
    $("#footerCard").fadeIn();
  }, false);
}, false);

document.addEventListener('DOMContentLoaded', function () {
  var resetBtn = document.getElementById('resetBtn');
  resetBtn.addEventListener('click', function () {
    var background = chrome.extension.getBackgroundPage();
    var session = background.session;
    if (session.getAnnotations().length == 0) return;

    var resetConfirmation = document.getElementById('resetConfirmation');
    $("#resetConfirmation").fadeIn();
  }, false);
}, false);

document.addEventListener('DOMContentLoaded', function () {
  var resetBtnNo = document.getElementById('resetNo');
  resetBtnNo.addEventListener('click', function () {
    $("#resetConfirmation").slideUp();
  });
});

document.addEventListener('DOMContentLoaded', function () {
  var resetBtnNo = document.getElementById('resetYes');
  resetBtnNo.addEventListener('click', function () {
    var background = chrome.extension.getBackgroundPage();
    var session = background.session;
    if (session.getAnnotations().length == 0) return;
    chrome.extension.sendMessage({
      type: "clearSession"
    }, function (response) {
      $("#bugCounter").html("");
      $("#questionCounter").html("");
    });
    $("#resetConfirmation").slideUp();
    $("#footerCard").slideUp();
  });
});

document.addEventListener('DOMContentLoaded', function () {
  var background = chrome.extension.getBackgroundPage();
  var session = background.session;
  if (session.getAnnotations().length == 0) return;
  $("#footerCard").fadeIn();
});