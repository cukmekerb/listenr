var user = {
    subscribed: []
};
var exp = {
    expires: 100000
};
var castdesk;
var episodes = [];
var whathasbeenloaded = {
    items: []
};
var feedurl;
let root = document.documentElement;
var defaultephtml;
var playingep;
var lasttime;
var intervalaler = false;
key("space", () => {
    toggleplaypause();
});
key("right", () => {
    playingep.currentTime += 15;
});
key("left", () => {
    playingep.currentTime -= 15;
});
function toHHMMSS(string) {
    var sec_num = Math.floor(Number(string));
    if (String(sec_num) == "NaN") {
      return "00:00";
    }
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60); 
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    if (Number(hours) < 1) {
        return minutes + ':' + seconds;
    }
    return hours + ':' + minutes + ':' + seconds;
}

function scrollelement(id, target, seconds, rate) {
    if (document.getElementById(id).scrollTop - target > 1) {
        var frames = seconds * rate;
        var diff = (document.getElementById(id).scrollTop - target) / frames;
        for (var i = 0; i < frames; i++) {
            setTimeout(() => {
                document.getElementById(id).scrollTop -= diff;
            }, i * 1000 / rate);
        }
    }
}

function makedescsize() {
    var deskslice = 300;
    if (document.documentElement.clientWidth <= 1000) {
        // don't touch these numbers. they're magic
        deskslice = -41523 / 400000000 * document.documentElement.clientWidth * document.documentElement.clientWidth + 3082188903 / 5000000000 * document.documentElement.clientWidth - 1495339502341 / 10000000000;
    }
    return deskslice;
}
async function init() {
    user = await getuser();
    var pageurl = new URL(String(window.location));
    feedurl = pageurl.searchParams.get("AetBh69feedbH");
    feedurl = String(feedurl);
    feedurl = window.atob(feedurl);
    if (feedurl.length != 0 && feedurl != null && validurl(feedurl)) {
        getfeed(feedurl);
        document.getElementById("subbutton").setAttribute("onclick", "subscribe()");
        if (user.subscribed.indexOf(user.subscribed.find(a => safe_decode(a.url) == feedurl)) > -1) {
            document.getElementById("subbutton").innerHTML = "Subscribed   <i class='fas fa-check'></i>";
            document.getElementById("subbutton").setAttribute("onclick", "un" + document.getElementById("subbutton").getAttribute("onclick"));
            document.getElementById("subbutton").classList.replace("subscribe-u", "subscribe-s");
        }
        user.lastvisited = feedurl;
        savecookies();
    } else if (user.lastvisited != null && user.lastvisited.length != 0) {
        feedurl = user.lastvisited;
        getfeed(feedurl);
        document.getElementById("subbutton").setAttribute("onclick", "subscribe('" + feedurl + "')");

        if (user.subscribed.indexOf(user.subscribed.find(a => safe_decode(a.url) == feedurl)) > -1) {
            document.getElementById("subbutton").innerHTML = "Subscribed   <i class='fas fa-check'></i>";
            document.getElementById("subbutton").setAttribute("onclick", "un" + document.getElementById("subbutton").getAttribute("onclick"));
            document.getElementById("subbutton").classList.replace("subscribe-u", "subscribe-s");
        }

    } else {
        window.location = "yours.html";
    }
}

function getfeed(link) {
    fetch("https://lstnr.gq/.netlify/functions/rss-to-json?items=10&url=" + encodeURIComponent(link))
        .then(a => a.json())
        .then(feed => {
            document.getElementById("title").innerHTML = feed.title;
            document.title = feed.title + " - listenr";
            defaultephtml = document.getElementsByClassName("episode")[0].outerHTML;
            document.getElementById("image").src = feed.image;
            if (user.subscribed.find(a => a.url == link) != null) {
                user.subscribed[user.subscribed.findIndex(a => safe_decode(a.url) == link)].image = encodeURIComponent(document.getElementById("image").src);
                console.log("updating image");
                user.subscribed[user.subscribed.findIndex(a => safe_decode(a.url) == link)].desc = encodeURIComponent(feed.description);
                user.subscribed[user.subscribed.findIndex(a => safe_decode(a.url) == link)].title = encodeURIComponent(feed.title);
                savecookies();
            }
            if (feed.items[0].itunes_author != null) {
                document.getElementById("author_name").innerHTML = feed.items[0].itunes_author;
            }
            document.getElementById("description").innerHTML = htmltotext(String(feed.description).slice(0, makedescsize()));
            castdesk = feed.description;
            if (String(document.getElementById("description").innerHTML).length < castdesk.length) {
                document.getElementById("description").innerHTML += "... <i onclick='longpoddesk()' class='shortlong'>more</i>";
            }
            
            var expliciteps = feed.items.filter(episode => {
              if (episode.itunes_explicit) {
                return episode.itunes_explicit.toLowerCase() == "yes";
              }
              return false;
            });
            
            if (expliciteps.length != 0) {
              document.getElementById("explicit").classList.remove("displaynone");
            }
            filleps(feed);
            whathasbeenloaded = feed;
            return feed;
        })
        .then(feed => {
            fetch("https://lstnr.gq/.netlify/functions/search?url=" + encodeURIComponent(link))
                .then(a => a.json())
                .then(result => {
                    if (result.rows[0] == null) {
                        fetch("https://lstnr.gq/.netlify/functions/adder?url=" + encodeURIComponent(link));
                    }
                });
        });
}

function filleps(feed) {
    var episodehtml;
    var iteml = whathasbeenloaded.items.length || 0;
    console.log(iteml);
    if (document.getElementById("loadmore")) {
        document.getElementById("loadmore").outerHTML = "";
    }
    for (var i in feed.items) {
        ii = iteml + Number(i);
        episodehtml = String(document.getElementsByClassName("episode")[0].outerHTML).replace(/\$\$\i\%\%/gi, ii);
        episodehtml = episodehtml.replace("display:none", "");
        if (String(feed.items[i].title).length > 30) {
            episodehtml = episodehtml.replace("$$%%TOTITLE%%", String(feed.items[i].title).slice(0, 31) + "...");
        } else {
            episodehtml = episodehtml.replace("$$%%TOTITLE%%", String(feed.items[i].title));
        }
        episodehtml = episodehtml.replace("$$%%DESK%%", htmltotext(String(feed.items[i].description).slice(0, 250)) + "... <i class='shortlong' onclick='showmore(" + ii + ")'>more</i>");
        episodehtml = episodehtml.replace(/<br>/gi, "\n");
        document.getElementById("episodes").innerHTML += "<br>" + episodehtml;
        if (feed.items[i].itunes_explicit) {
          if (feed.items[i].itunes_explicit.toLowerCase() == "yes") {
            document.getElementById("explicit-" + i).classList.remove("displaynone");
          }
        }
        episodes.push({
            title: feed.items[i].title,
            desc: String(feed.items[i].description).replace(/\n/gi, "<br>"),
            url: feed.items[i].enclosures[0].url,
            pubdate: new Date(feed.items[i].published).toLocaleString()
        });

    }
    document.getElementById("episodes").innerHTML += "<div id='loadmore' onclick='loadmore()'>Load more</div>";
    document.getElementById("episodes").classList.remove("hidden");
    setTimeout(() => {
        document.getElementById("noscrolly").classList.remove("hidden");
        document.getElementById("loading").classList.add("hidden");
    }, 100);
}

function loadmore() {
    document.getElementById("loadmore").innerHTML = "<i style='text-align:center; margin-left:auto; margin-right:auto;'>Loading...</i>";
    fetch("https://lstnr.gq/.netlify/functions/rss-to-json?items=10&startfrom=" + episodes.length + "&url=" + encodeURIComponent(feedurl))
        .then(a => a.json())
        .then(feed => {
            if (feed.items.length < 1) {
                document.getElementById("loadmore").outerHTML = "<br><i style='text-align:center; margin-left:auto; margin-right:auto;'>No more episodes to load.</i>";
                return;
            }
            document.getElementById("loadmore").outerHTML = "";
            filleps(feed);
        });
}

function longpoddesk() {
    document.getElementById("description").innerHTML = castdesk.autoLink(link_config) + "<br><i onclick='shortpoddesk()' class='shortlong'>less</i>";
    setTimeout(() => {

    }, 150);
}

function shortpoddesk() {
    document.getElementById("description").innerHTML = htmltotext(castdesk.slice(0, makedescsize())) + "... <i onclick='longpoddesk()' class='shortlong'>more</i>";
    scrollelement("desc_scroll", 0, 0.5, 60);
    setTimeout(() => {

    }, 200);
}

function showplay(i) {
    document.getElementById("playbutton-" + i).classList.add("showing");
}

function hideplay(i) {
    document.getElementById("playbutton-" + i).classList.remove("showing");
}

function playepisode(i) {
    if (playingep != null) {
        playingep.pause();
    }
    document.getElementById("nowplaying").innerHTML = episodes[i].title + " - " + document.getElementById("title").innerHTML;
    var textsize = testwidth(document.getElementById("nowplaying").innerHTML, "14px", "bold");
    var clipwidth = document.getElementById("nowplayingcont").clientWidth * 0.7;
    root.style.setProperty("--title-pos", (Math.abs(Math.round((document.getElementById("nowplayingcont").clientWidth - textsize) - clipwidth)) - (Math.abs(Math.round((document.getElementById("nowplayingcont").clientWidth - textsize) - clipwidth)) / 2) + 2) + "px");
    playingep = new Audio(episodes[i].url);
    playingep.preload = "auto";
    playingep.play();
    updateplayer();
    document.getElementById("player").classList.replace("hidingplayer", "nonhidingplayer");
    epplayed();
    playingep.onpause = eppaused;
    playingep.onplay = epplayed;
}

function updateplayer() {
    if (!intervalaler) {
        lasttime = playingep.currentTime;
        var endedtime = 0;
        setInterval(() => {
            if (playingep.currentTime - lasttime < 0.15) {
                document.getElementById("player_move").value = (playingep.currentTime / playingep.duration) * 100;
                var d = "linear-gradient(90deg, rgb(84, 255, 78) " + document.getElementById("player_move").value + "%, rgba(182,182,182,1) " + document.getElementById("player_move").value + "%, rgba(182,182,182,1) 100%)";
                root.style.setProperty("--slider-val", d);
                if (playingep.ended && endedtime > 2) {
                    document.getElementById("player").classList.replace("nonhidingplayer", "hidingplayer");
                    playingep = null;
                } else if (playingep.ended) {
                    endedtime += 0.1;
                    document.getElementById("play_pause").classList.replace("fa-pause-circle", "fa-play-circle");
                } else {
                    endedtime = 0;
                }
            }
            lasttime = playingep.currentTime;
            document.getElementById("timeleft").innerHTML = toHHMMSS(playingep.currentTime);
            document.getElementById("minustime").innerHTML = "-" + toHHMMSS(playingep.duration - playingep.currentTime);
        }, 100);
    }
}

function showmore(i) {
    document.getElementById("desc_" + i).innerHTML = episodes[i].desc.autoLink(link_config) + "<br><br><i>Published " + episodes[i].pubdate + "</i><br><br><i class='shortlong' onclick='showless(" + i + ")'>less</i><br>";
    document.getElementById("title_" + i).innerHTML = episodes[i].title;
}

function showless(i) {

    document.getElementById("desc_" + i).innerHTML = htmltotext(episodes[i].desc.replace(/<br>/gi, "\n").slice(0, 250)) + "... <i class='shortlong' onclick='showmore(" + i + ")'>more</i>";

    if (String(episodes[i].title).length < 30) {
        document.getElementById("title_" + i).innerHTML = episodes[i].title;
    } else {
        document.getElementById("title_" + i).innerHTML = episodes[i].title.slice(0, 30) + "...";
    }
}

function subscribe() {
    var url = feedurl;
    user.subscribed.splice(0, 0, {
        url: encodeURIComponent(url),
        desc: encodeURIComponent(castdesk),
        title: encodeURIComponent(String(document.title).replace("- listenr", "")),
        img: encodeURIComponent(document.getElementById("image").src)
    });
    setTimeout(function () {
        document.getElementById("subbutton").classList.replace("subscribe-u", "subscribe-s");
    }, 20);
    document.getElementById("subbutton").innerHTML = "Subscribed   <i class='fas fa-check'></i>";
    savecookies();
    document.getElementById("subbutton").setAttribute("onclick", "un" + document.getElementById("subbutton").getAttribute("onclick"));
}

function unsubscribe() {
    var url = feedurl;
    if (user.subscribed.find(a => safe_decode(a.url) == url) != null) {
        user.subscribed.splice(user.subscribed.indexOf(user.subscribed.find(a => safe_decode(a.url) == url)), 1);
    }
    setTimeout(function () {
        document.getElementById("subbutton").innerHTML = "Subscribe";
    }, 50);
    savecookies();
    document.getElementById("subbutton").classList.replace("subscribe-s", "subscribe-u");
    document.getElementById("subbutton").setAttribute("onclick", document.getElementById("subbutton").getAttribute("onclick").replace("un", ""));
}

function playermove() {
    var d = "linear-gradient(90deg, rgb(84, 255, 78) " + document.getElementById("player_move").value + "%, rgba(182,182,182,1) " + document.getElementById("player_move").value + "%, rgba(182,182,182,1) 100%)";
    root.style.setProperty("--slider-val", d);
    if (document.getElementById("player_move").value / 100 * playingep.duration != playingep.currentTime) {
        playingep.currentTime = document.getElementById("player_move").value / 100 * playingep.duration;
    }
}

function toggleplaypause() {
    if (playingep.src != null) {
        if (playingep.paused) {
            epplayed();
            playingep.play();
        } else {
            eppaused();
            playingep.pause();
        }
    }
}

function eppaused() {
    document.getElementById("play_pause").classList.replace("fa-pause-circle", "fa-play-circle");
}

function epplayed() {
    document.getElementById("play_pause").classList.replace("fa-play-circle", "fa-pause-circle");
}

function testwidth(text, size, weight) {
    document.getElementById("widthtester").innerHTML = text;
    document.getElementById("widthtester").style.fontSize = size;
    document.getElementById("widthtester").style.fontWeight = weight;
    return document.getElementById("widthtester").clientWidth;
}
