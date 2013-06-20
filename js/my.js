$(function() {

	$('.btn-login').click(function() {
		$('.veil').removeClass('none');
		$('.overlay').removeClass('none');
	});

	$('.icon-off').click(function() {
		$(this).closest('.overlay').addClass('none');
		$('.veil').addClass('none');
		$('.tutorial').fadeOut(400, function() {
			$('.after-login').fadeIn(400);
		});
	});


	$('.btn-poll').click(function() {

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

		/*whoMax = points.slice(); //копирнули массив
		whoMax = whoMax.sort(maxInArray)[0];

		pollsDiagramm(whoMax,points[0],points[1],points[2]); */

		scoreJSON = JSON.stringify(obj);
		$('.draft__scoreJSON').html('Отправлены данные: ' + scoreJSON);
	}); //click refresh


//ajax

	$('.score__refresh').click(function() {

		$.getJSON('json/team_score.json', function(data) {
			var items = [];
			var points = [];
			var teams = [];
			
			$.each(data, function(key, val) {
				items.push('<li>' + key + ':' + '<span class="score__points">'+ val + '</span>' + '</li>');
				points.push(val);
			});

			$('<ul/>', {
			'class': 'jq__getJSON',
			html: items.join('')
			}).appendTo('.draft__score__points');

			//ползунки

			var whoMax = points.slice(); //копирнули массив
			var top3team = whoMax.sort(maxInArray).slice(0,3);
			whoMax = whoMax.sort(maxInArray)[0];

			pollsDiagramm(whoMax,top3team[0],top3team[1],top3team[2]);

			$('.score__top').each(function(index,elem) {
				$(elem).html('Команда скрыта');
			});

		});


		
		$('.score__date').html('Последнее обновление: ' + new Date().toLocaleString() );
	});


});

