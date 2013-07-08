$(function() {

	// overlay

	$('.btn-login').click(function() {
		$('.veil').removeClass('none');
		$('.overlay').removeClass('none');
	});

	$('.icon-off').click(function() {
		$(this).closest('.overlay').addClass('none');
		$('.veil').addClass('none');
		$('.btn-login').hide();
		$('.tutorial').fadeOut(400, function() {
			$('.after-login').fadeIn(400,ajaxRefreshScore());
		});

		function ajaxRefreshScore() {
			$.ajax({
			type: "POST",
			data: {data:"refresh"},
			url: 'userpoll.php',
			success: function(dataPHP) {
				console.log(JSON.parse(dataPHP));
				pollsDiagramm(JSON.parse(dataPHP));
			}
			});
			$('.score__date').html('Последнее обновление: ' + new Date().toLocaleString() );	
		};

	});

	// user-more (вывести попап-форму "попасть в ленту")
	$('.btn-add-user-more').click(function() {
		$('.veil').removeClass('none');
		$('.user__more').removeClass('none');
	});
	$('.icon-off-user-more').click(function() {
		$(this).closest('.user__more').addClass('none');
		$('.veil').addClass('none');
	});

	// голосовать
	$('.btn-poll').click(function() {

		var $points = $('.points__count');
		var $team = $('.select__team');
		var points = [],
			team = [],
			obj = {},
			scoreJSON = "",
			pointsSum = 0;
		
		$points.each(function(index,element) {
			var tempTeam = $team[index].value;
			obj[tempTeam] = +$points[index].value;
			points.push(+$points[index].value);
			pointsSum += points[index];
		});

		scoreJSON = JSON.stringify(obj);
		
		$.ajax({
			type: "POST",
			dataType: "json",
			data: {myData:scoreJSON,data:"poll"},
			beforeSend: function() {
				if (pointsSum != 100) {
					$('.success-poll').addClass('none');
					$('.error-poll').removeClass('none');
					return false;
				}
			},
			url: 'userpoll.php',
			success: function(dataPHP) {
				$('.btn-poll').prop('disabled', true);
				$('.error-poll').addClass('none');
				$('.success-poll').removeClass('none');
			}
		});

	}); // btn-poll click end
	
	// возьму / ищу в команду
	if ($('#user__more__choise2').is(':checked')) {
		$('.user__more__choise-find').hide();
		$('.user__more__choise-want').fadeIn(200);
	}
	else {
		$('.user__more__choise-want').hide();
		$('.user__more__choise-find').fadeIn(200);	
	}


	$('.radio-user-more').on('click', function() {
		if ($('#user__more__choise2').is(':checked')) {
			$('.user__more__choise-find').hide();
			$('.user__more__choise-want').fadeIn(200);
		}
		else {
			$('.user__more__choise-want').hide();
			$('.user__more__choise-find').fadeIn(200);	
		}
	});
	//возьму / ищу в команду конец

	// попасть в ленту
	$('.btn-user-more').on('click',getIntoTape);

	function getIntoTape() {
		var skill = $('#um_skill').val(),
			role = $('#um_role').val(),
			search1 = $('#um_search1').val(),
			search2 = $('#um_search2').val(),
			um_time_beg = $('#um_time_beg').val(),
			um_time_end = $('#um_time_end').val(),
			um_vtime_beg = $('#um_vtime_beg').val(),
			um_vtime_end = $('#um_vtime_end').val(),
			comand_in = 0,
			comand_out = 0;

			if ($('#user__more__choise2').is(':checked')) {
				comand_out = 1;
			}
			if ($('#user__more__choise1').is(':checked')) {
				comand_in = 1;
			}

		var obj = {
			skill: skill,
			role: role,
			search1: search1,
			search2: search2,
			time_beg: um_time_beg,
			time_end: um_time_end,
			vtime_beg: um_vtime_beg,
			vtime_end: um_vtime_end,
			comand_in: comand_in,
			comand_out: comand_out
		}

		if (obj.comand_in == 1) {
			obj.search1 = 0;
			obj.search2 = 0;
		}
		if (obj.comand_out == 1) {
			obj.role = 0;
		}

		var usermoreJSON = JSON.stringify(obj);


		$.ajax({
			type: "POST",
			dataType: "json",
			data: {prof:usermoreJSON, data:"user_prof"},
			url: 'userpoll.php',
			success: function(dataPHP) {

			},
			complete: function() {
				$('.success-user-more').removeClass('none');
			}
		});

	}



});

