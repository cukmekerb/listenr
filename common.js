var link_config = {
	target: "_blank",
};

/** handles service workers */
async function handle_service_workers() {
	var islocal = await localforage.getItem("islocal"); // check if local
	if (!islocal) {
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker.getRegistrations()
				.then(registrations => {
					for (var i in registrations) {
						if (registrations[i].active.scriptURL.endsWith("cache.js")) {
							registrations[i].unregister()
								.catch(err => {
									console.log("unregistering failed " + err);
								});
						}
					}
				});
			localforage.keys()
				.then(keys => {
					for (var i in keys) {
						if (keys[i] != "user" && keys[i] != "islocal") {
							localforage.removeItem(keys[i])
								.then(() => {
									console.debug("key " + keys[i] + " is gone!");
								});
						}
					}
				});
		}
		navigator.serviceWorker.register("sw.js");
	}
	else {
		console.log("you're local!");
		console.debug("checking for service workers");
		navigator.serviceWorker.getRegistrations()
			.then(registrations => {
				for (var i in registrations) {
					registrations[i].unregister();
				}
			});
	}
}

/** prevents service workers */
function make_local() {
	localforage.setItem("islocal", true)
		.then(() => {
			console.log("is local!");
			handle_service_workers();
		});
}

/** decodes uri without throwing errors */
function safe_decode(uri) {
	if (!uri) {
		return uri;
	}
	try {
		return decodeURIComponent(uri.replace(/%(?![0-9][0-9a-fA-F]+)/gi, '%25'));
	}
	catch (err) {
		return decodeURIComponent(uri);
	}
}


/** converts html to plaintext. requires `div#texttester` 
 * @param {String} html - the html to convert */
function htmltotext(html) {
	document.getElementById("texttester").innerHTML = html;
	var b = document.getElementById("texttester").innerText || document.getElementById("texttester").textContent;
	return b;
}

/** Saves the current `user` variable to localForage */
function savecookies() {
	localforage.setItem("user", user).then(() => {
		console.log("saved stuff");
	});
}

/** runs on keypress on the `rssurl` and `rssurlm` inputs. reditects to view page */
function checkrss(data) {
	if (data.keyCode == 13) {
		window.location = "view.html?AetBh69feedbH=" + window.btoa(data.target.value);
	}
}
/** runs on keypress on the `AetBh69SERCH99bHm` and `AetBh69SERCH99bH` inputs. redirects to search page */
function csearch(data) {
	if (data.keyCode == 13) {
		window.location = "search.html?AetBh69SERCH99bH=" + data.target.value;
	}
}

/** returns user data as object */
async function getuser() {
	var nuser = {
		subscribed: [],
		joindate: String(new Date())
	};
	var olduser = nuser;
	nuser = await localforage.getItem("user");
	if (!nuser) {
		nuser = olduser;
	}
	return nuser;
}


/** checks if a string is a valid URL.
 * I stole this from stackoverflow
 * @param {String} str - the url to check
 */
function validurl(str) {
	var pattern = new RegExp('^(https?:\\/\\/)?' +
		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
		'((\\d{1,3}\\.){3}\\d{1,3}))' +
		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
		'(\\?[;&a-z\\d%_.~+=-]*)?' +
		'(\\#[-a-z\\d_]*)?$', 'i');
	return !!pattern.test(str);
}

/** hides mobile navigation */
function hidemnav() {
	document.getElementById("mobileside").classList.add("leftside");
}
/** shows mobile navigation */
function showmnav() {
	document.getElementById("mobileside").classList.remove("leftside");
}

/** hides announcement popup */
function hideannouncement() {
	document.getElementById("announcement").classList.add("hidden");
}

/** checks for new changelogs */
function checkannouncements() {
	if (user.subscribed.length > 0 && Date.now() - Date.parse(user.joindate) >= 10 * 60 * 1000) {
		fetch("announcements.json")
			.then(a => a.json())
			.then(result => {
				if (user.last_announcement != null) {
					if (user.last_announcement + 1 >= result.announcements.length) {
						console.log("user has already seen lastest announcement.");
						return; // return if user has already seen this announcement
					}
				}
				var latestannouncement = result.announcements[result.announcements.length - 1];
				if (Date.parse(latestannouncement.date) < Date.parse(user.joindate)) {
					console.log("latest announcement is older than user");
					return; // return if user is too young for old news
				}
				document.getElementById("announcement_ul").innerHTML = "";
				document.getElementById("announcement").classList.remove("hidden");
				for (var i in latestannouncement.text) {
					if (i == 0) {
						document.getElementById("announcement_h1").innerHTML = latestannouncement.text[i];
						continue;
					}
					var bullet = document.createElement("li");
					bullet.innerHTML = latestannouncement.text[i].autoLink(link_config);
					document.getElementById("announcement_ul").appendChild(bullet);
				}
				user.last_announcement = result.announcements.length - 1;
				savecookies();
			});
	}
}
