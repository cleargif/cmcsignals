/* jshint white:false */

$(function() {

  var template = function(data) {
    var id = data.id,
      rank = data.rank,
      base = 'USD',
      marketCap = data.market_cap_usd == null ? 'N/A' : data.market_cap_usd,
      vol24h = data['24h_volume_usd'] == null ? 'N/A' : data['24h_volume_usd'];


    return [

      '<div class="element-item">',
      '<h3 class="symbol">' + data.symbol + '</h3>',
      '<p class="name">' + data.name + '</p>',
      '<p class="rank">' + data.rank + '</p>',
      '<p class="vol24h">' + vol24h + '</p>',
      '<p class="marketCap">' + marketCap + '</p>',
      '</div>'

      // '<a href="http://coinmarketcap.com/currencies/'+ id +'/" class="name">'+ data.name +'</a>',


      // '        <span style="font-size: 16px;">3835.22 USD <span style="color:#093">(30.14%)</span></span>',

      // '        <img src="https://files.coinmarketcap.com/static/img/coins/64x64/'+ id +'.png" />',

      // '        RANK',
      // '        <span style="font-size: 17px;" class="rank">'+ rank +'</span>',
      // '        MARKET CAP',
      // '        <span style="font-size: 14px; ">'+ marketCap +'<span style="font-size:9px">'+ base +'</span></span>',
      // '        VOLUME (24H)',
      // '        <span style="font-size: 14px; ">'+ vol24h +' <span style="font-size:9px">'+ base +'</span></span>'
    ].join('')

  }


  var module = function() {

    // init Isotope
    var $grid = $('.grid').isotope({
      itemSelector: '.element-item',
      layoutMode: 'fitRows',
      getSortData: {
        name: '.name',
        symbol: '.symbol',
        rank: '.rank parseInt',
        vol24h: '.vol24h parseInt',
        marketCap: '.marketCap parseInt',

        category: '[data-category]',
        weight: function(itemElem) {
          var weight = $(itemElem).find('.weight').text();
          return parseFloat(weight.replace(/[\(\)]/g, ''));
        }
      }
    });

    // filter functions
    var filterFns = {
      // show if number is greater than 50
      numberGreaterThan50: function() {
        var number = $(this).find('.number').text();
        return parseInt(number, 10) > 50;
      },
      // show if name ends with -ium
      ium: function() {
        var name = $(this).find('.name').text();
        return name.match(/ium$/);
      }
    };

    // bind filter button click
    $('#filters').on('click', 'button', function() {
      var filterValue = $(this).attr('data-filter');

      // use filterFn if matches value
      filterValue = filterFns[filterValue] || filterValue;
      $grid.isotope({
        filter: filterValue
      });
    });

    // bind sort button click
    $('#sorts').on('click', 'button', function() {
      var sortByValue = $(this).attr('data-sort-by');

      $grid.isotope({
        sortBy: sortByValue
      });
    });

    $('#sort-direction a').click(function() {
      // get href attribute, minus the '#'
      var sortAscending = $(this).attr('data-option-value') == 'true' ? true : false;
      var sortBy = $('#sorts .is-checked').data('sortBy');

      console.log({
        sortBy: sortBy,
        sortAscending: sortAscending
      });
      $grid.isotope({
        sortBy: sortBy,
        sortAscending: sortAscending
      });
      return false;
    });


    // change is-checked class on buttons
    $('.button-group').each(function(i, buttonGroup) {
      var $buttonGroup = $(buttonGroup);
      $buttonGroup.on('click', 'button', function() {
        $buttonGroup.find('.is-checked').removeClass('is-checked');
        $(this).addClass('is-checked');
      });
    });

    window.$grid = $grid;
  }


  $.get('https://api.coinmarketcap.com/v1/ticker/?limit=0', function(data) {
    data.forEach(function(obj, id) {
      $('#hooked .grid').append(template(obj))
    })
  }).then(function() {
    module();
  })
});
