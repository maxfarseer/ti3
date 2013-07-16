$(function() {

	// overlay

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

	ajaxRefreshScore();
	// user-more (вывести попап-форму "попасть в ленту")
	$('.btn-add-user-more').click(function() {

		$.ajax({
			type: "POST",
			dataType: "json",
			data: {data:"get_prof"},
			beforeSend: function() {
				$('.btn-add-user-more').html('<i class="icon-time"></i> загрузка...');
			},
			url: 'userpoll.php',
			success: function(data) {
				console.log(data);
				$('#um_skill').val(data.skill);
		        if (+data.role != 0 ) {
		        	console.log('find');
					$('.user__more__choise-want').hide();
		        	$('.user__more__choise-find').show();
		        	$('#um_role').val(data.role);
		        }
		        if (+data.search_1 != 0) {
		        	console.log('want');
		        	$('#user__more__choise2').click();
					$('.user__more__choise-find').hide();
		        	$('.user__more__choise-want').show();
		        	$('#um_search1').val(data.search1);

		        	if (+data.seahch_2 != 0) $('#um_search2').val(data.search2);
		        }
		        
		        $('#um_time_beg').val(data.time_beg); 
		        $('#um_time_end').val(data.time_end); 
		        $('#um_vtime_beg').val(data.vtime_beg); 
		        $('#um_vtime_end').val(data.vtime_end);

				$('.veil').removeClass('none');
				$('.user__more').removeClass('none');
			}
		});

	});
	$('.icon-off-user-more').click(function() {
		$(this).closest('.user__more').addClass('none');
		$('.veil').addClass('none');
		$('.btn-add-user-more').html('<i class="icon-plus"></i> Попасть в ленту');
	});


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
				for (var i = 0; i<points.length; i++) {
					if ((points[i] < 0) || (points[i] > 100)) {
						$('.error-poll').html('Число голосов некорректно');
						$('.error-poll').removeClass('none');
						return false;
					}
					if (pointsSum != 100) {
						$('.error-poll').html('Сумма очков не равна 100!');
						$('.error-poll').removeClass('none');
						return false;
					}
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
				console.log(dataPHP);
			},
			complete: function() {
				$('.success-user-more').removeClass('none');
			}
		});

	}


	// загружаем ищущих
	$('#loadUserFromDB').on('click',function() {
		$.ajax({
			type: "POST",
			data:{"data":"getComandIn"},
			url: 'userpoll.php',
			success: function(dataPHP) {
				$('#userFromDB').hide().html(dataPHP).fadeIn(300);
			},
		});
	});

	// те кто ищет в команду
	$('#loadUserFromDB-out').on('click',function() {
		$.ajax({
			type: "POST",
			data:{"data":"getComandOut"},
			url: 'userpoll.php',
			success: function(dataPHP) {
				$('#userFromDB-out').hide().html(dataPHP).fadeIn(300);
			},
		});
	});	


});

