var shows = [];
var user = {};
var showingthing = false;
var sanitize_options = {
	ALLOWED_TAGS: ["a"],
	ALLOWED_ATTR: ["href"]
};
async function init() {
	user = await getuser();
	handle_service_workers();
	checksearch();
}

function showmore(i) {
	showingthing = true;
	document.getElementById("desc_" + i).innerHTML = DOMPurify.sanitize(shows[i].desc, sanitize_options).autoLink(link_config) + "<br><br><i class='shortlong' onclick='showless(" + i + ")'>less</i>";
	document.getElementById("title_" + i).innerHTML = DOMPurify.sanitize(shows[i].title, sanitize_options);
	setTimeout(() => {
		showingthing = false;
	}, 10);
}

function showless(i) {
	showingthing = true;
	document.getElementById("desc_" + i).innerHTML = htmltotext(shows[i].desc.replace(/<br>/gi, "\n").slice(0, 250)) + "... <i class='shortlong' onclick='showmore(" + i + ")'>more</i>";
	setTimeout(() => {
		showingthing = false;
	}, 10);
}

function checksearch() {
	var pageurl = new URL(String(window.location));
	var search = pageurl.searchParams.get("AetBh69SERCH99bH");
	if (search != null && search.length != 0) {
		document.getElementById("AetBh69SERCH99bH").value = decodeURIComponent(search.replace(/\+/gi, "%20"));
		document.getElementById("AetBh69SERCH99bHm").value = document.getElementById("AetBh69SERCH99bH").value;
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
							ephtml = ephtml.replace(/\$\$\%\%TOTITLE\%\%/gi, DOMPurify.sanitize(result.rows[i].name));
							if (result.rows[i].description.length > 250) {
								ephtml = ephtml.replace(/\$\$\%\%DESK\%\%/gi, htmltotext(String(result.rows[i].description).slice(0, 250)) + "... <i class='shortlong' onclick='showmore(" + i + ")'>more</i>");
							}
							else {
								ephtml = ephtml.replace(/\$\$\%\%DESK\%\%/gi, htmltotext(result.rows[i].description));
							}
							ephtml = ephtml.replace(/\$\$PDI\%\%/gi, DOMPurify.sanitize(result.rows[i].image, sanitize_options));
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
