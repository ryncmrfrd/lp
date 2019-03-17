//when checkbox is changed
document.getElementById('check').onchange = function(){
    //if it changed to is checked
    if(this.checked){
        var script = 
        //on keyboard key press
        'document.onkeydown = function(e) {'+
            //if key is "t"
            'if (e.keyCode == "84") {'+
                //is there is that stupid "word, word" thingo
                'if (document.getElementById("question-text").childNodes.length > 1) var transText = document.getElementById("question-text").childNodes[1].innerText;'+
                'else transText = document.getElementById("question-text").childNodes[0].innerText;'+
                //yandex translate request
                'var oReq = new XMLHttpRequest;'+
                'oReq.addEventListener("load", function() {'+
                    //copy paste prompt
                    'window.prompt("Copy to clipboard: Ctrl+C, Enter", JSON.parse(this.responseText).text[0])'+
                '}), oReq.open("GET", "https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20181030T063621Z.0a45b8efb2e70388.6bcd8348dc80843bb85d58bc85e8cd90c112b557&text=" + transText + "&lang=en"), oReq.send();'+
            '}'+
        '};'
        //run var script
        chrome.tabs.executeScript({code: script});
    }
}