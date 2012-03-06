'use strict';

var config = {
  use24HourClock: true,
  //transitionSeconds: "0.25s ease",
};

window.addEventListener('load', function clockLoad(evt) {
  window.removeEventListener('load', clockLoad);
  function byId(id) {
    return document.getElementById(id);
  }

  var clockNode = byId('clock');
  var secondsScale = 0.88;
  var secondsTicker = document.querySelector('.tick.seconds');
  if (config.transitionSeconds) {
    secondsTicker.style.MozTransition = "-moz-transform " + config.transitionSeconds;
    secondsTicker.style.WebkitTransition = "-webkit-transform " + config.transitionSeconds;
  }

  var cache = {
    date: { node: byId('date') },
    hour: { node: byId('hour') },
    minute: { node: byId('minute') },
    second: { node: byId('second') },
  };

  setInterval(function() {
    var d = new Date();
    setIfChanged("date", (d.getMonth() + 1) + "-" + d.getDate());
    var hour = d.getHours();
    if (!config.use24HourClock) {
      if (hour > 12) hour -= 12;
      else if (hour == 0) hour = 12;
    }
    setIfChanged("hour", zeroPad(hour));
    setIfChanged("minute", zeroPad(d.getMinutes()));
    setIfChanged("second", zeroPad(d.getSeconds()));
    setSecondsTicker(d);
  }, 16);

  function zeroPad(i) {
    if (i < 10) return '0' + i;
    return '' + i;
  }

  function setIfChanged(key, value) {
    var c = cache[key];
    if (value !== c.value) c.node.innerHTML = c.value = value;
  }

  var _lastSecond;
  function setSecondsTicker(d) {
    var s = d.getSeconds();
    if (config.smoothSeconds) {
      s += d.getMilliseconds() / 1000;
    }
    if (_lastSecond !== s) {
      _lastSecond = s;
      var transform = " scale(" + secondsScale + ")";
      transform += " rotate(" + (s * 6) + "deg)";
      secondsTicker.style.MozTransform = transform;
      secondsTicker.style.WebkitTransform = transform;
    }
  }

  window.onresize = resize;
  resize();

  function resize(evt) {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var offset = Math.abs(width - height) / 2;
    if (width > height) {
      // landscape
      clockNode.style.width = clockNode.style.height = height + 'px';
      clockNode.style.left = offset + 'px';
      clockNode.style.top = 0;
    }
    else {
      // portrait
      clockNode.style.width = clockNode.style.height = width + 'px';
      clockNode.style.top = offset + 'px';
      clockNode.style.left = 0;
    }
  }

  // disable elastic scroll on iphone
  document.addEventListener('touchmove', function(evt) {
    evt.preventDefault();
  });

  window.parent.postMessage('appready', '*');
});
