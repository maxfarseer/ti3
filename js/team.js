"use strict";

function Team(official_name, simple_name) {
	this.name = official_name;
	this.simple = simple_name;
}

var navi = new Team("Na'Vi", "navi");
var virtuspro = new Team("Virtus.Pro", "virtuspro");
var eg = new Team("EG","eg");
var alliance = new Team("Alliance", "alliance");
var quantic = new Team("Quantic", "quantic");

function maxInArray(a,b) {
	if (a > b) return -1;
	if (a < b) return 1;
}



function pollsDiagramm(maxPoll) { /* любое кол-во аргументов */
	var pollWidth = 462;
	var unit = pollWidth / maxPoll;
	
	for (var i = 1; i <= arguments.length; i++) {

		var points = arguments[i];
		var $pile = $('.score__top'+i);
		$pile.width(points * unit);
	};
}