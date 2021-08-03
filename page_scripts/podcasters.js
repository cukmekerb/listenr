var feedurl;
var oldephtml;

function check_show_db() {
	var link = document.getElementById("rss_url").value;
	feedurl = link;
	document.getElementById("show_output").classList.add("hidden");
	var goodhtml = `<span class="material-icons-outlined">check_circle_outline</span> your show is in the database`;
	if (validurl(link)) {
		document.getElementById("error").classList.add("hidden");
		document.getElementById("shortlinkform").classList.add("hidden");
		document.getElementById("working").classList.remove("hidden");
		document.getElementById("shortlinkmade").classList.add("hidden");
		fetch("https://lstnr.gq/.netlify/functions/search?url=" + encodeURIComponent(link))
			.then(a => a.json())
			.then(result => {
				if (result.rows[0] != null) {
					document.getElementById("working").classList.add("hidden");
					document.getElementById("show_output").classList.remove("hidden");
					var ephtml = oldephtml;
					ephtml = ephtml.replace(/\$\$\%\%TOTITLE\%\%/gi, result.rows[0].title);
					ephtml = ephtml.replace(/\$\$\%\%DESK\%\%/gi, htmltotext(result.rows[0].description).slice(0, 100) + "...");
					ephtml = ephtml.replace(/\$\$PDI\%\%/gi, result.rows[0].image);
					document.getElementById("show").innerHTML = ephtml;
					document.getElementById("is_in_db").innerHTML = goodhtml;
					setupshortlinkform(result.rows[0].title);
				}
				else {
					fetch("https://lstnr.gq/.netlify/functions/get_show_info?showid=" + btoa(link))
						.then(a => a.json())
						.then(feed => {
							document.getElementById("working").classList.add("hidden");
							var ephtml = oldephtml;
							ephtml = ephtml.replace(/\$\$\%\%TOTITLE\%\%/gi, feed.title);
							ephtml = ephtml.replace(/\$\$\%\%DESK\%\%/gi, htmltotext(feed.description).slice(0, 100) + "...");
							ephtml = ephtml.replace(/\$\$PDI\%\%/gi, feed.image)
							document.getElementById("show").innerHTML = ephtml;
							document.getElementById("show_output").classList.remove("hidden");
							document.getElementById("is_in_db").innerHTML = "Adding your show to the database...";
							fetch("https://lstnr.gq/.netlify/functions/adder?url=" + encodeURIComponent(link))
								.then(() => {
									document.getElementById("is_in_db").innerHTML = goodhtml;
									setupshortlinkform(feed.title);
								});
						});
				}

			});
	}
	else {
		document.getElementById("error").innerHTML = "Invalid feed URL";
		document.getElementById("error").classList.remove("hidden");
	}
}

function checksearch(data) {
	if (data.keyCode == 13) {
		check_show_db();
	}
}

function camelize(str) {
	return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
		if (+match === 0) return "";
		return match.toUpperCase();
	});
}

function setupshortlinkform(title) {
	title = title.slice(0, 35);
	if (title.toUpperCase().startsWith("THE")) {
		title = title.replace(/the\s+/i, "");
	}
	title = title.replace(/\'|\"|\:|\`|\{|\/|\\|\||\.|\,/gi, "");
	title = camelize(title);
	document.getElementById("shortlinkinput").value = title;
	adjustwidth();
	document.getElementById("shortlinkform").scrollIntoView();
	document.getElementById("shortlinkform").classList.remove("hidden");
}

function adjustwidth() {
	if (document.getElementById("shortlinkinput").value.length > 7) {
		document.getElementById("width-machine").innerHTML = document.getElementById("shortlinkinput").value + "AAAA";
	}
	else {
		document.getElementById("width-machine").innerHTML = "aaaaaaaaaaaa";
	}
}

function checkshortlinksearch(data) {
	if (data.keyCode == 13) {
		makeshortlink();
	}
}

function makeshortlink() {
	if (document.getElementById("shortlinkinput").value != "" && document.getElementById("shortlinkinput").value) {
		document.getElementById("shortlinkinput").value = document.getElementById("shortlinkinput").value.replace(/\s+/g, "");
		adjustwidth();
		document.getElementById("shortlinkmade").classList.add("subbed");
		document.getElementById("shortlinkmade").classList.remove("notsubbed");
		var slashtag = document.getElementById("shortlinkinput").value;
		document.getElementById("shortlinkmade").classList.remove("hidden");
		document.getElementById("shortlinkmade").innerHTML = "working...";
		fetch(`https://lstnr.gq/.netlify/functions/shortlink_maker?url=${feedurl}&slashtag=${slashtag}`)
			.then(a => a.json())
			.then(result => {
				if (!result.error) {
					document.getElementById("shortlinkmade").innerHTML = `
                            Your shorlink is public at <a href="https://lstnr.gq/${result.shortlink_path}" target="_blank">lstnr.gq/${result.shortlink_path}</a>
                            `;
				}
				else {
					document.getElementById("shortlinkmade").classList.remove("subbed");
					document.getElementById("shortlinkmade").classList.add("notsubbed");
					document.getElementById("shortlinkmade").innerHTML = result.error;
				}
			});
	}
}

function init() {
	oldephtml = document.getElementById("show").innerHTML;
	adjustwidth();
	handle_service_workers();
	window.scrollTo(0, 0);
}
