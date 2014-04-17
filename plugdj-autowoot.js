//create a unique namespace
var chicohernando = {};
//Ensure that Google Analytics is present
var _gaq = _gaq || [];
(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

/**
 * Handle what happens when the user clicks the Show Video button
 * in the Settings section.
 *
 */
chicohernando.showVideoClickHandler = function(e) {
	jQuery(this).toggleClass('selected');
	if (jQuery(this).hasClass('selected')) {
		jQuery('#playback').css('opacity', '1');
	} else {
		jQuery('#playback').css('opacity', '0');
	}
};

/**
 * Takes a jQuery object (element), gets it's text, and if the text
 * matches the format of an image url exactly it will replace the
 * $element text with an img tag.
 *
 */
chicohernando.replaceImageUrlsWithImageTag = function(element) {
	var text = jQuery(element).text().replace("&nbsp;", "").trim();
	var imageRegex = /^https?:\/\/[a-z0-9\-\+&@#\/%\?=~_|!:,\.;]+?[gif|png|jpg|jpeg]$/gim;
	if (imageRegex.test(text)) {
		jQuery(element).html("<img src=\"" + text + "\" style=\"width: 100%;\" />");
		chicohernando.trackEvent("auto", "image");
	}
	
	//add a class to represent that we've already parsed this element
	jQuery(element).addClass("chicohernando-parsed");
};

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

//replace any text that is in chat on initial plugin load
jQuery('#chat-messages .message .text').not(".chicohernando-parsed").each(function(key, value) {
	chicohernando.replaceImageUrlsWithImageTag(value);
});

//on each new chat parse any nonparsed object
API.on(API.CHAT, function() {
	//skip texts that we have already parsed
	jQuery('#chat-messages .message .text').not(".chicohernando-parsed").each(function(key, value) {
		chicohernando.replaceImageUrlsWithImageTag(value);
	});
});

//check for settings section
// if (jQuery('.chicohernando-settings').length == 0) {
// 	jQuery('#settings .container').append('<div class="chicohernando-settings section">Additional Settings</div>');
// 	jQuery('.chicohernando-settings').after('<div class="chicohernando-toggle-show-video item selected"><i class="icon icon-check-blue"></i><span>Show Video</span></div>');
// 	jQuery('body').on('click', '.chicohernando-toggle-show-video',  chicohernando.showVideoClickHandler);
// }

//Add custom react scripts
jQuery.getScript('https://raw.github.com/RipsHouse/Rip/master/plug.dj.commands.js');