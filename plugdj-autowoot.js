//create a unique namespace
var chicohernando = {};

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
chicohernando.woot();
