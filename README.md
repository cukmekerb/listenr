# listenr - a lightweight browser podcatcher

(listenr)[https://listenr.gq/] is a lightweight podcatcher written in vanilla JS.

## why?
because.

## contributing
fork this thing, write good code, make a pr.
if it's sufficiently good, i will merge it.
if you add a new library, link it through jsDelivr.
make sure to create a file called `islocal.txt` and have its only contents be `true`. this is used by the service worker to prevent caching. If caching still happens, go into the console for the service worker, and manually set `islocal` to `true`.
for detailed instructions on how to do this, see (this guide)[https://developer.mozilla.org/en-US/docs/Tools/about:debugging] for firefox, and (this guide)[https://developer.chrome.com/docs/devtools/progressive-web-apps/#service-workers] for chrome.
