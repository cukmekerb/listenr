# listenr - a lightweight browser podcatcher
[![Netlify Status](https://api.netlify.com/api/v1/badges/875cdf74-2199-43f4-9807-261832d3f57e/deploy-status)](https://app.netlify.com/sites/listenr/deploys)

[listenr](https://listenrapp.me/) is a lightweight podcatcher written in vanilla JS.

## why?
because.

## contributing
fork this thing, write good code, make a pr.

if it's sufficiently good, i will merge it.

if you add a new library, link it through jsDelivr.

NO JQUERY!!!!!

open the console and enter `make_local()` from any page other than  `view.html` or `404.html`. this will disable all service worker caching. If you want to enable it again, enter  `localforage.setItem("islocal", false)` into the console on any of the aformentioned pages.
