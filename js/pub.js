$(function() {

	var users = '[\
		{\
			"id":"01",\
			"skill":"1",\
			"role":"1",\
			"msg":"Ищем еще парочку, клоз-гейм - пароль dnodno, мод ЦМ или AP. Привет Екб! spu2er - ЛОХ! И текст не влез, ну и пофиг.",\
			"img":"img/noavatar.jpg",\
			"contact":"max@max.com"\
		},\
		{\
			"id":"02",\
			"skill":"2",\
			"role":"2",\
			"msg":"Вы можете написать сообщение здесь.",\
			"img":"img/noavatar.jpg",\
			"contact":"vk.com/iiispikeriii"\
		},\
		{\
			"id":"03",\
			"skill":"3",\
			"role":"1",\
			"msg":"Go! pass 123qwe. Raki idut lesom.",\
			"img":"img/noavatar.jpg",\
			"contact":"vk.com/lexaxe"\
		}\
	]';
	

	var usersJSON = (JSON.parse(users));

	$.each(usersJSON, function(i,el) {
		var user = usersJSON[i];

		var user_id = 'pubUser-'+user.id;
		var skill = user.skill;
		var role = user.role;
		var msg = user.msg;
		var avatar = user.img;
		var contact = user.contact;

		var pubUserHTML = $('<div/>',
								{
									id: user_id,
									"class": "team__user__wrapper team__user__wrapper-pub",
								}).html(
								'<div class="team__user__ava">\
                        			<img alt="No avatar" src="'+avatar+'">\
                    			</div>\
                    			<div class="team__user team__user-pub">\
		                        <div class="team__user__item">\
		                            <i class="icon-star"></i>\
		                            <span class="t__user t__user-skill">'+skill+'</span>\
		                        </div>\
		                        <div class="team__user__item">\
		                            <i class="icon-tag"></i>\
		                            <span class="t__user t__user-spec">'+role+'</span>\
		                        </div>\
		                        <div class="team__user__item">\
		                            <div class="team__user_msg">'+msg+'</div>\
		                        </div>\
		                        <div class="team__user__item">\
		                            <div class="team__user_clock"><i class="icon-time"></i>&nbsp;\
		                                <span id="pubgame_countdown-1">loading...</span></div>\
		                        </div>\
		                        <div class="team__user__item team__user__item-bottom">\
		                            <i class="icon-envelope"></i>\
		                            <a class="t__user t__user-link" href="'+contact+'" target="_blank">Связаться</a>\
		                        </div>\
                    			')
								.appendTo($('#userFromDB-pub'));
	});

	

	// form
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
		        if (+data.role != 0 ) {
		        	$('#user__more__choise1').prop('checked','checked');
		        	$('#um_role').val(data.role);
		        }
		        if (+data.search_1 != 0) {
		        	$('#user__more__choise2').prop('checked','checked');
		        	$('#um_search1').val(data.search_1);
		        	if (+data.search_2 != 0) $('#um_search2').val(data.search_2);
		        	setFormFields($('#user__more__choise2'));
		        }
		        
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

		var usermoreJSON = JSON.stringify(obj);
		console.log(usermoreJSON);

		$.ajax({
			type: "POST",
			dataType: "json",
			data: {prof:usermoreJSON, data:"user_prof"},
			url: 'userpoll.php',
			beforeSend: function() {
				
				if ($('#user__more__choise2').is(':checked')) {
					obj.comand_out = 1;
				};
				if ($('#user__more__choise1').is(':checked')) {
					obj.comand_in = 1;
				};
				
			},
			success: function() {
				console.log(obj);
			}
		});

		onBtnCloseClick();

		};
	};

	var userForm = new UserRequest({
		element: $('.user__more-pub'),
		btnOpen: $('#loadUserFromDB-pub')
	});




});

