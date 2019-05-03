if (document.getElementById("question-text").childNodes.length > 1) var transText = document.getElementById("question-text").childNodes[1].innerText;
else var transText = document.getElementById("question-text").childNodes[0].innerText;
chrome.runtime.sendMessage({
    action: "url",
    source: window.location.href
});
chrome.runtime.sendMessage({
    action: "transText",
    source: transText
});