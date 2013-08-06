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
	function UserRequest(options) {
		var self = this;
		var form = options.element;
		var checkboxes = $('#user__more__choise2'); // или больше чекбоксов на форме, можно расширять
		var fieldHeight = 50;
		var btnOpen = options.btnOpen;
		var btnClose = $('.overlay__close',form);
		var btnSubmit = $('.btn-user-more', form);
		
		// проверить статус чекбоксов.
		$('.user__more_checkboxes').each(function() {
			if ( $(this).prop('checked') ) {
				var elemID = $(this).attr('id');
				$('#'+elemID+'-field').css({'backgroundColor':'#FFFFFF'}).slideDown(200);
			}
		});

		checkboxes.on('click',onCheckboxClick);

		function onCheckboxClick() {
			setFormFields($(this));
		};

		function setFormFields(element) {
			var str = element.attr('id');
			if(element.prop('checked')) {
				$('#'+str+'-field').slideDown(200).css({'backgroundColor':'#FFFFFF'});
			}
			else {
				$('#'+str+'-field').slideUp(200).css({'backgroundColor':'#FFFF99'});;
			}
		};

		btnOpen.on('click', onBtnOpenClick);
		btnClose.on('click', onBtnCloseClick);
		btnSubmit.on('click', onBtnSubmitClick);

		function onBtnOpenClick() {
			setFieldsValueAJAX($(this));
			$('.veil').removeClass('none');
			$('.user__more').removeClass('none');
		}

		function onBtnCloseClick() {
			$('.veil').addClass('none');
			$('.user__more').addClass('none');
			btnOpen.html('Попасть в ленту');
		}

		function onBtnSubmitClick() {
			sendFieldsValueAJAX(); // не путать с setFieldsValueAJAX
			$('.veil').removeClass('none');
			$('.user__more').removeClass('none');
		}

		function setFieldsValueAJAX(btn) {
			$.ajax({
			type: "POST",
			dataType: "json",
			data: {data:"get_prof"},
			beforeSend: function() {
				btn.html('<i class="icon-time"></i> загрузка...');
			},
			url: 'userpoll.php',
			success: function(data) {
				$('#um_skill').val(data.skill);
		        if (+data.comand_in != 0) {
		        	$('#user__more__choise1').prop('checked','checked');
		        };
		        if (+data.role != 0 ) {
		        	$('#um_role').val(data.role);
		        };
		        if (+data.search_1 != 0) {
		        	$('#user__more__choise2').prop('checked','checked');
		        	$('#um_search1').val(data.search_1);
		        	if (+data.search_2 != 0) $('#um_search2').val(data.search_2);
		        	setFormFields($('#user__more__choise2'));
		        };
		        
		        $('#um_time_beg').val(data.time_beg); 
		        $('#um_time_end').val(data.time_end); 
		        $('#um_vtime_beg').val(data.vtime_beg); 
		        $('#um_vtime_end').val(data.vtime_end);

				$('.veil').removeClass('none');
				$('.user__more').removeClass('none');
			}
			});
		};

		function sendFieldsValueAJAX() {

			var obj = {
				skill: $('#um_skill').val(),
				role: $('#um_role').val(),
				search1: 0,
				search2: 0,
				time_beg: $('#um_time_beg').val(),
				time_end: $('#um_time_end').val(),
				vtime_beg: $('#um_vtime_beg').val(),
				vtime_end: $('#um_vtime_end').val(),
				comand_in: 0,
				comand_out: 0
			};

			if ( $('#user__more__choise2').prop('checked') ) {
				obj.search1 = $('#um_search1').val();
				obj.search2 = $('#um_search2').val();
			};
			if ($('#user__more__choise2').is(':checked')) {
				obj.comand_out = 1;
			};
			if ($('#user__more__choise1').is(':checked')) {
				obj.comand_in = 1;
			};

			var usermoreJSON = JSON.stringify(obj);

			$.ajax({
				type: "POST",
				dataType: "json",
				data: {prof:usermoreJSON, data:"user_prof"},
				url: 'userpoll.php',
				complete: function() {
					onBtnCloseClick();
				}
			});
		};
	};

	var userForm = new UserRequest({
		element: $('.user__more-pub'),
		btnOpen: $('.btn-add-user-more')
	});

	//велосипед =( (гоу пабчик)
	function GoPub(options) {
		var self = this;
		var form = options.element;
		var btnOpen = options.btnOpen;
		var btnClose = $('.overlay__close',form);
		var btnSubmit = $('.btn-user-more',form);

		btnOpen.on('click', onBtnOpenClick);
		btnClose.on('click', onBtnCloseClick);
		btnSubmit.on('click', onBtnSubmitClick);

		function onBtnOpenClick() {
			// setFieldsValueAJAX($(this));
			$('.veil').removeClass('none');
			$('.user__more-pubgame').removeClass('none');
		}

		function onBtnCloseClick() {
			$('.veil').addClass('none');
			$('.user__more-pubgame').addClass('none');
			btnOpen.html('Гоу пабчик!');
		}

		function onBtnSubmitClick() {
			sendFieldsValueAJAX(); // не путать с setFieldsValueAJAX
			$('.veil').removeClass('none');
			$('.user__more-pubgame').removeClass('none');
		}

		function sendFieldsValueAJAX() {

			var userComment = ''+$('.pubgame_text').val();

			$.ajax({
				type: "POST",
				dataType: "json",
				data: {data:"setPublic", comment:userComment},
				url: 'userpoll.php',
				complete: function() {
					onBtnCloseClick();
				}
			});
		};

	};

	var userForm = new GoPub({
		element: $('.user__more-pubgame'),
		btnOpen: $('#loadUserFromDB-pubGame')
	});

	// голосование
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


	/* Режим бога */

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

	// получить желающих в паб при загрузке страницы
	$('#loadUserFromDB-ajaxtest').click(function() {
		$.ajax({
			type: "POST",
			dataType: "json",
			data: {data:"getPublic"},
			url: 'userpoll.php',
			success: function(data) {
				console.log(''+JSON.parse(data));
			}
		});
	});
	
});

