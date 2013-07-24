"use strict";

function maxInArray(a,b) {
	if (a > b) return -1;
	if (a < b) return 1;
}



function pollsDiagramm(obj) { /* любое кол-во аргументов */
	var team = [],
		points = [],
		pollWidth = 460; //ширина полоски

	for (var key in obj) {
		team.push(key);
		points.push(obj[key]);
	}
	
	var unit = pollWidth / points[0];
	
	for (var i = 0; i < 3; i++) {
		var $pile = $('.score__top'+(i+1));
		$pile.width(points[i] * unit);
		$pile.html(team[i] + ': ' + points[i]);
	}
	$('.score__more-top1').html(team[0] + ': ' + points[0]);
	$('.score__more-top2').html(team[1] + ': ' + points[1]);
	$('.score__more-top3').html(team[2] + ': ' + points[2]);


}