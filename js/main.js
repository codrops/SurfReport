/**
 * main.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2016, Codrops
 * http://www.codrops.com
 */
;(function(window) {

	'use strict';

	// Helper vars and functions.
	function extend( a, b ) {
		for( var key in b ) { 
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}

	function createDOMEl(type, className, content) {
		var el = document.createElement(type);
		el.className = className || '';
		el.innerHTML = content || '';
		return el;
	}

	function createDOMElNS(type, className, content) {
		var el = document.createElementNS('http://www.w3.org/2000/svg', type);
		el.setAttribute('class', className || '');
		el.innerHTML = content || '';
		return el;
	}

		// The SVG path element that represents the sea/wave.
	var wavePath, days = [], citiesCtrl, currentCity = 0, plyrReady,

		mainContainer = document.querySelector('main'),
		graphContainer = mainContainer.querySelector('.content--graph'),
		// The SVG/graph element.
		graph = graphContainer.querySelector('.graph'),
		// SVG viewbox values arr.
		viewbox = graph.getAttribute('viewBox').split(/\s+|,/),
		// Viewport size.
		winsize = {width: window.innerWidth, height: window.innerHeight},
		oscilation = .4,
		timeIntervals = 6,
		/**
		 * Weather data:
		 * . day: the day of the week
		 * . swellheight: let´s assume the swell goes from 0m - 30m. 
		 * 		The swell array represents the intervals of time (00h00m - 04h00m, 04h00m - 08h00m, ..., 20h00m - 24h00m).
		 * 	 	In this case we assume 6 intervals of time (timeIntervals = 6).
		 * 	 	The swell interval represents the average value for the day (or whatever value we want to display when not seeing each individual swell value per time interval)
		 * . swellperiod: same logic but showcasing the swell's period in seconds.
		 * . water: same logic but showcasing the water's temperature.
		 * . state (weather state / weather icon):
		 *   	1-sunny
		 *		2-partly cloudy
		 *		3-cloudy
		 *		4-rain
		 *		5-thunderstorm  
		 *		6-clearnight
		 *		7-partlycloudynight
		 *	. air: same logic but showcasing the air's temperature.
		 *	. windspeed: same logic but showcasing the wind´s speed.
		 *	. winddirection: same logic but showcasing the wind´s direction.
		 */
		data = [
			{
				'name' : 'Nazaré',
				'weather' : [
					{ // today!
						'state': { 'display' : 1, 'hourly' : [6,6,2,1,1,7]},
						'day' : 'Today',
						'date' : '11/21',
						'air' : { 'display' : 28, 'hourly' : [20,17,25,28,27,25]},
						'windspeed' : { 'display' : 3, 'hourly' : [1,2,3,2,1,1]},
						'winddirection' : { 'display' : 135, 'hourly' : [1,178,111,114,210,220]},
						'swellheight' : { 'display' : 2, 'hourly' : [4,2.5,2.5,3,4,6]},
						'swellperiod' : { 'display' : 14, 'hourly' : [10,12,14,13,12,10]},
						'water' : { 'display' : 22, 'hourly' : [18,19,21,22,21,19]}
					},
					{
						'state': { 'display' : 2, 'hourly' : [6,7,2,2,2,7]},
						'day' : 'Tuesday',
						'date' : '11/22',
						'air' : { 'display' : 31, 'hourly' : [22,18,25,31,30,26]},
						'windspeed' : { 'display' : 22, 'hourly' : [6,6,11,16,22,11]},
						'winddirection' : { 'display' : 189, 'hourly' : [100,178,180,186,190,198]},
						'swellheight' : { 'display' : 4, 'hourly' : [3,4,4,5,4,2]},
						'swellperiod' : { 'display' : 15, 'hourly' : [11,13,15,13,14,12]},
						'water' : { 'display' : 21, 'hourly' : [17,18,20,21,20,18]}
					},
					{
						'state': { 'display' : 3, 'hourly' : [6,6,2,3,3,7]},
						'day' : 'Wednesday',
						'date' : '11/23',
						'air' : { 'display' : 25, 'hourly' : [19,16,23,25,24,21]},
						'windspeed' : { 'display' : 18, 'hourly' : [9,11,13,18,18,13]},
						'winddirection' : { 'display' : 200, 'hourly' : [190,187,210,215,220,100]},
						'swellheight' : { 'display' : 9, 'hourly' : [3,4,5,8,8,9]},
						'swellperiod' : { 'display' : 15, 'hourly' : [12,13,15,14,13,12]},
						'water' : { 'display' : 20, 'hourly' : [17,19,19,20,20,18]}
					},
					{
						'state': { 'display' : 4, 'hourly' : [7,7,4,4,4,7]},
						'day' : 'Thursday',
						'date' : '11/24',
						'air' : { 'display' : 24, 'hourly' : [18,15,22,24,23,19]},
						'windspeed' : { 'display' : 36, 'hourly' : [10,11,18,26,36,18]},
						'winddirection' : { 'display' : 5, 'hourly' : [350,1,6,2,8,15]},
						'swellheight' : { 'display' : 11, 'hourly' : [9,9,10,11,11,10]},
						'swellperiod' : { 'display' : 16, 'hourly' : [13,16,16,15,15,14]},
						'water' : { 'display' : 18, 'hourly' : [16,17,18,18,17,16]}
					},
					{
						'state': { 'display' : 5, 'hourly' : [7,7,5,5,5,6]},
						'day' : 'Friday',
						'date' : '11/25',
						'air' : { 'display' : 22, 'hourly' : [19,16,21,22,20,16]},
						'windspeed' : { 'display' : 40, 'hourly' : [18,19,25,29,40,25]},
						'winddirection' : { 'display' : 265, 'hourly' : [250,260,265,270,280,237]},
						'swellheight' : { 'display' : 14, 'hourly' : [8,9,11,14,13,10]},
						'swellperiod' : { 'display' : 19, 'hourly' : [17,18,19,18,17,16]},
						'water' : { 'display' : 19, 'hourly' : [16,17,19,19,18,16]}
					}
				]
			},
			{
				'name' : 'Arrifana',
				'weather' : [
					{ // today!
						'state': { 'display' : 2, 'hourly' : [6,7,2,2,2,7]},
						'day' : 'Today',
						'date' : '11/21',
						'air' : { 'display' : 29, 'hourly' : [20,17,25,29,27,22]},
						'windspeed' : { 'display' : 36, 'hourly' : [35,36,28,25,18,13]},
						'winddirection' : { 'display' : 135, 'hourly' : [1,178,111,114,210,220]},
						'swellheight' : { 'display' : 9, 'hourly' : [6,8,9,9,8,7]},
						'swellperiod' : { 'display' : 19, 'hourly' : [17,18,19,18,17,16]},
						'water' : { 'display' : 23, 'hourly' : [18,19,21,23,22,19]}
					},
					{
						'state': { 'display' : 1, 'hourly' : [7,6,1,1,6,6]},
						'day' : 'Tuesday',
						'date' : '11/22',
						'air' : { 'display' : 27, 'hourly' : [18,15,22,27,26,19]},
						'windspeed' : { 'display' : 26, 'hourly' : [10,11,18,26,25,18]},
						'winddirection' : { 'display' : 5, 'hourly' : [350,1,6,2,8,15]},
						'swellheight' : { 'display' : 8, 'hourly' : [6,8,7,8,8,7]},
						'swellperiod' : { 'display' : 16, 'hourly' : [13,16,16,15,15,14]},
						'water' : { 'display' : 20, 'hourly' : [16,19,20,20,19,17]}
					},
					{
						'state': { 'display' : 1, 'hourly' : [6,6,2,1,1,7]},
						'day' : 'Wednesday',
						'date' : '11/23',
						'air' : { 'display' : 33, 'hourly' : [22,18,25,33,31,26]},
						'windspeed' : { 'display' : 22, 'hourly' : [6,6,11,16,22,11]},
						'winddirection' : { 'display' : 189, 'hourly' : [100,178,180,186,190,198]},
						'swellheight' : { 'display' : 5, 'hourly' : [6,5,4,4,3,2]},
						'swellperiod' : { 'display' : 15, 'hourly' : [11,13,15,13,14,12]},
						'water' : { 'display' : 21, 'hourly' : [17,18,20,21,21,18]}
					},
					{
						'state': { 'display' : 2, 'hourly' : [6,6,1,2,2,6]},
						'day' : 'Thursday',
						'date' : '11/24',
						'air' : { 'display' : 30, 'hourly' : [19,16,23,30,28,21]},
						'windspeed' : { 'display' : 18, 'hourly' : [9,11,13,18,18,13]},
						'winddirection' : { 'display' : 200, 'hourly' : [190,187,210,215,220,100]},
						'swellheight' : { 'display' : 4, 'hourly' : [2,3,4,4,3,2]},
						'swellperiod' : { 'display' : 15, 'hourly' : [12,13,15,14,13,12]},
						'water' : { 'display' : 20, 'hourly' : [17,19,19,20,20,18]}
					},
					{
						'state': { 'display' : 3, 'hourly' : [6,6,2,3,2,6]},
						'day' : 'Friday',
						'date' : '11/25',
						'air' : { 'display' : 28, 'hourly' : [19,16,23,27,28,19]},
						'windspeed' : { 'display' : 40, 'hourly' : [18,19,25,29,40,25]},
						'winddirection' : { 'display' : 265, 'hourly' : [250,260,265,270,280,237]},
						'swellheight' : { 'display' : 4, 'hourly' : [3,3,4,4,3,2]},
						'swellperiod' : { 'display' : 14, 'hourly' : [10,12,14,13,12,10]},
						'water' : { 'display' : 20, 'hourly' : [16,17,19,20,19,16]}
					}
				]
			},
			{
				'name' : 'Matosinhos',
				'weather' : [
					{ // today!
						'state': { 'display' : 3, 'hourly' : [7,7,3,3,4,6]},
						'day' : 'Today',
						'date' : '11/21',
						'air' : { 'display' : 20, 'hourly' : [14,16,19,20,17,12]},
						'windspeed' : { 'display' : 25, 'hourly' : [15,20,25,25,22,23]},
						'winddirection' : { 'display' : 135, 'hourly' : [1,178,111,114,210,220]},
						'swellheight' : { 'display' : 7, 'hourly' : [3,7,7,6,5,4]},
						'swellperiod' : { 'display' : 19, 'hourly' : [17,18,19,18,17,16]},
						'water' : { 'display' : 16, 'hourly' : [15,16,16,16,15,15]}
					},
					{
						'state': { 'display' : 4, 'hourly' : [7,6,3,4,4,7]},
						'day' : 'Tuesday',
						'date' : '11/22',
						'air' : { 'display' : 18, 'hourly' : [13,14,17,18,16,14]},
						'windspeed' : { 'display' : 35, 'hourly' : [14,18,28,35,30,18]},
						'winddirection' : { 'display' : 5, 'hourly' : [350,1,6,2,8,15]},
						'swellheight' : { 'display' : 6, 'hourly' : [3,4,6,6,5,5]},
						'swellperiod' : { 'display' : 16, 'hourly' : [13,16,16,15,15,14]},
						'water' : { 'display' : 16, 'hourly' : [14,15,15,16,15,14]}
					},
					{
						'state': { 'display' : 4, 'hourly' : [7,7,3,4,3,6]},
						'day' : 'Wednesday',
						'date' : '11/23',
						'air' : { 'display' : 19, 'hourly' : [14,14,17,19,17,15]},
						'windspeed' : { 'display' : 20, 'hourly' : [6,6,11,16,20,15]},
						'winddirection' : { 'display' : 189, 'hourly' : [100,178,180,186,190,198]},
						'swellheight' : { 'display' : 7, 'hourly' : [4,5,7,6,5,4]},
						'swellperiod' : { 'display' : 15, 'hourly' : [11,13,15,13,14,12]},
						'water' : { 'display' : 15, 'hourly' : [14,15,15,15,14,14]}
					},
					{
						'state': { 'display' : 5, 'hourly' : [7,7,4,5,5,7]},
						'day' : 'Thursday',
						'date' : '11/24',
						'air' : { 'display' : 17, 'hourly' : [13,15,16,17,16,11]},
						'windspeed' : { 'display' : 18, 'hourly' : [9,11,13,18,18,13]},
						'winddirection' : { 'display' : 200, 'hourly' : [190,187,210,215,220,100]},
						'swellheight' : { 'display' : 6, 'hourly' : [3,5,6,6,6,5]},
						'swellperiod' : { 'display' : 15, 'hourly' : [12,13,15,14,13,12]},
						'water' : { 'display' : 15, 'hourly' : [14,15,15,15,15,15]}
					},
					{
						'state': { 'display' : 2, 'hourly' : [6,6,2,3,2,6]},
						'day' : 'Friday',
						'date' : '11/25',
						'air' : { 'display' : 19, 'hourly' : [14,16,17,19,18,14]},
						'windspeed' : { 'display' : 40, 'hourly' : [18,19,25,29,40,25]},
						'winddirection' : { 'display' : 265, 'hourly' : [250,260,265,270,280,237]},
						'swellheight' : { 'display' : 3, 'hourly' : [4,3,3,3,2,1]},
						'swellperiod' : { 'display' : 14, 'hourly' : [10,12,14,13,12,10]},
						'water' : { 'display' : 16, 'hourly' : [14,15,16,16,15,15]}
					}
				]
			}
		],
		citiesCtrlContainer = mainContainer.querySelector('.custom-select'),
		daysToShow = data[currentCity].weather.length,
		// Width of one day.
		slice = winsize.width/daysToShow,
		// Width of each time interval.
		subSliceWidth = slice/timeIntervals,
		// Show webcam ctrl
		webcamCtrl = document.querySelector('.btn--cam'),
		webcamCloseCtrl = document.querySelector('.btn--close');

	function DayForecast(weather, options) {
		this.weather = weather;
		this.options = extend({}, this.options);
		extend(this.options, options);

		this.showhourly = true;

		this._build();
		this.setData();
	}

	DayForecast.prototype.options = {
		units : {
			temperature : '°C',
			speed : 'km/h',
			length : 'm',
			time : 's'
		} 
	};

	DayForecast.prototype._build = function() {
		this.DOM = {};

		// Contents:
		this.DOM.state = createDOMEl('div', 'wstate-wrap', '<svg class="wstate wstate--sunny"><use xlink:href="#state-sunny"></use></svg><svg class="wstate wstate--cloudy"><use xlink:href="#state-cloudy"></use></svg><svg class="wstate wstate--partlycloudy"><use xlink:href="#state-partlycloudy"></use></svg><svg class="wstate wstate--rain"><use xlink:href="#state-rain"></use></svg><svg class="wstate wstate--thunders"><use xlink:href="#state-thunders"></use></svg><svg class="wstate wstate--clearnight"><use xlink:href="#state-clearnight"></use></svg><svg class="wstate wstate--partlycloudynight"><use xlink:href="#state-partlycloudynight"></use></svg>');

		this.DOM.timeperiodWrapper = createDOMEl('span', 'slice__data slice__data--period slice__data--hidden');
		this.DOM.timeperiodSVG = createDOMElNS('svg', 'icon icon--clock', '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-clock"></use>');
		this.DOM.timeperiod = createDOMEl('span', 'slice__data slice__data--time');
		this.DOM.timeperiodWrapper.appendChild(this.DOM.timeperiodSVG);
		this.DOM.timeperiodWrapper.appendChild(this.DOM.timeperiod);
		
		this.DOM.dayWrapper = createDOMEl('span', 'slice__data slice__data--dateday');
		this.DOM.day = createDOMEl('span', 'slice__data slice__data--day');
		this.DOM.date = createDOMEl('span', 'slice__data slice__data--date');
		this.DOM.dayWrapper.appendChild(this.DOM.day);
		this.DOM.dayWrapper.appendChild(this.DOM.date);

		this.DOM.airWrapper = createDOMEl('span', 'slice__data slice__data--air')
		this.DOM.airSVG = createDOMElNS('svg', 'icon icon--thermometer', '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-thermometer"></use>');
		this.DOM.air = createDOMEl('span', 'slice__data slice__data--temperature');
		this.DOM.airWrapper.appendChild(this.DOM.airSVG);
		this.DOM.airWrapper.appendChild(this.DOM.air);
		
		this.DOM.wind = createDOMEl('span', 'slice__data slice__data--wind');
		this.DOM.windspeed = createDOMEl('span', 'slice__data slice__data--wind-speed');
		this.DOM.winddirectionWrapper = createDOMEl('span', 'slice__data slice__data--wind-direction');
		this.DOM.winddirection = createDOMElNS('svg', 'icon icon--direction', '<use xlink:href="#icon-direction"></use>');
		this.DOM.winddirectionWrapper.appendChild(this.DOM.winddirection);
		this.DOM.wind.appendChild(this.DOM.winddirection);
		this.DOM.wind.appendChild(this.DOM.windspeed);
		
		this.DOM.swell = createDOMEl('span', 'slice__data slice__data--swell');
		this.DOM.swellSVG = createDOMElNS('svg', 'icon icon--wave', '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-wave"></use>');
		this.DOM.swellheight = createDOMEl('span', 'slice__data slice__data--swell-height');
		this.DOM.swellperiod = createDOMEl('span', 'slice__data slice__data--swell-period');
		this.DOM.swell.appendChild(this.DOM.swellSVG);
		this.DOM.swell.appendChild(this.DOM.swellheight);
		this.DOM.swell.appendChild(this.DOM.swellperiod);

		this.DOM.waterWrapper = createDOMEl('span', 'slice__data slice__data--water');
		this.DOM.waterSVG = createDOMElNS('svg', 'icon icon--thermometer', '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-thermometer"></use>');
		this.DOM.water = createDOMEl('span', 'slice__data slice__data--temperature');
		this.DOM.waterWrapper.appendChild(this.DOM.waterSVG);
		this.DOM.waterWrapper.appendChild(this.DOM.water);
		
		this.DOM.slice = createDOMEl('div');
		this.DOM.slice.appendChild(this.DOM.state);
		this.DOM.slice.appendChild(this.DOM.timeperiodWrapper);
		this.DOM.slice.appendChild(this.DOM.dayWrapper);
		this.DOM.slice.appendChild(this.DOM.airWrapper);
		this.DOM.slice.appendChild(this.DOM.wind);
		this.DOM.slice.appendChild(this.DOM.swell);
		this.DOM.slice.appendChild(this.DOM.waterWrapper);

		this._buildHourlyLayout();
	};

	DayForecast.prototype._buildHourlyLayout = function() {
		this.DOM.subslicesWrapper = createDOMEl('div', 'slice__hover');
		var subslicesHTML = '';
		for(var i = 0; i <= timeIntervals-1; ++i) {
			subslicesHTML += '<div></div>';
		}
		this.DOM.subslicesWrapper.innerHTML = subslicesHTML;
		this.DOM.slice.appendChild(this.DOM.subslicesWrapper);

		var self = this;
		this.mouseleaveFn = function(ev) {
			if( !self.showhourly ) return false;
			self.DOM.timeperiodWrapper.classList.add('slice__data--hidden');
			self.setData();
		};
		this.DOM.slice.addEventListener('mouseleave', self.mouseleaveFn);

		this.mouseenterFn = function(ev) {
			if( !self.showhourly ) return false;
			self._showTimePeriod(self.DOM.subslices.indexOf(ev.target));
		};
		this.DOM.subslices = [].slice.call(this.DOM.subslicesWrapper.querySelectorAll('div'));
		this.DOM.subslices.forEach(function(subslice) {
			subslice.addEventListener('mouseenter', self.mouseenterFn);
		});
	};

	DayForecast.prototype.setData = function(weather) {
		if( weather ) {
			this.weather = weather;
		}
		for(var w in this.weather) {
			this[w] = this.weather[w];
		}

		this._setState();
		this._setTimePeriod();
		this._setDay();
		this._setDate();
		this._setAir();
		this._setWindSpeed();
		this._setWindDirection();
		this._setSwellHeight();
		this._setSwellPeriod();
		this._setWater();
	};

	DayForecast.prototype._setState = function(val, timeperiod) {
		var val = val !== undefined ? val : this.state.display;
		if( timeperiod !== undefined ) {
			this.DOM.slice.className = 'slice ' + this._getStateClassname(val) + ' ' + this._getPeriodClassname(timeperiod);
		}
		else {
			this.DOM.slice.className = 'slice ' + this._getStateClassname(val);
		}
	};
	
	DayForecast.prototype._setTimePeriod = function(val) {
		var val = val !== undefined ? val : '&nbsp;';
		this.DOM.timeperiod.innerHTML = val;
	};
	
	DayForecast.prototype._setDay = function(val) {
		var val = val !== undefined ? val : this.day;
		this.DOM.day.innerHTML = val;
	};

	DayForecast.prototype._setDate = function(val) {
		var val = val !== undefined ? val : this.date;
		this.DOM.date.innerHTML = val;
	};
	
	DayForecast.prototype._setAir = function(val) {
		var val = val !== undefined ? val : this.air.display;
		this.DOM.air.innerHTML = val + ' ' + this.options.units.temperature;
	};
	
	DayForecast.prototype._setWindSpeed = function(val) {
		var val = val !== undefined ? val : this.windspeed.display;
		this.DOM.windspeed.innerHTML = val + ' ' + this.options.units.speed;
	};
	
	DayForecast.prototype._setWindDirection = function(val, windspeed) {
		var val = val !== undefined ? val : this.winddirection.display;
		this.DOM.winddirection.style.WebkitTransform = this.DOM.winddirection.style.transform = 'rotate(' + val + 'deg)';

		anime.remove(this.DOM.winddirection);
		var windspeed = windspeed !== undefined ? windspeed : this.windspeed.display;
		anime({
			targets: this.DOM.winddirection,
			rotate: val + 40/100*windspeed,
			duration: 200-windspeed,
			loop: true,
			direction: 'alternate',
			easing: 'easeInOutQuad'
		});
	};
	
	DayForecast.prototype._setSwellHeight = function(val) {
		var val = val !== undefined ? val : this.swellheight.display;
		this.DOM.swellheight.innerHTML = val + ' ' + this.options.units.length;
	};
	
	DayForecast.prototype._setSwellPeriod = function(val) {
		var val = val !== undefined ? val : this.swellperiod.display;
		this.DOM.swellperiod.innerHTML = val + ' ' + this.options.units.time;
	};

	DayForecast.prototype._setWater = function(val) {
		var val = val !== undefined ? val : this.water.display;
		this.DOM.water.innerHTML = val + ' ' + this.options.units.temperature;
	};

	DayForecast.prototype._showTimePeriod = function(period) {
		this._setState(this.state.hourly[period], period);
		this.DOM.timeperiodWrapper.classList.remove('slice__data--hidden');
		this._setTimePeriod(this._getTimePeriod(period));
		this._setAir(this.air.hourly[period]);
		this._setWindSpeed(this.windspeed.hourly[period]);
		this._setWindDirection(this.winddirection.hourly[period], this.windspeed.hourly[period]);
		this._setSwellHeight(this.swellheight.hourly[period]);
		this._setSwellPeriod(this.swellperiod.hourly[period]);
		this._setWater(this.water.hourly[period]);
	};

	DayForecast.prototype._getTimePeriod = function(period) {
		var interval = 24/timeIntervals;
		return period*interval+':00 - ' + (period+1)*interval + ':00';
	};

	DayForecast.prototype._getStateClassname = function(state) {
		var c = 'slice--state-';
		switch(state) {
			case 1 : c += 'sunny'; break;
			case 2 : c += 'partlycloudy'; break;
			case 3 : c += 'cloudy'; break;
			case 4 : c += 'rain'; break;
			case 5 : c += 'thunders'; break;
			case 6 : c += 'clearnight'; break;
			case 7 : c += 'partlycloudynight'; break;
		};
		return c;
	};

	DayForecast.prototype._getPeriodClassname = function(timeperiod) {
		return 'slice--period-' + (timeperiod + 1); // todo: this depends on the [timeIntervals]
	};

	DayForecast.prototype.getEl = function() {
		return this.DOM.slice;
	};

	function init() {
		layout();
		createGraph();
		initEvents();
	}

	function layout() {
		citiesCtrl = createDOMEl('select');
		citiesCtrl.innerHTML = '<select>';
		for(var i = 0, len = data.length; i <= len-1; ++i) {
			citiesCtrl.innerHTML += '<option value="' + i + '" ' + (i === 0 ? 'selected' : '') + '>' + data[i].name + '</option>'
		}
		citiesCtrl.innerHTML += '</select>';
		citiesCtrlContainer.appendChild(citiesCtrl);
		citiesCtrl.addEventListener('change', changeCityFn);

		var slices = createDOMEl('div', 'slices');
		// Create a "slice" per day.
		for(var i = 0; i <= daysToShow-1; ++i) {
			var dayWeather = data[currentCity].weather[i];
			var day = new DayForecast(dayWeather);
			days.push(day);
			slices.appendChild(day.getEl());
		}

		graphContainer.insertBefore(slices, graph);
	}

	function changeCityFn(ev) {
		currentCity = ev.target.value;
		
		mainContainer.className = 'theme-' + parseInt(Number(currentCity)+1);

		for(var i = 0; i <= daysToShow-1; ++i) {
			days[i].setData(data[currentCity].weather[i]);
		}

		var points = setPoints(),
			newpath = calculatePath(points);
		anime.remove(wavePath);
		anime({
			targets: wavePath,
			d: newpath,
			duration: 1000,
			easing: 'easeInOutQuad',
			complete: function() {
				animateWave();
			}
		});
	}

	function createGraph() {
		// Create the "wave" path.
		wavePath = createDOMElNS('path', 'graph__path');
		graph.appendChild(wavePath);
		// The path points needed to draw the curve. We will draw [daysToShow] points/days + 2 points to fill the path + 2 extra points to smooth the extremities.
		var points = setPoints();
		anime.remove(wavePath);
		wavePath.setAttribute('d', calculatePath(points));
		setTimeout(animateWave, 500);
	}

	function setPoints(shift) {
		var weather = data[currentCity].weather;
		// the swell extremities (y-axis):
		var extremities = {left: weather[0].swellheight.hourly[0], right: weather[daysToShow-1].swellheight.hourly[timeIntervals-1]},
			// the points array
			points = [];

		for(var i = 0; i <= daysToShow+3; ++i) {
			var x, y;

			if( i === 0 || i === daysToShow+3 ) {
				x = i === 0 ? -1*subSliceWidth*2 : winsize.width+subSliceWidth*2;
				y = 0;
				points.push({x:x,y:y});
			}
			else if( i === 1 || i === daysToShow+2 ) {
				x = i === 1 ? -1*subSliceWidth : winsize.width+subSliceWidth;
				y = i === 1 ? extremities.left/2 : extremities.right/2;
				if( shift ) {
					y = i%2 === 0 ? y-oscilation : y+oscilation;
				}
				points.push({x:x,y:y});
			}
			else {
				var daySwell = weather[i-2].swellheight.hourly;
				for(var j = 0, len = daySwell.length; j <= len-1; ++j) {
					x = slice*(i-2) + subSliceWidth*j + subSliceWidth/2;
					y = daySwell[j];

					/*
					if( !shift ) {
						// Create the circles/points and add them to the graph.
						var point = createDOMElNS('circle', 'graph__point');
						point.setAttribute('cx', viewbox[2]/winsize.width*x);
						point.setAttribute('cy', (-1*Number(viewbox[3])/2)/30*y+Number(viewbox[3]));
						point.setAttribute('r', 2);
						graph.appendChild(point);
					}
					else {
						y = j%2 === 0 ? y-oscilation : y+oscilation;
					}
					*/

					if( shift ) {
						y = j%2 === 0 ? y-oscilation : y+oscilation;	
					}
					
					points.push({x:x,y:y});
				}
			}
		};

		return points;
	}

	function animateWave() {
		var shiftPoints = setPoints(true), 
			shiftpath = calculatePath(shiftPoints);

		anime({
			targets: wavePath,
			d: shiftpath,
			duration: 2000,
			loop: true,
			direction: 'alternate',
			easing: 'easeInOutQuad'
		});
	}

	function calculatePath(points) {
		var d = '', d2 = '';
		for(var i = 0, len = points.length; i < len; ++i) {
			var p = points[i];

			var mapping = {x: viewbox[2]/winsize.width*p.x, y: (-1*Number(viewbox[3])/2)/15*p.y+Number(viewbox[3])};

			if( 0 == i ) {
				d = "M" + mapping.x + "," + mapping.y;
			} else if( 1 == i ) {
				d += " R" + mapping.x + "," + mapping.y;
			} else{
				d += " " + mapping.x + "," + mapping.y;
			}

			d2 = parsePath(d);
		}
		return d2;
	}

	function initEvents() {
		webcamCtrl.addEventListener('click', showLiveCam);
		webcamCloseCtrl.addEventListener('click', hideLiveCam);
		mainContainer.querySelector('.content--cam > div').addEventListener('canplay', function() {
			webcamCtrl.classList.remove('btn--hidden');
			player.setVolume(0);
			plyrReady = true;
		});
		mainContainer.querySelector('.content--cam > div').addEventListener('ended', function() {
			player.seek(0);
			player.play();
		});
		
		// The hourly forecast per day is only active when the screen is bigger than X px..
		enquire.register("screen and (max-width:43.25em)", {
			match : function() {
				for(var i = 0; i <= daysToShow-1; ++i) {
					days[i].showhourly = false;
				}
			},
			unmatch : function() {
				for(var i = 0; i <= daysToShow-1; ++i) {
					days[i].showhourly = true;
				}
			}
		});
	}

	function showLiveCam() {
		mainContainer.classList.add('switch-content');
		if( plyrReady ) {
			player.setVolume(0);
			player.play();
		}
	}

	function hideLiveCam() {
		mainContainer.classList.remove('switch-content');
		player.pause();
	}

	// Video related.
	var players = plyr.setup({
			controls : [],
			clickToPlay : false,
			//autoplay: true
		}), 
		player = players[0].plyr;

	init();

})(window);