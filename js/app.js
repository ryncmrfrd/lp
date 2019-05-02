window.onload = function(){
	chrome.tabs.executeScript(null, {
		file: "js/inject.js"
	});
	chrome.runtime.onMessage.addListener(function(request, sender) {
		
		if(request.action=="transText") {
			document.querySelector("#transText").innerHTML = request.source;
			var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {

						var response = JSON.parse(this.responseText);

						document.querySelector("#transResponse").innerHTML = response.text

						document.querySelector("#fromLang").innerHTML = response.lang.split("-")[0]
						document.querySelector("#toLang").innerHTML = response.lang.split("-")[1]

					}
				};
			xhttp.open("GET", "https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20181030T063621Z.0a45b8efb2e70388.6bcd8348dc80843bb85d58bc85e8cd90c112b557&text="+request.source+"&lang=en", true);
			xhttp.send();
		}
		else if(request.action=="url") {
			if(request.source.indexOf("www.educationperfect.com/app") > 0 && request.source.indexOf("game?mode=0") > 0){
				document.querySelector("#notsupported").style.display="none";
				document.querySelector("#supported").style.display="block";
			}
		}
	
	});
};

document.querySelector("#btn").onclick = function(){
  chrome.tabs.create({ url: "https://www.educationperfect.com/app/" });
}