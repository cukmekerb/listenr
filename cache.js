self.importScripts("https://cdn.jsdelivr.net/gh/mozilla/localForage@master/dist/localforage.js")
self.addEventListener('install', function (e) {
    return cache_add_all([
        "index.html",
        "view.html",
        "yours.html",
        "view.css",
        "burger.png",
        "favicon.ico",
        "listenr-logo.png"
    ]);
});

function is_image(url) {
    return url.endsWith(".png") || url.endsWith(".jpg") || url.endsWith(".jpeg") || url.endsWith(".av1") || url.endsWith(".heic") || url.endsWith(".heif") || url.endsWith(".webp") || url.endsWith(".bmp")
}

function cache_add_all(array) {
    caches.open("v1-cache").then(function (cache) {
        for (i in array) {
            fetch(array[i]).then(function (response) {
                if (!response.ok) {
                    throw new TypeError('Bad response status');
                }
                localforage.setItem(array[i], Date.now());
                cache.put(array[i], response);
            });
        }
    });
}
self.addEventListener("fetch", function (e) {
    e.respondWith(
        caches.match(e.request).then(function (response) {
            if (e.request.url.startsWith("https://rss-to-json-convert.herokuapp.com/") || (e.request.url.startsWith(new URL(self.location).origin) && !e.request.url.includes("AetBh69SERCH99bH")) || is_image(e.request.url) || e.request.url.endsWith(".js") || e.request.url.startsWith("https://script.google.com/macros/s/AKfycby45awRekYOvIpe6ZFN_C5llswyiDGMnCwEoD9Dje_hQ1AqTnQ/exec")) {
                console.log(e.request.url + " - sending cache")
                try {
                    return response || fetch(e.request)
                }
                finally {
                    localforage.getItem(e.request.url).then(timestamp => {
                        if (Date.now() - timestamp > 20 * 60 * 1000) {
                            console.log(e.request.url + " - updating cache")
                            cache_add_all([e.request.url])
                        }
                        else {
                            console.log(e.request.url + " - not updating cache; timestamp is "+timestamp)
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                }
            }
            console.log(e.request.url + " - not sending cache")
            return fetch(e.request);
        })
    );
});
