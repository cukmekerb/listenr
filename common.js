function htmltotext(html) {
    document.getElementById("texttester").innerHTML = html;
    var b = document.getElementById("texttester").innerText || document.getElementById("texttester").textContent;
    return b;
}


function savecookies() {
    Cookies.set("usingindexed", "true", exp)
    localforage.setItem("user", JSON.stringify(user)).then(() => {
        console.log("saved stuff");
    });
}

function checkrss(data) {
    if (data.keyCode == 13) {
        if (document.getElementById("mobileside").classList.contains("leftside")) {
            window.location = "view.html?AetBh69feedbH=" + window.btoa(document.getElementById("rssurl").value);
        }
        else {
            window.location = "view.html?AetBh69feedbH=" + window.btoa(document.getElementById("rssurlm").value);
        }
    }
}
function csearch(data) {
    if (data.keyCode == 13) {
        console.log("aaa")
        window.location = "search.html?AetBh69SERCH99bH=" + (document.getElementById("AetBh69SERCH99bHm").value || document.getElementById("AetBh69SERCH99bH").value);
    }
}


function validurl(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' +
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
        '(\\?[;&a-z\\d%_.~+=-]*)?' +
        '(\\#[-a-z\\d_]*)?$', 'i');
    return !!pattern.test(str);
}
function hidemnav() {
    document.getElementById("mobileside").classList.add("leftside")
}
function showmnav() {
    document.getElementById("mobileside").classList.remove("leftside")
}