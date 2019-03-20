function mapXToScreen(x) {
  return Math.floor((x + 10) * window.innerWidth / 20);
}
function mapYToScreen(y) {
  return Math.floor((-1*y + 10) * window.innerHeight / 20);
}

function renderHeatmap(data) {
  var points = [];
  Object.keys(data).forEach(function(label) {
    var party = window.politicalData['parties'].find(function(party) {
      return party.label == label;
    });
    points.push({
      value: data[label],
      x:     mapXToScreen(party.x),
      y:     mapYToScreen(party.y)
    })
  });

  // heatmap data format
  var data = {
    max: 13,
    data: points
  };

  window.heatmapInstance.setData(data);
}

function renderLabels(data) {
  var parties = document.querySelector('#parties');
  parties.innerHTML = '';

  data.forEach(function(point) {
    var elm = document.createElement('div');
    var x = mapXToScreen(point.x);
    var y = mapYToScreen(point.y);
    elm.innerText = point.label;
    elm.className = 'party';
    elm.style = "left: "+x+"px; top: "+y+"px;";
    elm.title = point.name;
    parties.appendChild(elm);
  });
}

function renderControls() {

}

window.addEventListener('load', function() {
  window.heatmapInstance = h337.create({
    // required container
    container: document.querySelector('#heatmap'),
    // backgroundColor to cover transparent areas
    backgroundColor: 'rgba(0,0,0,.95)',
    // custom gradient colors
    gradient: {
      // enter n keys between 0 and 1 here
      // for gradient color customization
      '.5': 'blue',
      '.8': 'red',
      '.95': 'white'
    },
    // the maximum opacity (the value with the highest intensity will have it)
    maxOpacity: .9,
    // minimum opacity. any value > 0 will produce
    // no transparent gradient transition
    minOpacity: .3,
    radius: window.innerHeight / 3
  });

  renderHeatmap(window.politicalData['eersteKamer'][2015]);
  renderLabels(window.politicalData['parties']);

  document.querySelector('#year').addEventListener('change', function() {
    var year = document.querySelector('#year').value;
    renderHeatmap(window.politicalData['eersteKamer'][year]);
  });
});

window.addEventListener('resize', function() {
  renderHeatmap(window.politicalData['eersteKamer'][2015]);
  renderLabels(window.politicalData['parties']);
});
