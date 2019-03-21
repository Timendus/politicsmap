function mapXToScreen(x) {
  return Math.floor((x + 10) * window.innerWidth / 20);
}
function mapYToScreen(y) {
  return Math.floor((-1*y + 10) * window.innerHeight / 20);
}

function renderHeatmap(data) {
  var points = [];
  var max = 0;
  Object.keys(data).forEach(function(label) {
    var party = window.politicalData['parties'].find(function(party) {
      return party.label == label;
    });
    var screenPos = localStorage.getItem(label);
    var x,y;
    if(screenPos) {
      screenPos = screenPos.split(',');
      x = screenPos[0];
      y = screenPos[1];
    } else {
      x = mapXToScreen(party.x);
      y = mapYToScreen(party.y);
    }
    points.push({
      value: data[label],
      x:     x,
      y:     y
    });
    max = max < data[label] ? data[label] : max;
  });

  // heatmap data format
  var data = {
    max: max,
    data: points
  };

  window.heatmapInstance.setData(data);
}

function renderLabels(data) {
  var parties = document.querySelector('#parties');
  parties.innerHTML = '';

  data.forEach(function(point) {
    var elm = document.createElement('div');
    var screenPos = localStorage.getItem(point.label);
    var x,y;
    if(screenPos) {
      screenPos = screenPos.split(',');
      x = screenPos[0];
      y = screenPos[1];
    } else {
      x = mapXToScreen(point.x);
      y = mapYToScreen(point.y);
    }
    elm.innerText = point.label;
    elm.className = 'party';
    elm.style = "left: "+x+"px; top: "+y+"px;";
    elm.title = point.name;
    parties.appendChild(elm);
  });
}

function renderControls(data) {
  var selector = document.querySelector('#year');
  selector.innerHTML = '';
  Object.keys(data).forEach(function(year) {
    var elm = document.createElement('option');
    elm.innerText = year;
    elm.value = year;
    selector.appendChild(elm);
  });
}

window.addEventListener('resize', function() {
  renderHeatmap(window.politicalData['eersteKamer'][2003]);
  renderLabels(window.politicalData['parties']);
});

window.addEventListener('load', function() {
  // Start here:
  window.type = 'eersteKamer';
  window.year = 2003;

  window.heatmapInstance = h337.create({
    // required container
    container: document.querySelector('#heatmap'),
    // backgroundColor to cover transparent areas
    backgroundColor: 'rgba(0,0,0,1)',
    // custom gradient colors
    gradient: {
      // enter n keys between 0 and 1 here
      // for gradient color customization
      '0': 'black',
      '.2': 'blue',
      '.75': 'red',
      '1': 'white'
    },
    // the maximum opacity (the value with the highest intensity will have it)
    maxOpacity: .9,
    // minimum opacity. any value > 0 will produce
    // no transparent gradient transition
    minOpacity: .3,
    radius: (window.innerHeight + window.innerWidth) / 6
  });

  renderHeatmap(window.politicalData[window.type][window.year]);
  renderLabels(window.politicalData['parties']);
  renderControls(window.politicalData[window.type]);

  document.querySelector('#type').addEventListener('change', function() {
    window.type = document.querySelector('#type').value;
    renderControls(window.politicalData[window.type]);
  });

  document.querySelector('#year').addEventListener('change', function() {
    window.year = document.querySelector('#year').value;
    renderHeatmap(window.politicalData[window.type][window.year]);
  });

  document.querySelector('#reset').addEventListener('click', function() {
    localStorage.clear();
    renderHeatmap(window.politicalData[window.type][window.year]);
    renderLabels(window.politicalData['parties']);
  });

  var updateHeatmapOnDrag = function(event) {
    var target = event.target;
    var party = window.politicalData['parties'].find(function(party) {
      return party.label == target.innerText;
    });
    localStorage.setItem(target.innerText,
      parseFloat(target.style.left) + "," + parseFloat(target.style.top));
    renderHeatmap(window.politicalData[window.type][window.year]);
  };

  // Make political parties draggable
  interact('.party').draggable({
    inertia: true,
    onmove: function(event) {
      var target = event.target,
          x      = (parseFloat(target.style.left) || 0) + event.dx,
          y      = (parseFloat(target.style.top) || 0) + event.dy;

      // translate the element
      target.style.left = x + "px";
      target.style.top  = y + "px";

      updateHeatmapOnDrag(event);
    },
    onend: updateHeatmapOnDrag
  })
});
