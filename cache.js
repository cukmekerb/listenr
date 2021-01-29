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
            caches.delete(array[i])
            cache.add(array[i]).then(() => {
                localforage.setItem(array[i], Date.now());
            });
        }
    });
}
self.addEventListener("fetch", function (e) {
    e.respondWith(
        caches.match(e.request).then(function (response) {
            if (e.request.url.startsWith("https://rss-to-json-convert.herokuapp.com/") || (e.request.url.startsWith(new URL(self.location).origin) && !e.request.url.includes("AetBh69SERCH99bH")) || is_image(e.request.url) || e.request.url.endsWith(".js") || e.request.url.startsWith("https://script.google.com/macros/s/AKfycby45awRekYOvIpe6ZFN_C5llswyiDGMnCwEoD9Dje_hQ1AqTnQ/exec")) {
                console.log(e.request.url + " - sending cache");
                /*
                
                Let me tell you the story
                Of a poor man named Bob;
                "I want a speedy website,"
                He cried out with a sob.
                He toiled for long hours,
                But it seemed a service worker
                was far beyond his powers
                For though he tried to make it happen
                But bugs built deep within his code
                Prevented it from working


                He sat in silent sadness
                Thinking on his choice
                "Why, oh why, for the sake of God,"
                He questioned aloud,
                "Did I have to make a cache,"
                "When the page was still fast?"
                He went to bed that sorry night
                Crying in his sleep


                In the morning he awoke;
                Tried to fix what he had broke
                But the code just wouldn't run
                The cache thought time had just begun
                Then suddenly Bob had a plan;
                He changed the code and made it work
                Well, kind of, not quite
                It worked all right but just all right
                There's bugs but it still
                Did the job
                And this all but satisfied Bob.


                He called it quits, it did its thing
                He never touched that code again
                And so you see,
                When you read,
                Don't criticize,
                For Bob is me

                */
                try {
                    console.log(response.clone());
                    return response || fetch(e.request)
                }
                catch (err) {
                    console.log(err)
                    console.log("error getting " + e.request.url + " from cache. fetching")
                    return fetch(e.request)
                }
                finally {
                    localforage.getItem(e.request.url).then(timestamp => {
                        if (Date.now() - timestamp > 10 * 60 * 1000 || timestamp == undefined || timestamp == null) {
                            console.log(e.request.url + " - updating cache; timestamp is " + timestamp)
                            cache_add_all([e.request.url])
                        }

                        /*
                        
                        IT WORKS OKAY?
                        
                        */
                    })
                }
            }
            console.log(e.request.url + " - not sending cache")
            return fetch(e.request).catch(err => {
                console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa error");
                console.error(err);

                /* I TOLD YOU NOT TO CRITICIZE */
            })
        })
    ); /* I KNOW IT ISN'T IDEAL */
});
