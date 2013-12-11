//create a unique namespace
var chicohernando = {};

/**
 * Handle what happens when the user clicks the Show Video button
 * in the Settings section.
 *
 */
chicohernando.showVideoClickHandler = function(e) {
	console.log(this);
	jQuery(this).parents('.chicohernando-toggle-show-video').toggleClass('selected');
	if (jQuery(this).parents('.chicohernando-toggle-show-video').hasClass('selected')) {
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
if (jQuery('.chicohernando-settings').length == 0) {
	jQuery('#settings .container').append('<div class="chicohernando-settings section">Additional Settings</div>');
	// jQuery('.chicohernando-settings').after('<div class="chicohernando-toggle-show-video item selected"><i class="icon icon-check-blue"></i><span>Show Video</span></div>');
	// jQuery('.chicohernando-toggle-show-video').on('click', chicohernando.showVideoClickHandler);
}
