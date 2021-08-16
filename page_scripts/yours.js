var user = {
	subscribed: []
};
var shows = [];
var showingthing = false;
var exp = {
	expires: 100000
};

function is_on_mobile() {
	return document.body.clientWidth < 950;
}

function fill_shows() {
	var ephtml;
	for (var i in user.subscribed) {
		if (typeof user.subscribed[i].desc != "string") {
			user.subscribed[i].desc = user.subscribed[i].desc[0];
		}
		ephtml = document.getElementById("show-$$i%%").outerHTML;
		ephtml = ephtml.replace(/\$\$i\%\%/gi, i);
		ephtml = ephtml.replace(/\$\$\%\%TOTITLE\%\%/gi, safe_decode(user.subscribed[i].title));
		if (safe_decode(user.subscribed[i].desc).length > 250) {
			ephtml = ephtml.replace(/\$\$\%\%DESK\%\%/gi, htmltotext(
				safe_decode(
					String(user.subscribed[i].desc))
				.slice(0, 250)) + "... <i class='shortlong' onclick='showmore(" + i + ")'>more</i>");
		}
		else {
			ephtml = ephtml.replace(/\$\$\%\%DESK\%\%/gi, htmltotext(safe_decode(user.subscribed[i].desc)));
		}
		ephtml = ephtml.replace(/\$\$PDI\%\%/gi, safe_decode(user.subscribed[i].img));
		ephtml = ephtml.replace(/\$\$showurl\%\%/gi, "view.html?AetBh69feedbH=" + window.btoa(safe_decode(user.subscribed[i].url)));
		document.getElementById("op").innerHTML += ephtml;
		shows.push({
			title: safe_decode(user.subscribed[i].title),
			desc: safe_decode(user.subscribed[i].desc),
			element_index: i,
			url: user.subscribed[i].url,
			img: user.subscribed[i].img
		});
	}
	document.getElementById("show-$$i%%").style.display = "none";
	checkannouncements();
}

async function init() {
	user = await getuser();
	handle_service_workers();
	if (user != null && user != {}) {
		if (user.subscribed.length > 0) {
			fill_shows();
			let options = {
				moves: () => {
					return !is_on_mobile();
				}
			}
			var drake = dragula([document.getElementById("op")], options);
			handledrake(drake);
		}
		else {
			document.getElementById("op").innerHTML = `<p class='centererror'>Your're not subscribed to any shows. You can add one by <input name="AetBh69SERCH99bH2" id="AetBh69SERCH99bH2"  placeholder="Searching" onkeypress="csearch(event)" autocomplete="off" type="text" style='margin-left: 10px;'></p>`;
		}
	}
	else {
		document.getElementById("op").innerHTML = document.getElementById("op").innerHTML = `<p class='centererror'>Your're not subscribed to any shows. You can add one by <input name="AetBh69SERCH99bH2" id="AetBh69SERCH99bH2"  placeholder="Searching" onkeypress="csearch(event)" autocomplete="off" type="text" style='margin-left: 10px;'></p>`;
	}
	setTimeout(() => {
		document.getElementById("op").classList.remove("hidden");
	}, 100);
}


function showmore(i) {
	showingthing = true;
	var show_i = shows.find((show) => {
		return show.element_index == i;
	});
	document.getElementById("desc_" + i).innerHTML = show_i.desc.autoLink(link_config) + "<br><br><i class='shortlong' onclick='showless(" + i + ")'>less</i>";
	document.getElementById("title_" + i).innerHTML = show_i.title;
	setTimeout(() => {
		showingthing = false;
	}, 10);
}


function showless(i) {
	showingthing = true;
	var show_i = shows.find((show) => {
		return show.element_index == i;
	});
	document.getElementById("desc_" + i).innerHTML = htmltotext(show_i.desc.replace(/<br>/gi, "\n").slice(0, 250)) + "... <i class='shortlong' onclick='showmore(" + i + ")'>more</i>";
	setTimeout(() => {
		showingthing = false;
	}, 10);
}


function handledrake(drake) {
	drake.on("drop", (el, target, source, sibling) => {
		var show_current_index = el.id;
		show_current_index = show_current_index.replace(/show-/gi, "");
		show_current_index = shows.findIndex((show) => {
			return show.element_index == show_current_index; // find the show whose original index was this id.
		});
		console.log("current index: " + show_current_index);
		var show_above_index;
		if (sibling) {
			show_above_index = sibling.id;
			show_above_index = show_above_index.replace(/show-/gi, "");
			show_above_index = shows.findIndex((show) => {
				return show.element_index == show_above_index; // find the show whose original index was this id.
			});
		}
		else {
			show_above_index = null;
		}
		console.log("above index: " + show_above_index);
		if (show_above_index != null) {
			let current_show = shows[show_current_index];
			shows.splice(show_current_index, 1);
			shows.splice(show_above_index, 0, current_show);
		}
		else {
			let current_show = shows[show_current_index];
			shows.splice(show_current_index, 1);
			shows.splice(shows.length, 0, current_show);
			console.log("deleting show " + shows[show_current_index].title);
		}
		user.subscribed = [];
		for (var i in shows) {
			user.subscribed[i] = {
				title: encodeURIComponent(shows[i].title),
				desc: encodeURIComponent(shows[i].desc),
				url: shows[i].url,
				img: shows[i].img
			};
		}
		savecookies();
	});

}
