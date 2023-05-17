# 📌 Achive Notice
This repo has been archived as a record of the things I made when I was learning to code throughout highschool. 
Read on for a quick guide and retrospective, otherwise you can check out my current projects on my website.

# 🌎 Language Perfect Auto Answerer

**Quick note before I start, around the time I was writing this extension Language Perfect renamed themselves to Education Perfect, but I thought it was worth preserving the original repository name and description, so we'll continue to use Language Perfect here.**

> "[Language Perfect](https://www.educationperfect.com/) is a language learning platform. My French teacher gives the class a lot of homework on there, and I'm not the biggest fan of homework, so I built an auto-answering Chrome Extension." - Original Readme, 2019

That's how I phrased it at the time, and honestly I stand by it. This extension, aimed at automatically translating a question and displaying the correct answer for me, was my second Chrome Extension aimed at making my life a little easier. It marks my first use of a public API in connecting two services together in a way neither of them probably intended, and my first proper README, with a breakdown of the code block by block. Below this you'll find the "How It Works" section I originally wrote for the project, with a few readability edits.

## 💻 How It Works
When you navigate to a website matching the expression `*www.educationperfect.com/app*game?mode=0*` (the * 's being wildcards) the injected script (inject.js) begins the auto-answering process by reading the value of the text to be translated from the HTML element containing it.

```javascript
if (document.getElementById("question-text").childNodes.length > 1) var transText = document.getElementById("question-text").childNodes[1].innerText;
else var transText = document.getElementById("question-text").childNodes[0].innerText;
```

Then, because Chrome doesn't like injected `XMLHttpRequests` for security reasons, the injected script sends a message to app.js, running in the popup window (popup.html). It also sends a message containing the URL, so the popup can validate it for the correct domain, path, and query.

```javascript
chrome.runtime.sendMessage({
    "url": window.location.href,
    "transText": transText
});
```

From here, the translating and UI is taken care of by app.js, beginning with an `onMessage` event listener, triggered when the runtime message is received. Once the message is received, the page is deemed either supported, or not:

```javascript
if(request.url) {
	if(request.url.indexOf("www.educationperfect.com/app") > 0 && request.url.indexOf("game?mode=0") > 0){
			document.querySelector("#notsupported").style.display="none";
			document.querySelector("#supported").style.display="block";
	}
}
```

Then, the translation text gathered earlier is sent to [Yandex Translate](https://tech.yandex.com/translate/), entirely because you have to pay to use the Google Translate API 😢. After translation, the results are displayed in the __To__ and __From__ sections of the popup.

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

And that's how the LP Auto Answerer works! If you made it all the way to this point, thanks for dealing with my poor documentation skills.
> And a final footnote - don't worry past Ryan, you did great - your documentation skills aren't half bad! 🏆
