# Education Perfect Auto Answerer
[Education Perfect](http://https://educationperfect.com) is a language learning platform. My French teacher gives the class a lot of homework on there, and I'm not the biggest fan of homework, so I built an auto-answering chrome extension.  

![EP Logo](https://www.educationperfect.com/wp-content/uploads/2019/02/logo-horiz-1.png "EP Logo")

## How to Install

This is the easiest bit.  
__Step 1 -__ Download the extension from [this](https://github.com/ryncmrfrd/lp/archive/master.zip) github link.  
__Step 2 -__ Install the extension onto Chrome from the [extensions page](chrome://extensions). Enable developer mode by toggling the switch in the top-right corner, then click on `Load Unpacked`, then navigate to the __/extention__ subfolder of the downloaded folder. Boom, done :thumbsup:.  
  
> I am working on getting the extention onto the Chrome Web store so all of this install business is unnecessary, but until then this is the best I can do. Sorry :(.

## How It Works (after Installation)

When you go onto a `*www.educationperfect.com/app*game?mode=0*` (the * 's being wildcards) URL, the an injected script [(inject.js)](https://github.com/ryncmrfrd/lp/blob/master/extention/js/inject.js) reads the value of the text to be translated.

```javascript
if (document.getElementById("question-text").childNodes.length > 1) var transText = document.getElementById("question-text").childNodes[1].innerText;
else var transText = document.getElementById("question-text").childNodes[0].innerText;
```

Then, because chrome doesn't like injected XMLHttpRequests, the injected script then sends a message to the [script](https://github.com/ryncmrfrd/lp/blob/master/extention/js/app.js) running in the [popup window](https://github.com/ryncmrfrd/lp/blob/master/extention/popup.html), which can make XMLHttpRequests. It also sends a message containing the URL, so the popup can validate whether the URL is supported.

```javascript
chrome.runtime.sendMessage({
    "url": window.location.href,
    "transText": transText
});
```

From here, the translating and UI is taken care of by [app.js](https://github.com/ryncmrfrd/lp/blob/master/extention/js/app.js), which really begins with an `onMessage` event listener. As soon as the message from [inject.js](https://github.com/ryncmrfrd/lp/blob/master/extention/js/inject.js) is recieved, the page is deemed either "supported" or not:

```javascript
if(request.url) {
	if(request.url.indexOf("www.educationperfect.com/app") > 0 && request.url.indexOf("game?mode=0") > 0){
			document.querySelector("#notsupported").style.display="none";
			document.querySelector("#supported").style.display="block";
	}
}
```

Then, the translation text we gathered earlier is sent to [Yandex Translate](https://tech.yandex.com/translate/), entirely because you have to pay to use Google Translate :triumph:. After translation, the results are displayed in the __From__ and __To__ sections of the popup.

```javascript
if(request.transText) {
	document.querySelector("#transText").innerHTML = request.transText;
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

```

And that's how the EP Auto Answerer chrome extention works. If you made it all the way to this point, thanks for dealing with my poor documentation skills.

## View my other stuff at [ryncmrfrd.me](https://ryncmrfrd.me)