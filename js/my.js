$(function() {

	// overlay

	function ajaxRefreshScore() {
		$.ajax({
		type: "POST",
		data: {data:"refresh"},
		url: 'userpoll.php',
		success: function(dataPHP) {
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
				$('#um_skill').val(data.skill);
		        if (+data.role != 0 ) {
					$('.user__more__choise-want').hide();
		        	$('.user__more__choise-find').show();
		        	$('#um_role').val(data.role);
		        }
		        if (+data.search_1 != 0) {
		        	$('#user__more__choise2').click();
					$('.user__more__choise-find').hide();
		        	$('.user__more__choise-want').show();
		        	$('#um_search1').val(data.search_1);

		        	if (+data.search_2 != 0) $('#um_search2').val(data.search_2);
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

		var $team1 = $('.select__team-top1');
		var $team2 = $('.select__team-top2');
		var $team3 = $('.select__team-top3');
		
		var obj = {},
			scoreJSON = "",
			multiplier = 1;

		if ($team1.val() === $team2.val() || $team1.val() === $team3.val() || $team2.val() === $team3.val()) {
				$('.error-poll').removeClass('none');
				return false;
		};

		$('.select__team').each(function(index, element) {

			if ($(element).hasClass('select__team-top1')) {
				multiplier = 3;
			};
			if ($(element).hasClass('select__team-top2')) {
				multiplier = 2;
			};
			if ($(element).hasClass('select__team-top3')) {
				multiplier = 1;
			};

			obj[$(element).val()] = multiplier;

		});

		scoreJSON = JSON.stringify(obj);
		
		$.ajax({
			type: "POST",
			dataType: "json",
			data: {myData:scoreJSON,data:"poll"},
			url: 'userpoll.php',
			complete: function(dataPHP) {
				$('.btn-poll').prop('disabled', true);
				$('.error-poll').addClass('none');
				$('.success-poll').removeClass('none');
				window.location.reload();
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

	$.ajax({
        type: "POST",
        data:{"data":"getComandIn"},
        url: 'userpoll.php',
        success: function(dataPHP) {
            $('#userFromDB').html(dataPHP).fadeIn(300);
        },
    });
    $.ajax({
        type: "POST",
        data:{"data":"getComandOut"},
        url: 'userpoll.php',
        success: function(dataPHP) {
            $('#userFromDB-out').html(dataPHP).fadeIn(300);
        },
    });


	/* info JS */

	$('.admin__stats').hover(function() {
		$(this).stop(true,true).animate({'left':'0'},200);
	}, function() {
		$(this).stop(true,true).animate({'left':'-218'},200);
	});

	
	/* pubgame */
	// https://mindgrader.com/tutorials/1-how-to-create-a-simple-javascript-countdown-timer

	var target_date = new Date().getTime()+302000; // 300 000 = плюс 5 минут
 
	var hours, minutes, seconds;
	 
	var $countdown = $("#pubgame_countdown-1");
	 
	var countdown_ticker = setInterval(pubTicker, 1000);

	function pubTicker() {
	 
	    var current_date = new Date().getTime();
	    var seconds_left = (target_date - current_date) / 1000;
	 
	    hours = parseInt(seconds_left / 3600);
	    seconds_left = seconds_left % 3600;
	     
	    minutes = parseInt(seconds_left / 60);
	    seconds = parseInt(seconds_left % 60);

	    if (hours < 10) {
	    	hours= '0'+hours
	    };
	    if (minutes < 10) {
	    	minutes= '0'+minutes
	    };
	    if (seconds < 10) {
	    	seconds= '0'+seconds
	    };
	     
	    $countdown.html(hours + ":" + minutes + ":" + seconds);
	 
	}

	var pubJSON = '{"01": {"skill":"1","role":"1","msg":"Ищем еще парочку, клоз-гейм - пароль dnodno, мод ЦМ или AP. Привет Екб! spu2er - ЛОХ! И текст не влез, ну и пофиг."},"02": {"skill":"2","role":"2","msg":"Вы можете написать сообщение здесь."},"03": {"skill":"3","role":"1","msg":"Go! pass 123qwe. Raki idut lesom."}}';

	var pubParsedJSON = JSON.parse(pubJSON);
	console.log('qq');

	
});

