//create a unique namespace
var chicohernando = {};

/**
 * Adds custom namespaced GA key to the page
 */
chicohernando.setupGoogleAnalytics = function() {
	_gaq.push(['chicohernando._setAccount', 'UA-46047123-1']);
};

/**
 * Track the page that this is being used on
 */
chicohernando.trackPageView = function() {
	_gaq.push(['chicohernando._trackPageview', '/autowoot/' + location.host +  location.pathname]);
};

/**
 * Track number of woots that happen
 */
chicohernando.trackEvent = function(category, action) {
	_gaq.push(['chicohernando._trackEvent', category, action]);
};

/**
 * Returns a random integer for use as a timeout
 * between a new user getting on deck and wooting
 */
chicohernando.getRandomTimeout = function() {
    return Math.round(Math.random() * 10000);
};

/**
 * Looks for the woot button and triggers
 * a click event.
 */
chicohernando.woot = function() {
  jQuery('#woot').trigger('click');
  chicohernando.trackEvent('auto', 'woot');
};

/**
 * Listen for a new DJ and then be prepared
 * to woot all over them.
 */
API.bind(API.DJ_ADVANCE, function(obj) {
  setTimeout(function() {
    chicohernando.woot();
  }, chicohernando.getRandomTimeout());
});

//initial script load triggers a woot
chicohernando.setupGoogleAnalytics();
chicohernando.trackPageView();
chicohernando.woot();
