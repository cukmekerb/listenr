var link_config = {
    target: "_blank",
};


/** converts html to plaintext. requires `div#texttester` 
 * @param {String} html - the html to convert */
function htmltotext(html) {
    document.getElementById("texttester").innerHTML = html;
    var b = document.getElementById("texttester").innerText || document.getElementById("texttester").textContent;
    return b;
}

/** Saves the current `user` variable to localForage */
function savecookies() {
    Cookies.set("usingindexed", "true", exp);
    localforage.setItem("user", JSON.stringify(user)).then(() => {
        console.log("saved stuff");
    });
}

/** runs on keypress on the `rssurl` and `rssurlm` inputs. reditects to view page */
function checkrss(data) {
    if (data.keyCode == 13) {
        window.location = "view.html?AetBh69feedbH=" + data.target.value;
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
      if (Cookies.get("user") != null && Cookies.get("usingindexed") == null) {
        nuser = JSON.parse(Cookies.get("user"));
        Cookies.set("usingindexed", "true", exp);
        localforage.setItem("user", JSON.stringify(nuser)).then(() => {
            console.log("put user into forage");
            Cookies.remove("user");
        });
    }
    else if (Cookies.get("usingindexed") == "true") {
        var olduser = nuser;
        nuser = await localforage.getItem("user");
        nuser = JSON.parse(nuser);
        if (!nuser) {
            nuser = olduser;
        }
        if (!nuser.joindate) {
          nuser.joindate = String(new Date());
          localforage.setItem("user", JSON.stringify(nuser))
        }
    }
    else {
        Cookies.set("usingindexed", "true", exp);
        localforage.setItem("user", JSON.stringify(nuser));
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
      if (Date.parse(latestannouncement.date) <= Date.parse(user.joindate)) {
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
