"use strict;"

function Match(matchId, team1, team2) {
	this.matchId = matchId;
	this.team1 = {
		name: team1
	},
	this.team2 = {
		name: team1
	};
}



var semi_final = new Match("123", "Na\'Vi", "EG");

semi_final.team1.score = 441;
semi_final.team2.score = 440;

	var $team1 = $('.diagramms__team-1'),
		$team2 = $('.diagramms__team-2'),
		$middle = $('.diagramms__middle');


	function drawTeamDiagramm(team,score) {
		team.width(score);
	}
	
	function drawDiagramms() {
		drawTeamDiagramm($team1, semi_final.team1.score);
		drawTeamDiagramm($team2, semi_final.team2.score);	
	}

	$('.diagramms_btn-draw').click(function() {
		$middle.css({'height':140});

		$middle.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function() {
			drawDiagramms();
		});

	});
	