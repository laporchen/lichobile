var Zanimo = require('zanimo');
var mButton = require('mobile-button');
var utils = require('../utils');

var helper = {};

// this must be cached because of the access to document.body.style
var cachedTransformProp;

function computeTransformProp() {
  return 'transform' in document.body.style?
    'transform': 'webkitTransform' in document.body.style?
    'webkitTransform': 'mozTransform' in document.body.style?
    'mozTransform': 'oTransform' in document.body.style?
    'oTransform': 'msTransform';
}

helper.transformProp = function() {
  if (!cachedTransformProp) cachedTransformProp = computeTransformProp();
  return cachedTransformProp;
};

helper.scale = function(element, isInitialized) {
  if (!isInitialized) {
    element.style[helper.transformProp()] = 'scale(0.97)';
    element.style.visibility = 'hidden';
    Zanimo(element, 'visibility', 'visible', 100);
    Zanimo(element, 'transform', 'scale(1)', 200);
  }
};

// convenience function to bind a touchend mobile button handler in mithril
function bindTouchendButton(scrollableX, scrollableY, handler) {
  return function(el, isUpdate, context) {
    if (!isUpdate) {
      var options = {
        el: el,
        f: function(e) {
          e.stopPropagation();
          e.preventDefault();
          m.startComputation();
          handler(e, el);
          m.endComputation();
        },
        monotouchable: false
      };
      if (scrollableX || scrollableY) options.tolerance = 5;
      var constr;
      if (scrollableX)
        constr = mButton.ScrollableX.Touchend;
      else if (scrollableY)
        constr = mButton.ScrollableY.Touchend;
      else
        constr = mButton.Touchend;

      var button = new constr(options);

      context.onunload = function() {
        if (button) button.unbind();
      };
    }
  };
}

helper.ontouchend = utils.partialf(bindTouchendButton, false, false);
helper.ontouchendScrollX = utils.partialf(bindTouchendButton, true, false);
helper.ontouchendScrollY = utils.partialf(bindTouchendButton, false, true);


module.exports = helper;
