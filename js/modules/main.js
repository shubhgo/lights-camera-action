!(function () {
  var sm = require('./shotmap.js');
  var mt = require('./movieTable.js');
  var tp = require('./timePeriod.js');

  // var sm = ShotMap();
  // // sm.setFilterCallback(filter);
  // var mt = MovieTable();
  // // mt.setFilteCallback(filter);
  // var tp = TimePeriod();

  sm.setFilterCallback(filter);
  mt.setFilterCallback(filter);
  tp.setFilterCallback(filter);
  tp.init();

  var currentFilter = {
    'timeP': '1990',
    'movieHover': '',
    'movieSelected': null,
    'spot': null
  };

  function filter(action, value, index) {
    var tprd, totp, filterText;
    if (action == 'timerperiod') {
      tprd = String(value);
      currentFilter.timeP = tprd;
      currentFilter.movieHover = null;
      currentFilter.movieSelected = null;
      // currentFilter.spot = null;

      totp = tprd.substr(0, 3) + '9';
      filterText = 'Time Period: ' + tprd + ' to ' + totp;
      sm.filterText.text(filterText);

      sm.reloadMapWithTimePeriod(value);
      mt.reloadMovieWithTimePeriod(value);

      tp.selectTimePeriod(value);
    }

    if (action == 'movieTableHover') {
      tprd = currentFilter.timeP;
      totp = tprd.substr(0, 3) + '9';
      currentFilter.movieHover = value.title;
      currentFilter.movieSelected = null;
      filterText = 'Time Period: ' + tprd + ' to ' + totp + ' Movie: ' + value.title;
      sm.filterText.text(filterText);

      sm.highlightSpotsForMovie(value.title);
      mt.highlightMovie(value.title);
    }

    if (action == 'movieTableHoverEnd') {
      tprd = currentFilter.timeP;
      totp = tprd.substr(0, 3) + '9';
      currentFilter.movieHover = null;

      filterText = 'Time Period: ' + tprd + ' to ' + totp;
      if (currentFilter.movieSelected) {
        filterText = filterText + ' Movie: ' + currentFilter.movieSelected;
      }
      sm.filterText.text(filterText);

      sm.highlightSpotsForMovie(currentFilter.movieSelected);
      mt.highlightMovie(currentFilter.movieSelected);
    }

    if (action == 'movieTableSelected') {
      tprd = currentFilter.timeP;
      totp = tprd.substr(0, 3) + '9';
      currentFilter.movieSelected = value.title;
      filterText = 'Time Period: ' + tprd + ' to ' + totp + ' Movie: ' + value.title;
      sm.filterText.text(filterText);

      sm.highlightSpotsForMovie(value.title);
      mt.highlightMovie(value.title);
    }

    if (action == 'spotSelected') {
      //show modal for movie
      angular.element('#movieModal').scope().updateForMovieID(value.movieid);
      angular.element($('#movieModal')).scope().$apply();
      $('#movieModal').modal('show');
    }

    if (action == 'search') {}

  };

  // load the map and the table
  filter('timerperiod', '2000', '');
})()
