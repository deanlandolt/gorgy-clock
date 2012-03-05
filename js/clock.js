'use strict';

var config = {
  use24HourClock: true
};

window.addEventListener('load', function clockLoad(evt) {
  window.removeEventListener('load', clockLoad);
  var byId = document.getElementById.bind(document);

  var clockNode = byId('clock');
  var secondsTicker = document.querySelector('.tick.seconds');
  var secondsScale = 0.88;

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
    var second = d.getSeconds();
    setIfChanged("second", zeroPad(second));
    setSecondsTicker(second);
  }, 16);

  function zeroPad(i) {
    if (i < 10) return '0' + i;
    return '' + i;
  }

  function setIfChanged(key, value) {
    var c = cache[key];
    if (value !== c.value) c.node.innerHTML = c.value = value;
  }

  function setSecondsTicker(s) {
    secondsTicker.style.MozTransform = "rotate(" + (s * 6) + "deg) scale(" + secondsScale + ")";
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

  window.parent.postMessage('appready', '*');
});
