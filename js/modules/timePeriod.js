// time period

var filter = function() {};

module.exports.setFilterCallback = function (callback) {
  filter = callback;
};

module.exports.init = function () {
  $('.lca-col-timeperiod').click(function (event) {
  	var divId = event.target.id;
  	filter('timerperiod',parseInt(divId.slice(3)),0);
  });
}

module.exports.selectTimePeriod = function (timePeriod) {
  $('.lca-col-timeperiod').removeClass("lca-col-timeperiod-sel");
  $('#div' + String(timePeriod)).addClass("lca-col-timeperiod-sel");
};

