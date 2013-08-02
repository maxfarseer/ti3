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
		var form = options.element;
		var checboxes = $('#user__more__choise1,#user__more__choise2');

		checboxes.on('click',onCheckboxClick);

		function onCheckboxClick() {
			setFormFields($(this));
		}

		function setFormFields(element) {
			var str = element.attr('id');
			if(element.prop('checked')) {
				$('#'+str+'-field').slideDown(200);	
			}
			else {
				$('#'+str+'-field').slideUp(200);
			}
		}

	}

	var userForm = new UserRequest({
		element: $('.user__more-pub')
	});



});

