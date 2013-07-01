$(function() {

	// overlay

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

	// user-more
	$('.btn-add-user-more').click(function() {
		$('.veil').removeClass('none');
		$('.user__more').removeClass('none');
	});
	$('.icon-off-user-more').click(function() {
		$(this).closest('.user__more').addClass('none');
		$('.veil').addClass('none');
	});


	$('.btn-poll').click(function() {

		var $points = $('.points__count');
		var $team = $('.select__team');
		var points = [],
			team = [],
			obj = {},
			scoreJSON = "";
		
		$points.each(function(index,element) {
			var tempTeam = $team[index].value;
			obj[tempTeam] = +$points[index].value;
			points.push(+$points[index].value);
		});

		scoreJSON = JSON.stringify(obj);

		$.ajax({
			type: "POST",
			// dataType: "json",
			data: {myData:scoreJSON,data:"poll"},
			beforeSend: function() {
				$('.draft__scoreJSON').html('в userpoll улетело' + scoreJSON);
			},
			url: 'userpoll.php',
			success: function(dataPHP) {
				$('.draft__scoreJSON').html('принял данные' + dataPHP);
			}
		});

	}); // btn-poll click end


	$('.score__refresh').click(function() {

		$.ajax({
			type: "POST",
			// dataType: "json",
			data: {data:"refresh"},
			url: 'userpoll.php',
			success: function(dataPHP) {
				//$('.draft__scoreJSON').html('принял данные' + dataPHP);
				console.log(dataPHP);
			}
		});

		$('.score__date').html('Последнее обновление: ' + new Date().toLocaleString() );
	});

	
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



});

