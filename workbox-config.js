module.exports = {
	globDirectory: '.',
	globPatterns: [
		'**/*.{html,json,png,js,ico,txt,psd,css,md}'
	],
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	swDest: 'sw.js'
};
