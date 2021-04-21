var shows = [];
var user = {};
var showingthing = false;
function htmltotext(html) {
    document.getElementById("texttester").innerHTML = html;
    var b = document.getElementById("texttester").innerText || document.getElementById("texttester").textContent;
    return b;
}
async function init() {
    user = await getuser();
    checksearch();
}
function showmore(i) {
    showingthing = true;
    document.getElementById("desc_" + i).innerHTML = shows[i].desc.autoLink(link_config) + "<br><br><i class='shortlong' onclick='showless(" + i + ")'>less</i>";
    document.getElementById("title_" + i).innerHTML = shows[i].title;
    setTimeout(() => { showingthing = false }, 10);
}
function showless(i) {
    showingthing = true;
    document.getElementById("desc_" + i).innerHTML = htmltotext(shows[i].desc.replace(/<br>/gi, "\n").slice(0, 250)) + "... <i class='shortlong' onclick='showmore(" + i + ")'>more</i>";
    setTimeout(() => { showingthing = false }, 10);
}
function checksearch() {
    if (String(window.location).includes("?AetBh69SERCH99bH=") && String(window.location).split("?AetBh69SERCH99bH=")[1] != "") {
        var search = String(window.location).split("?AetBh69SERCH99bH=")[1];
        document.getElementById("AetBh69SERCH99bH").value = decodeURIComponent(search.replace(/\+/gi, "%20"));
        document.getElementById("AetBh69SERCH99bHm").value = document.getElementById("AetBh69SERCH99bH").value
        document.title = decodeURIComponent(search.replace(/\+/gi, "%20")) + " - Search listenr";
        fetch("https://lstnr.gq/.netlify/functions/search?q=" + search)
            .then(a => a.json())
            .then(result => {
                var ephtml;
                if (result.rows.length > 0) {
                    for (var i in result.rows) {
                        if (result.rows[i].name != null && result.rows[i].name != "") {
                            ephtml = document.getElementById("show-$$i%%").outerHTML;
                            ephtml = ephtml.replace(/\$\$i\%\%/gi, i);
                            ephtml = ephtml.replace(/\$\$\%\%TOTITLE\%\%/gi, result.rows[i].name);
                            if (result.rows[i].description.length > 250) {
                                ephtml = ephtml.replace(/\$\$\%\%DESK\%\%/gi, htmltotext(String(result.rows[i].description).slice(0, 250)) + "... <i class='shortlong' onclick='showmore(" + i + ")'>more</i>");
                            }
                            else {
                                ephtml = ephtml.replace(/\$\$\%\%DESK\%\%/gi, htmltotext(result.rows[i].description));
                            }
                            ephtml = ephtml.replace(/\$\$PDI\%\%/gi, result.rows[i].image);
                            ephtml = ephtml.replace(/\$\$showurl\%\%/gi, "view.html?AetBh69feedbH=" + window.btoa(result.rows[i].url));
                            document.getElementById("op").innerHTML += ephtml;
                            shows.push({
                                title: result.rows[i].name,
                                desc: result.rows[i].description
                            });
                        }
                    }
                    document.getElementById("show-$$i%%").outerHTML = "";
                }
                else {
                    document.getElementById("op").innerHTML = `<p class='centererror'>no shows found :( Try <input placeholder="Addding by RSS..."
                onkeypress="checkrss(event)" autocomplete="off" type="url" id="rssurl2" style='margin-left: 10px'></p>`;
                }
                setTimeout(() => {
                    document.getElementById("op").classList.remove("hidden");
                    document.getElementById("loading").classList.add("hidden");
                    checkannouncements();
                }, 150);
            });
    }
}
function hidemnav() {
    document.getElementById("mobileside").classList.add("leftside");
}
function showmnav() {
    document.getElementById("mobileside").classList.remove("leftside");
}
