$(function() {

	$('.btn__login').click(function() {
		$('.overlay__login').removeClass('none');
	});

	$('.icon-off').click(function() {
		$(this).closest('.overlay').addClass('none');
	});

	$('#score__refresh').click(function() {

		var $points = $('.points__count');
		var $team = $('.select__team');
		var points = [],
			team = [],
			whoMax = [],
			whoMax2 = [],
			obj = {},
			scoreJSON = "";
		
		$points.each(function(index,element) {
			var tempTeam = $team[index].value;
			obj[tempTeam] = +$points[index].value;
			points.push(+$points[index].value);
		});

		whoMax = points.slice(); //копирнули массив
		whoMax = whoMax.sort(maxInArray)[0];
		console.log(whoMax);
		console.log(points);

		pollsDiagramm(whoMax,points[0],points[1],points[2]);

		scoreJSON = JSON.stringify(obj);
		$('.draft__scoreJSON').html('Отправлены данные: ' + scoreJSON);
		
	}); //click refresh






});

