if (document.getElementById("question-text").childNodes.length > 1) var transText = document.getElementById("question-text").childNodes[1].innerText;
else var transText = document.getElementById("question-text").childNodes[0].innerText;
chrome.runtime.sendMessage({
    "url": window.location.href,
    "transText": transText
});