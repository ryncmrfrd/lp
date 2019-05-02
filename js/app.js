window.onload = function(){
	chrome.runtime.onMessage.addListener(function(request, sender) {
		if (request.action == "getSource") {
			document.write(request.source)
		}
	});
	
	chrome.tabs.executeScript(null, {
    file: "js/inject.js"
  });
};