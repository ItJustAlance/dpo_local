function SetSelectCustom(){
	$('.cus-sel').not('[name=UF_SCHOOL_NAME_N]').ikSelect({
		ddFullWidth: false,
		autoWidth: false
	});
}
function OpenPopusWithHelp(){
	$.fancybox.open({
		'overlayShow': true,
		'padding': 15,
		'closeBtn' : true,
		'scrolling' : 'auto',
		'width' : 'auto',
		'titleShow': false,
		'type': 'ajax',
		'href': '/ajax/show_help_popup.php',
		'helpers': {
			'overlay': {
				'locked': false
			}
		}
	});
}

function loadReminder(idu) {
	return true;
	/*
	$.fancybox({
		afterShow: function() {
			$('.cc_userfields select').select2({
				width:'300',
				minimumResultsForSearch: 5
			});
			$('.profile-hd').removeClass('hidden');
		},
		helpers : {
			overlay : {closeClick: false}
		},
		width: 620,
		height: 420,
		autoSize: false,
		href: '/ajax/show_change_userfields.php?id='+idu,
		type: 'ajax'
	});
	*/
}

function loadCityReminder(idu, regId) {
	$.fancybox({
		afterShow: function() {
			$('.cc_userfields select').select2({
				width:'300',
				minimumResultsForSearch: 5
			});
			$('.profile-hd').removeClass('hidden');
		},
		helpers : {
			overlay : {closeClick: false}
		},
		width: 720,
		height: 'auto',
		autoSize: false,
		href: '/ajax/show_city_fill.php?id='+idu + '&region_id='+regId,
		type: 'ajax'
	});
}

function SetProperty(idEl,PropCode,setPr){

	if(PropCode == "SHIFR"){
		var years = prompt('Шифр', setPr);
		if(years == setPr || !years){
			return false;
		}

		setPr = years;
	}
	$('#ajaxLoad').show();
	$.ajax({
		url: "/ajax/wodk_props.php",
		data: "id="+idEl+"&property="+PropCode+"&set="+setPr,
		dataType: 'json',
		type: 'post',
		success:function(data){
			if(data.RES == "OK"){
				//location.reload();
				$.ajax({
					url: "/ajax/show_curs.php",
					data: "id="+idEl,
					dataType: 'html',
					type: 'get',
					success:function(data){
						$('.fancybox-inner').html(data);
						$('#ajaxLoad').hide();
						$.ajax({
							url: location.href,
							data: "ajax=Y",
							dataType: 'html',
							type: 'get',
							success:function(data){
								var shfC = $(data).find('table.curses_list').find('tr.curs_st_'+idEl).find('.shfrC').text();
								var statsC = $(data).find('table.curses_list').find('tr.curs_st_'+idEl).find('.statusC').text();
								var utverC = $(data).find('table.curses_list').find('tr.curs_st_'+idEl).find('.utvezhdC').text();
								$('tr.curs_st_'+idEl).find('.shfrC').text(shfC);
								$('tr.curs_st_'+idEl).find('.statusC').text(statsC);
								$('tr.curs_st_'+idEl).find('.utvezhdC').text(utverC);
							},
						});
					},
				});
			}else{
				alert(data.ERR);
				$('#ajaxLoad').hide();
			}

		},
	});
}
function SolgZTeacher(idEl,PropCode,setPr){

	$('#ajaxLoad').show();
	$.ajax({
		url: "/ajax/wodk_props.php",
		data: "id="+idEl+"&property="+PropCode+"&set="+setPr,
		dataType: 'json',
		type: 'post',
		success:function(data){
			if(data.RES == "OK"){

			}else{
				console.log(data.ERR);
			}
			$('#ajaxLoad').hide();
			location.reload();
		},
	});
}
function DoRegister(){
	$('input[name="UF_PREPOD_PRED"]').remove();
	var haveErrors = false;
	$('.errorField').removeClass('errorField');

	$('#regform input[type=text]').filter( ":visible" ).each(function(){
		var IsRequired = $(this).parents('td.properties').hasClass('reuireField');
		var val = $(this).val();
		var name = $(this).attr('name');

		if(IsRequired){
			if(val == "" || val == 0){
				$(this).addClass('errorField');
				haveErrors = true;
			}else{
				$(this).removeClass('errorField');
			}
		}
	});


	/*
	*	ФИО
	*/
	$('input[name="REGISTER[LAST_NAME]"], input[name="REGISTER[NAME]"], input[name="REGISTER[SECOND_NAME]"]').each(function(index){

		$(this).parent().find('.fio-error').remove();

		/* Если срятано(нет отчества), то пропустить проверку */
		if ( $(this).is(':hidden') ){
			$(this).val('');
			$(this).removeClass('errorField');
			return;
		}

		$(this).val($(this).val().trim());

		var regex = /^[А-ЯЁёа-я -]+$/;
		if (parseInt($("select[name='REGISTER[PERSONAL_COUNTRY]']").val(), 10) == 1) {
			if ( !regex.test($(this).val()) ){

				$(this).addClass('errorField');

				haveErrors = true;

				$(this).after('<div class="fio-error" style="color:red; font-size: 13px;margin-top:4px;display:block;">Необходимо указать в кириллице</div>');

			} else $(this).removeClass('errorField');
		}
	});

	/*
	*	Валидация предмета учителя
	*/
	if ( $("[name=UF_U_WORK]").val() == 10847 ){

		if ( !$("select[name=UF_PREPOD_PRED]").val() ){

			$('select[name="UF_PREPOD_PRED"]').parent().addClass('errorField');

			haveErrors = true;
		} else{

			$('select[name="UF_PREPOD_PRED"]').parent().removeClass('errorField');
		}
	}

	/*
	*	Валидация email
	*/
	if ( !GLOBALSERR.EMAIL ){

		haveErrors = true;

		$('#regform input[name="REGISTER[EMAIL]"]').addClass('errorField');

	} else{

		$('#regform input[name="REGISTER[EMAIL]"]').each(function(){

			$(this).removeClass('errorField');

			if ( $('.email-error').length ) $('.email-error').remove();

			var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

			if ( !regex.test($(this).val()) ){

				haveErrors = true;

				$("#email_text").css({'display':'none'}).children('span').html('');

				$(this).addClass('errorField');

				$(this).after('<div class="email-error" style="color:red; font-size: 13px;margin-top:4px;display:block;">Некорректный адрес e-mail</div>');
			}
		});
	}

	/*
	*	Валидация пола (PERSONAL_GENDER)
	*/
	var GenderSelect = false;

	$('.gender-error').remove();

	$('#regform input[name="REGISTER[PERSONAL_GENDER]"]').each(function(){
		if ( $(this).is(':checked') ) GenderSelect = true;
	});

	if ( !GenderSelect ){

		haveErrors = true;

		$('.l-start-gender').parent().append('<div class="gender-error" style="color:red; font-size: 13px;margin-top:4px;display:block;">Не указан пол</div>')
	}
	/*--------------- конец Валидация пола------------------*/

	/*
	*	Валидация даты рождения
	*/
	if ( $('#regform input[name="REGISTER[PERSONAL_BIRTHDAY]"]').length && !$('#regform input[name="REGISTER[PERSONAL_BIRTHDAY]"]').val() ){

		haveErrors = true;

		$('#regform input[name="REGISTER[PERSONAL_BIRTHDAY]"]').addClass('errorField');
	}
	/*--------------- конец Валидация даты рождения------------------*/

	/*
	*	Валидация номера телефона
	*/
	// $('.phone-error').remove();

	if ( ($('#REGISTER_PERSONAL_PHONE').val().length == 13) && ($('#REGISTER_PERSONAL_PHONE').val().indexOf("_") >= 0)){

		haveErrors = true;

		$('#REGISTER_PERSONAL_PHONE').addClass('errorField');

		// $('#phone_text').after('<div class="phone-error" style="color:red; font-size: 13px;margin-top:4px;display:block;">Некорректный номер телефона</div>');

	} else {

		if ( $('#REGISTER_PERSONAL_PHONE').val().length  && $('#REGISTER_PERSONAL_PHONE').hasClass('errorField') ) $('#REGISTER_PERSONAL_PHONE').removeClass('errorField');
	}

	/*
	*	Проверка на выбранную "Должность по месту работы"
	*/
	var Uwork = $("select[name=UF_U_WORK]");

	Uwork.removeClass('errorField');

	// $('.uwork-error').remove();

	if ( Uwork.children('option:selected').attr('disabled') == 'disabled' ){
		Uwork.addClass('errorField');
		// Uwork.after('<div class="uwork-error" style="color:red; font-size: 13px;margin-top:4px;display:block;">Не выбрана должность</div>');
		haveErrors = true;
	}
	/*-------- Конец Проверка на выбранную "Должность по месту работы" -------------*/

	/*
	*	Проверка на наименование Учебного заведения если пользователь не из Москвы
	*/
	$("[name=UF_SCHOOL_NAME]").removeClass('errorField');

	if ( $("[name=UF_USER_REGION]").val() != "12111" ){

		if ( !$("[name=UF_SCHOOL_NAME]").val().trim().length ){

			haveErrors = true;

			$("[name=UF_SCHOOL_NAME]").addClass('errorField');
		}

	} else{

		if ( !$("[name=UF_SCHOOL_NAME_N]").val() ){

			haveErrors = true;

			$('td#UF_SCHOOL_NAME_N div:eq(0)').addClass('errorField');
		}

	}
	/*-------- Конец Проверка на наименование Учебного заведения если пользователь не из Москвы -------------*/

	/*
	*	Проверка пароля
	*/
	if ( !GLOBALSERR.PASSWORD ) $('input[name="REGISTER[PASSWORD]"]').trigger('change');


	/*
	*	Подтверждение пароля
	*/
	if ( !GLOBALSERR.PASCONFIRM ) $('input[name="REGISTER[CONFIRM_PASSWORD]"]').trigger('change');


	/*
	*	СНИЛС
	*/
	if ( !GLOBALSERR.SNILS ) $('input[name="UF_SNILS"]').trigger('change');


	$('#regform input[type=radio]').each(function(){
		var IsRequired = $(this).parent().parent('td').hasClass('reuireField');
		var val = $(this).val();
		var name = $(this).attr('name');
		//console.log(IsRequired);
		if(IsRequired){

			if(val == "" || val == 0){
				$(this).addClass('errorField');
				haveErrors = true;
			}else{
				$(this).removeClass('errorField');
			}
		}
	});
	$('#regform select').each(function(){
		var IsRequired = $(this).parents('td.properties:visible').hasClass('reuireField');
		var val = $(this).val();
		var name = $(this).attr('name');
		if(IsRequired){
			console.log(name);
			if(val == "" || val == 0 || !val){
				$(this).parents('.ik_select').addClass('errorField');
				$(this).addClass('errorField');
				haveErrors = true;
			}else{
				$(this).parents('.ik_select').removeClass('errorField');
				$(this).removeClass('errorField');
			}
		}
	});
	var IscheckedAgr = $('#regform input#agree').is(":checked");
	if(!IscheckedAgr){
		// $('#regform input#agree').parents('.reuireField').addClass('errorField');
		$('#regform input#agree').parent().addClass('errorField');
		haveErrors = true;
	}else{
		// $('#regform input#agree').parents('.reuireField').removeClass('errorField');
		$('#regform input#agree').parent().removeClass('errorField');
	}

	/*
	*	Проверка CAPTCHA
	*/
	if ( !GLOBALSERR.CAPTCHA ) $('input[name="captcha_word"]').trigger('change');


	// if ( !haveErrors ) haveErrors = CheckGLOBALSERR();

	var RegMePlease = function(haveErrors){

		/*
		*	Проверка GLOBALSERR
		*/
		var CheckGLOBALSERR = function(){

			var keys = Object.keys(GLOBALSERR);

			while ( keys.length ){

				var key = keys.shift();

				if ( !GLOBALSERR[key] ) return true;
			}

			return false;
		}

		if ( AJAXINPROGRESS ){

			var timerId = setTimeout( RegMePlease, 200, haveErrors);

			return false;

		} else{

			if ( !haveErrors ) haveErrors = CheckGLOBALSERR();
			console.log('ce2', GLOBALSERR);
			if ( haveErrors ){

				var posit = $('.errorField:first').closest('tr');

				// console.log(posit);

				// $.scrollTo(posit, 500);
				// setTimeout(function(){
				// $(document).scrollTo(posit, {duration: 500});
				// }, 100);
				$('html, body').animate({
						scrollTop: posit.offset().top
					},
					{
						duration: 500,
						easing: "easeOutQuint"
					});
				return false;
			}else{
				if (checkSnilsPfr()) {
					// $('#regform').submit();
				}
			}
		}
	}

	if ( AJAXINPROGRESS ){

		var timerId = setTimeout( RegMePlease, 200, haveErrors);
	} else{
		console.log('errors', haveErrors);
		RegMePlease(haveErrors);
	}
}

function SetPropertyGroup(idEl,PropCode,setPr){
	var CanSetAj = true;

	if ( ((setPr == 55)||(setPr == 61)) && !$('.groupuserline').length ){
		alert('Группа без слушателей!');
		return false;
	}

	if(PropCode == "STATUS" && setPr == 62){
		$('.editCurs select.setStatZ').each(function(){
			var valT = $(this).val();
			if(!valT || valT == 0) {
				CanSetAj = false;
			}
		})

		if(!CanSetAj){
			alert('Необходимо установить статусы окончания!');
			return false;
		}

		/* Проверка причин отчисления */
		let ok = true;

		$('select.setStatZ:visible').each(function(index){

			if ( ($(this).val() == 'Нет') || !$(this).val().length ) ok = false;
		});

		if ( !ok ){

			alert('Не выбрана причина отчисления!');

			return;
		}
	}


	$('#ajaxLoad').show();
	$.ajax({
		url: "/ajax/wodk_props.php",
		data: "id="+idEl+"&property="+PropCode+"&set="+setPr,
		dataType: 'json',
		type: 'post',
		success:function(data){
			location.reload(true);
			// $('#ajaxLoad').hide();
		},
	});

	return true;
}


function StopCurs(idC){
	if(!idC || idC == 0)
		return false;
	if(!confirm("Запись на курс будет приостановлена. Вы уверены?"))
		return false;
	$('#ajaxLoad').show();
	$.ajax({
		url: "/ajax/stop_curs.php",
		data: "id="+idC,
		dataType: 'json',
		type: 'post',
		success:function(data){
			if(data.RES == "OK"){
				$('#ajaxLoad').hide();
				$('#crsStper').attr('onclick', 'StartCurs('+idC+')');
				$('#crsStper').val('Разрешить запись на курс');
				$('#crsStper').css('background', "#00830F");

			}
		},
	});
}

function StartCurs(idC){
	if(!idC || idC == 0)
		return false;
	if(!confirm("Запись на курс будет продолжена. Вы уверены?"))
		return false;
	$('#ajaxLoad').show();
	$.ajax({
		url: "/ajax/start_curs.php",
		data: "id="+idC,
		dataType: 'json',
		type: 'post',
		success:function(data) {
			if(data.RES == "OK"){
				$('#ajaxLoad').hide();
				$('#crsStper').attr('onclick', 'StopCurs('+idC+')');
				$('#crsStper').val('Остановить запись на курс');
				$('#crsStper').css('background', "#9C0808");
			}
		},
	});
}

function Deletecurs(idC){
	if(!idC || idC == 0)
		return false;
	if(!confirm("После удаления, восстановить данные невозможно. Вы уверены?"))
		return false;
	$('#ajaxLoad').show();
	$.ajax({
		url: "/ajax/del_curs.php",
		data: "id="+idC,
		dataType: 'json',
		type: 'post',
		success:function(data){
			if(data.RES == "OK"){
				location.reload();
			}
		},
	});
}


function deleteUser(idC){
	if(!idC || idC == 0)
		return false;
	if(!confirm("После удаления, восстановить пользователя невозможно. Вы уверены?"))
		return false;
	$('#ajaxLoad').show();
	$.ajax({
		url: "/ajax/del_user.php",
		data: "id="+idC,
		dataType: 'json',
		type: 'post',
		success:function(data){
			if(data.RES == "OK"){
				location.reload();
			}
		},
	});
}

function DeleteZ(idC){
	if(!idC || idC == 0)
		return false;
	if(!confirm("После удаления, восстановить данные невозможно. Вы уверены?"))
		return false;
	$('#ajaxLoad').show();
	$.ajax({
		url: "/ajax/del_z.php",
		data: "id="+idC,
		dataType: 'json',
		type: 'post',
		success:function(data){
			if(data.RES == "OK"){
				location.reload();
			}else{
				alert("Ошибка удаления!");
			}
		},
	});
}

function DeleteZD(idC, idd){
	if(!idC || idC == 0)
		return false;
	if(!confirm("После удаления, восстановить данные невозможно. Вы уверены?"))
		return false;
	$('#ajaxLoad').show();
	$.ajax({
		url: "/ajax/del_z_dir.php",
		data: "id="+idC+'&idd='+idd,
		dataType: 'json',
		type: 'post',
		success:function(data){
			if(data.RES == "OK"){
				location.reload();
			}else{
				alert("Ошибка удаления!");
			}
		},
	});
}

function DeleteMess(idC){
	if(!idC || idC == 0)
		return false;
	if(!confirm("После удаления, восстановить данные невозможно. Вы уверены?"))
		return false;
	$('.ajL'.idC).show();
	$.ajax({
		url: "/ajax/del_mess.php",
		data: "id="+idC,
		dataType: 'json',
		type: 'post',
		success:function(data){
			if(data.RES == "OK"){
				location.reload();
			}
		},
	});
}
function insertParam(key, value) {
	key = escape(key); value = escape(value);

	var kvp = document.location.search.substr(1).split('&');
	if (kvp == '') {
		document.location.search = '?' + key + '=' + value;
	}
	else {

		var i = kvp.length; var x; while (i--) {
			x = kvp[i].split('=');

			if (x[0] == key) {
				x[1] = value;
				kvp[i] = x.join('=');
				break;
			}
		}

		if (i < 0) { kvp[kvp.length] = [key, value].join('='); }

		//this will reload the page, it's likely better to store this until finished
		document.location.search = kvp.join('&');
	}
}

$(document).ready(function(){

	var locPAr = location.search;
	var locPth = location.pathname;
	if(locPth == "/curs/"){
		var locPArSpl = locPAr.split("?id=");
		if(parseInt(locPArSpl[1])>0){
			$.fancybox.open({
				'overlayShow': true,
				'padding': 0,
				'closeBtn' : false,
				'scrolling' : 'auto',
				'width' : 950,
				'titleShow': false,
				'type': 'ajax',
				'href': '/ajax/show_curs.php?id='+locPArSpl[1],
				'helpers': {
					'overlay': {
						'locked': false
					}
				}
			});
		}
	}


	$('select#cursList').ikSelect({
		ddFullWidth: false,
		autoWidth: false,
		filter: true,
		nothingFoundText: 'Nothing found'
	});
	$('.fancy').on('hover', function(ev){
		ev.preventDefault()
		var dataId = $(this).attr('data-id');
		$(this).fancybox({
			'overlayShow': true,
			'padding': 0,
			'closeBtn' : false,
			'scrolling' : 'auto',
			'titleShow': false,
			'type': 'ajax',
			'href': '/ajax/show_curs.php?id='+dataId+'&backlink='+encodeURIComponent(window.location.href.toString().split(window.location.host)[1]),
			'beforeClose': function(){
				//oBXFileDialog.Close();
				$('#BX_file_dialog_close').click();
			},
			'helpers': {
				'overlay': {
					'locked': false
				}
			},

		});
	})
	$('.fancyAchive').on('hover', function(ev){
		ev.preventDefault()
		var dataId = $(this).attr('data-id');
		$(this).fancybox({
			'overlayShow': true,
			'padding': 0,
			'closeBtn' : false,
			'scrolling' : 'auto',
			'titleShow': false,
			'type': 'ajax',
			'href': '/ajax/show_curs_archive.php?id='+dataId,
			'helpers': {
				'overlay': {
					'locked': false
				}
			}
		});
	})

	$("#sel-phone2,#sel-phone3,#PROPERTY_28").keydown(function(event) {
		// Разрешаем: backspace, delete, tab и escape
		if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 ||
			// Разрешаем: Ctrl+A
			(event.keyCode == 65 && event.ctrlKey === true) ||
			// Разрешаем: home, end, влево, вправо
			(event.keyCode >= 35 && event.keyCode <= 39)) {
			// Ничего не делаем
			return;
		}
		else {
			// Обеждаемся, что это цифра, и останавливаем событие keypress
			if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
				event.preventDefault();
			}
		}
	});

	$('#PROPERTY_51').inputmask("8(999)999-9999");
	$('#REGISTER_PERSONAL_PHONE').inputmask("8(999)9999999");
	$('select[name="UF_TYPE_ORBAZ"] option:eq(0)').remove();
	$('#sTime').inputmask("99:99");
	$('#poTime').inputmask("99:99");

	$('input[name="UF_SNILS"]').inputmask("999-999-999 99");
	/*$('#PROPERTY_DATE_ACTIVE_TO, #PROPERTY_DATE_ACTIVE_FROM').focus(function(){
		$(this).parents('td').find('.calendar-icon').click();
	});
	$('#PROPERTY_DATE_ACTIVE_TO, #PROPERTY_DATE_ACTIVE_FROM').blur(function(){
		$(this).parents('td').find('.calendar-icon').click();
	});*/

	setTimeout(function(){
		if (navigator.appVersion.indexOf("OPR/") != -1) {
			// console.log('CHROME!!!! ' + $('.ik_select').length);
			$('.ik_select').css({
				'background' : 'url("../img/select-arr-opera.png ")100% 50% no-repeat #fff',
			});
		} else if (navigator.appVersion.indexOf("Edge/") != -1) {
			// console.log('CHROME!!!! ' + $('.ik_select').length);
			$('.ik_select').css({
				'background' : 'url("../img/select-arr-edge.png ")100% 50% no-repeat #fff',
			});
		} else if (navigator.appVersion.indexOf("Chrome/") == -1) {
			// console.log('CHROME!!!! ' + $('.ik_select').length);
			$('.ik_select').css({
				'background' : 'url("../img/select-arr-moz.png ")99.8% 50% no-repeat #fff',
			});
		}
	}, 100);
});


function changeDigit(a, b, i) {
	function st10(n) {
		var b = 1;
		for (var i = 1; i < n; i++) {
			b *= 10;
		}
		return b;
	}
	return (((a / st10(i + 2) | 0) * 10) + b) * st10(i + 1) + (a % st10(i + 1));
}
// Подсчёт контрольного числа
// Возврат INT

function checkSumm(s) {
	if (s < 10) {
		return "0" + s;
	}
	if (s < 100) {
		return s;
	}
	if (s === 100 || s === 101) {
		return "00";
	}
	if (s > 101) {
		return checkSumm(s % 101);
	}
}


function calcControlSummSnils(snils) {
	// Проверка суммы



	// Расчёт суммы
	var summ = 0;
	for (var i = 0; i < 9; i++) {
		summ += (9 - i) * parseInt(snils[i]);
	}
	console.log(summ);
	return checkSumm(summ);
}
// Перевод массива в строку


function arr2str(arr) {
	var str = "";
	for (var i = 0; i < arr.length; i++) {
		str += arr[i];
	}
	return str;
}
// Убирает из строки лишние символы - возврат массива цифр


function validateSnils(str) {
	var digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	var correctStr = [];
	for (var i = 0; i < str.length; i++) {
		if (str[i] in digits) {
			correctStr.push(parseInt(str[i]));
		}
	}
	//console.log(correctStr);
	return arr2str(correctStr);
}
// Проверка на совпадание контрольной суммы

function checkPass(pass) {
	// var reg = /^[\_\&\-+., A-Za-z0-9]+$/;
	var reg = /^[a-zA-Z0-9-_!?@#*&\$%\^\(\)\{\}\[\]:;'"<>?,.\/\+\|]{6,}$/g;
	if(reg.test(pass) == false){
		return false;
	} else {
		return true;
	}
}

function checkSnils(snils) {
	var snils = '' + snils.match(/\d+/g).join('');

	if ( !parseInt(snils) ) return false;

	// console.log('IN: ',parseInt(snils));
	if (parseInt(calcControlSummSnils(snils.substring(0, 9))) === parseInt(snils.substring(9, 11))) {
		return true;
	} else {
		return false;
	}
}
//

/*
function checkSnils(snils){
	if (!snils) {
		return true;
	}
	if (!/^\d{3}-\d{3}-\d{3} \d{2}$/.test(snils)) {
		console.log('s-1');
		return false;
	}
	var value = '' + snils.match(/\d+/g).join('');
	var number = parseInt(value.substring(0, 9));
	if (number <= parseInt('001001998')) {
		return true;
	}
	var checkSum = parseInt(value.slice(9), 10);
	var digit = value.split('');

	var sum = (digit[0] * 9 + digit[1] * 8 + digit[2] * 7 + digit[3] * 6 + digit[4] * 5 + digit[5] * 4 + digit[6] * 3 + digit[7] * 2 + digit[8] * 1);
	if (sum % 101 && (sum % 101 == checkSum || (sum % 101 == 100 && checkSum == 0))) {
	return true;
	} else {
		console.log('s-3');
	return false;
	}
}
*/
// AUTO HEIGHT

function setEqualHeight(columns) {
	var tallestcolumn = 0;
	columns.each(
		function () {
			currentHeight = $(this).height();
			if (currentHeight > tallestcolumn) {
				tallestcolumn = currentHeight;
			}
		}
	);
	columns.height(tallestcolumn);
}
$(document).ready(function () {
	setEqualHeight($("div.items .title"));
	setEqualHeight($("div.items .item"));
});


function registerToCurs(th) {
	var numberC = $(th).attr('data-curs');
	var comment = $(th).attr('data-comment');
	var nameCurs = $(th).attr('data-curs-name');
	var idCurs = parseInt($(th).attr('data-curs-id'));
	var idU = parseInt($(th).attr('data-user-id'));
	var FakePay = parseInt($(th).attr('fakepay')); /* Маркер фейковой оплаты */
	console.log($(th));
	console.log(idU);
	if(numberC == ''){
		$('.number_curs').addClass('er_send');
	}else{
		$('.number_curs').removeClass('er_send');
	}
	if(idCurs>0 && idU > 0){
		$(th).removeClass('er_send');
		$.ajax({
			dataType: 'json',
			url: '/ajax/reg_curs_teacher_nc.php',
			data: {idU: idU, idCurs: idCurs, nameCurs: nameCurs, comment: comment},
			type: 'post',
			dataFormat: 'json',
		}).done(function(responseData) {
			$.fancybox.close();


			console.log(responseData);
			var n = noty({
				theme: 'relax',
				text: responseData.status,
				killer: true,
				type: responseData.type,
				timeout: 10000, // delay for closing event. Set false for sticky notifications
				force: true, // adds notification to the beginning of queue when set to true
				closeWith: ['click'],
				animation: {
					open: {height: 'toggle'}, // jQuery animate function property object
					close: {height: 'toggle'}, // jQuery animate function property object
					easing: 'swing', // easing
					speed: 500 // opening & closing animation speed
				}
			});

			if ( responseData.DopStatus == 'error' ){
				/* нет ID пользователя. Запись не отработана */

				return;
			}

			$(th).addClass('registered');
			$(th).html('Отменить заявку');

			if (responseData.type=='success') {
				$('#inline-1 h2').html('Вы уверены, что хотите отменить регистрацию на курс?');
				$('.reg_teacher_curs_v2[data-curs-id="'+idCurs+'"]').addClass('registered').html('Отменить заявку');
				$(th).html('Отменить заявку');

				if ( FakePay ){
					// console.log('DO FAKE PAY for CURS ', idU, nameCurs, FakePay);

					var el = $(this),
						Content = $('<div>').css({'text-align':'center', width: 500, 'font-size' : '1.1em'})
							.append($('<h3>').html('Оплата обучения'))
							.append($('<p>').html('Для обучения на курсе "'+responseData.NAME+'" необходимо оплатать счет на сумму '+FakePay+' руб.<br>Если вы хотите подробнее ознакомиться с информацией по курсу, пожалуйста перейдите в его <a target="_blank" href="/curs/'+idCurs+'/#card">карточку</a>.<br>Вы можете оплатить счет банковской картой.<br><span style="font-size:12px"><b>*</b> Оплачивая обучение вы соглашаетесь с условиями <a href="/" target="_blank">Договора-Оферты</a></span>'))
							.append($('<button>',{class : 'btn btn-blue'}).text('Оплатить сейчас').click(function(e){

								fetch(
									'/ajax/fake-payment.php?command=makeorder&curs='+idCurs+'&name='+responseData.NAME+'&sum='+FakePay,
									{ method: 'POST' }
								)
									.then(response => response.json())
									.then((data) => {
										// console.log(data);
										$.fancybox.close();
										if ( data.res == 'OK' ){

											window.location.replace(data.data.URL);
										} else{
											if ( data.err ) alert(data.err);
										}
										// window.location.replace('<?=$res->formUrl?>');

									})

							}))
							.append($('<button>',{class : 'btn btn-red'}).css({'margin-left': '20px','font-family':'PT Sans, sans-serif'}).text('Оплатить позже').click(function(e){$.fancybox.close();}));

					$.fancybox({
						content: Content,
						afterClose: function (){
						},
						helpers: {
							overlay: {
								locked: false
							}
						}
					});

					return false;
				}
			} else {
				$('#inline-1 h2').html('Вы уверены, что хотите записаться на курс?');
				$('.reg_teacher_curs_v2[data-curs-id="'+idCurs+'"]').removeClass('registered').html('Записаться');
				$(th).removeClass('registered');
				$(th).html('Записаться');
			}
		}).fail(function() {
			console.log('Failed');
		});
	} else {
		var n = noty({
			theme: 'relax',
			text: 'Для записи на курс необходимо войти или зарегистрироваться на портале',
			killer: true,
			type: 'error',
			timeout: 10000, // delay for closing event. Set false for sticky notifications
			force: true, // adds notification to the beginning of queue when set to true
			closeWith: ['click'],
			animation: {
				open: {height: 'toggle'}, // jQuery animate function property object
				close: {height: 'toggle'}, // jQuery animate function property object
				easing: 'swing', // easing
				speed: 500 // opening & closing animation speed
			}
		});
		$(th).addClass('er_send');
	}

};

function getXApiToken()
{
	$.get("/ajax/projects_auth.php?get=1", function (result) {
		result = JSON.parse(result) || false;
		if( result != false && result[0] && result[1])
			$(".tokenBtn").show().find("a").prop("href", "https://projects.mioo.ru/smartRedirect/?ID="+ result[0] +"&authToken="+ result[1]);
	})
}

function getXApiEditStatus(uId)
{
	$.get("/ajax/projects_check.php", function (result) {
		result = result || false;
		if( result === 'Y' )
		{
			let text = 'Редактировать информацию о гостеприимной школе';
			$('#_projects_votes_edit').text(text);
			$('#_projects_votes_edit').attr('href', '/cabinet/director/projects_edit_vote_result.php?USER_ID='+ uId);
		}
	})
}


$(document).ready(function () {
	$(".openFancyBox").fancybox({
		fitToView	: false,
		width		: '500',
		height		: '270',
		autoSize	: false,
		closeClick	: false,
		openEffect	: 'none',
		closeEffect	: 'none'
	});


	$("header .btn-reg").click(function () {
		$("#pop-reg, .white-bg").fadeIn();
		$("body").addClass("body-over");
	});
	$(".pop .close").click(function () {
		$(".pop, .white-bg").fadeOut();
		$("body").removeClass("body-over");
	});

	/*  problem list */
	$('.row-list-problem a.list').click(function() {
		$(".row-list-problem a.list").removeClass("active");
		$(".block-result").removeClass("visible");
		var list_map = $(this).attr("id");
		$(this).addClass("active");
		$('#r'+list_map).addClass("visible");
	});

	$('body').on('click', '.send_support', function(){
		$('#email_user').removeClass('er_send');
		$('.send_support_text').removeClass('er_send');

		var email = $('#email_user').val();
		var text = $('.send_support_text').val();
		var type = $('.send_support_type .ik_select_link_text').text();

		var errors = false;
		var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

		if(reg.test(email) == false){
			errors = true;
			$('#email_user').addClass('er_send')
		}
		if(text == ''){
			$('.send_support_text').addClass('er_send');
			errors = true;
		}


		if(!errors){

			$('.send_support_ajax').show();
			$(".send_support_ajax_ok").load("/ajax/support.php", {text: text, type: type, email: email}, function(){
				setTimeout(function(){
					$('.send_support_ajax').hide();
					$('.send_support_text').val('');
				}, 3000);
			});
		}
	});

	$('body').on('click', '#sendAnwerMess', function(){
		$('#ajaxLoad').show();
		$('#errorS').html('');
		var text = $('#textAnswer').val();
		if(text.length <= 0){
			$('#errorS').html('Введите сообщение!');
		}else{
			$.ajax({
				url: "/ajax/answer_mes_send_to_admin.php",
				data: $('#answerForm').serialize(),
				dataType: 'json',
				type: 'post',
				success:function(data){
					if(data.RES == "OK"){
						$('#textAnswer').val('');
						location.reload(true);
					}
					$('#ajaxLoad').hide()
				},
			});
		}
	});

	$('body').on('change', '#categoryL', function(){
		var idC = $('#categoryL :selected').attr('value');
		var yearC = $('#categoryL :selected').attr('yearn');
		$(".list_cc").load("/ajax/reg_curs_list.php", {idC: idC, yearC: yearC}, function(){
			$('select#cursList').ikSelect({
				ddFullWidth: false,
				autoWidth: false,
				filter: true,
				nothingFoundText: 'Nothing found'
			});
		});
	});

	//регистрация учителя на курсы
	$('body').on('click', '.reg_teacher_curs', function(){
		var numberC = $('#cursList :selected').text();
		var comment = $('.comment_curs').val();
		var nameCurs = $('#cursList :selected').text();
		var idCurs = parseInt($('#cursList :selected').val());
		var idU = parseInt($('.hide_sp').attr('data-id'));


		if(numberC == ''){
			$('.number_curs').addClass('er_send');
		}else{
			$('.number_curs').removeClass('er_send');
		}
		if(idCurs>0 && idU > 0){
			//$('.reg_teacher_curs').hide();
			$('#cursList').parent('.ik_select').removeClass('er_send');
			$(".ajax_reg").load("/ajax/reg_curs_teacher.php", {idU: idU, idCurs: idCurs, nameCurs: nameCurs, comment: comment}, function(){
				setTimeout(function(){
					//$('.ajax_ok').remove();
					//$('.number_curs').val('');
					//$('.comment_curs').val('');
					//$('.list_r_curs').hide();
					//location.reload()
				}, 3000);
			});
		}else{
			$('#cursList').parent('.ik_select').addClass('er_send');
		}
		/*if(comment == ''){
			$('.comment_curs').addClass('er_send');
		}else{
			$('.comment_curs').removeClass('er_send');
		}*/
		/*if(numberC != '' && comment != ''){*/

	});




	$('.showListCurs').click(function(){
		$('.list_r_curs').show();
	});
	$('.showListCategory').click(function(){
		$('.list_r_category').show();
		$('.hideAllC').show();
	});
	$('.hideAllC').click(function(){
		$('.list_r_curs, .list_r_category').hide();
		$('.hideAllC').hide();
	});

	$('body').on('click', '.list_r_curs .ik_select_option_label', function(){
		var catcod = $('#cursList :selected').attr('catcode');
		var shif = $('#cursList :selected').attr('shifr');
		$('.number_curs').val(catcod+'-'+shif);
	});

	//обновление логина учителя
	$('.update_login').click(function(){
		$('.update_login_text, .update_login_b').show();
	});

	$('.update_login_but').click(function(){
		var login = $('.update_login_text').val();
		var idU = $(this).attr('data-id');
		if(login == ''){
			$('.update_login_text').addClass('er_send');
		}else{
			$('.update_login_text').removeClass('er_send');
			$(".update_login_ajax").load("/ajax/update_login.php", {idU: idU, login: login}, function(){
				$('.update_login_ajax').show();
				setTimeout(function(){
					$('.update_login_ajax').hide();
				}, 3000);
			});
		}
	});

	//обновление логина учителя
	$('.update_pas').click(function(){
		$('.update_pas_text, .update_pas_b').show();
	});

	$('.update_pas_but').click(function(){
		var pas = $('.update_pas_text').val();
		var idU = $(this).attr('data-id');
		if(pas == ''){
			$('.update_pas_text').addClass('er_send');
		}else{
			$('.update_pas_text').removeClass('er_send');
			$(".update_pas_ajax").load("/ajax/update_pas.php", {idU: idU, pas: pas}, function(){
				$('.update_pas_ajax').show();
				setTimeout(function(){
					$('.update_pas_ajax').hide();
				}, 3000);
			});
		}
	});

	//обновление персональных данных
	$('.update_info_user').click(function(){
		var idU = $(this).attr('data-id');
		var LAST_NAME = $('[data-code="LAST_NAME"]').val();
		var PERSONAL_PHONE = $('[data-code="PERSONAL_PHONE"]').val();
		var NAME = $('[data-code="NAME"]').val();
		var SECOND_NAME = $('[data-code="SECOND_NAME"]').val();
		var UF_U_DATE = $('[data-code="UF_U_DATE"]').val();
		var UF_U_OBR = $('[data-code="UF_U_OBR"]').val();
		var UF_U_SCHOOL = $('[data-code="UF_U_SCHOOL"]').val();
		var UF_U_YEAR = $('[data-code="UF_U_YEAR"]').val();
		var UF_U_DIPLOM = $('[data-code="UF_U_DIPLOM"]').val();
		var UF_U_CV = $('[data-code="UF_U_CV"]').val();
		var UF_U_TYPE = $('[data-code="UF_U_TYPE"]').val();
		var UF_U_NUMBER = $('[data-code="UF_U_NUMBER"]').val();
		var UF_U_NAME_OBR = $('[data-code="UF_U_NAME_OBR"]').val();
		var UF_U_OKRUG = $('[data-code="UF_U_OKRUG"]').val();
		var UF_U_WORK = $('[data-code="UF_U_WORK"]').val();
		var UF_U_PRED = $('[data-code="UF_U_PRED"]').val();
		var UF_U_WORK_A = $('[data-code="UF_U_WORK_A"]').val();
		var UF_U_WORK_SEC = $('[data-code="UF_U_WORK_SEC"]').val();
		var UF_U_EXP = $('[data-code="UF_U_EXP"]').val();
		var UF_U_YEAR_ALL = $('[data-code="UF_U_YEAR_ALL"]').val();
		var UF_U_CATP = $('[data-code="UF_U_CATP"]').val();
		var UF_U_YEAR_CAT = $('[data-code="UF_U_YEAR_CAT"]').val();
		$(".ajax_info_user").load("/ajax/update_info_user.php", {idU:idU, LAST_NAME: LAST_NAME, PERSONAL_PHONE: PERSONAL_PHONE, SECOND_NAME: SECOND_NAME, UF_U_DATE: UF_U_DATE, UF_U_OBR: UF_U_OBR, UF_U_SCHOOL: UF_U_SCHOOL, UF_U_YEAR: UF_U_YEAR, UF_U_DIPLOM: UF_U_DIPLOM, UF_U_CV: UF_U_CV, UF_U_TYPE: UF_U_TYPE, UF_U_NUMBER: UF_U_NUMBER, UF_U_NAME_OBR: UF_U_NAME_OBR, UF_U_OKRUG: UF_U_OKRUG, UF_U_WORK: UF_U_WORK, UF_U_PRED: UF_U_PRED, UF_U_WORK_A: UF_U_WORK_A, UF_U_WORK_SEC: UF_U_WORK_SEC, UF_U_EXP: UF_U_EXP, UF_U_YEAR_ALL: UF_U_YEAR_ALL, UF_U_CATP: UF_U_CATP, UF_U_YEAR_CAT: UF_U_YEAR_CAT, NAME: NAME}, function(){
			$('.ajax_info_user').show();
			setTimeout(function(){
				$('.ajax_info_user').hide();
			}, 3000);
		});
	});
	//обновление персональных данных
	$('.update_info_admin').click(function(){
		var dataAr = $('#AdminFields').serialize();
		$(".ajax_info_user").load("/ajax/update_info_admin.php", dataAr, function(){
			$('.ajax_info_user').show();
			// setTimeout(function(){
			// $('.ajax_info_user').hide();
			// }, 3000);
		});
	});

	$('.index_a span,.index_a h1').click(function(){
		document.location.href = "/";
	});

	$('.answer_mes').click(function(){
		var id = $('.id_mes').val();
		var answer = $('.text_ans').val();
		if(answer == ''){
			$('.text_ans').addClass('er_send');
		}else{
			$('.text_ans').removeClass('er_send');
			$(".ans_p").load("/ajax/answer_mes.php", {id: id, answer: answer}, function(){
				$('.ans_p').show();
				setTimeout(function(){
					$('.ans_p').hide();
				}, 3000);
			});
		}
	});

	$('.answer_mes_pravo').click(function(e){
		e.preventDefault();
		var id = $('.id_mes').val();
		var answer = $('#textAnswer').val();
		data = $('#pravo_mes_form').serialize();
		if(answer == ''){
			$('.text_ans').addClass('er_send');
		}else{
			$('.text_ans').removeClass('er_send');
			$.post("/ajax/answer_mes_pravo.php", data, function(mes){
				$('.ans_p').html(mes);
				$('.ans_p').show();
				setTimeout(function(){
					$('.ans_p').hide();
				}, 3000);
			});
		}
	});

	$('body').on('change','[name=sendTo]', function(){
		var ValT = $(this).val();
		if(ValT == "one"){
			$('#GrId').removeAttr('disabled')
		}else{
			$('#GrId').attr('disabled','disabled')
		}
	});
	$('.send_mes_to_gr').click(function(){
		var form = $('#GroupMess')[0];
		var formData = new FormData(form);
		// console.log('formData: ',formData); return;
		$('#errorS').hide();
		$('#errorS').html('');
		var posE = 0;
		var ErrS = new Array();
		var TextT = $('textarea[name=textMess]').val();
		var radioT = $('[name=sendTo]:checked').val();
		if(TextT.length < 3){
			ErrS[posE] = "Введите текст сообщения!";posE++;
		}
		if(radioT){
			if(radioT == "one"){
				var GrId = $('#GrId option:selected').val();
				if(!GrId){
					ErrS[posE] = "Выберите группу!";posE++;
				}
			}else if(radioT == "one_person"){
				var GrId = $('#UserId option:selected').val();
				if(!GrId){
					ErrS[posE] = "Выберите пользователя!";posE++;
				}
			}else{}
		}else{
			ErrS[posE] = "Выберите кому отправляете сообщение!";posE++;
		}
		var dataF = $('#GroupMess').serialize();
		if(ErrS.length>0){
			console.log(ErrS);
			$('#errorS').show();
			for(var i=0; i<ErrS.length; i++){
				$('#errorS').append("<p>"+ErrS[i]+"</p>");
			}
		}else{
			$('#ajaxLoad').show();
			$.ajax({
				url: "/ajax/answer_mes_send_to_groups.php",
				data: formData,
				type: "POST",
				enctype: 'multipart/form-data',
				processData: false,
				contentType: false,
				success:function(data, textStatus, jqXHR){
					$('.ans_p_u').show();
					$('.ans_p_u').html(data);
					$('#ajaxLoad').hide();
					document.getElementById("GroupMess").reset()
					setTimeout(function(){
						$('.ans_p_u').hide();
					}, 3000);
				},
			});
		}
	});

	$('.send_mes_u').click(function(){
		var type = $('.type_uu').val();
		var id = $('.type_uu_id').val();
		var q = $('.b-form-mess-uu .ik_select_link_text').text();
		var mes = $('.mes-uu').val();
		if(mes == ''){
			$('.mes-uu').addClass('er_send');
		}else{
			$('.mes-uu').removeClass('er_send');
			$(".ans_p_u").load("/ajax/answer_mes_send.php", {type: type, q: q, mes: mes, id: id}, function(){
				$('.ans_p_u').show();
				setTimeout(function(){
					$('.ans_p_u').hide();
				}, 3000);
			});
		}
	});

	$('.smenit_y').click(function(){
		var url = $('.b-academ-year').attr('data-url');
		var year = $('.b-academ-year .ik_select_link_text').text();
		var yearId = $('#yearList :selected').val();
		insertParam('year',yearId);
	});

	$('.stat_sogl').click(function(){
		var id = $(this).attr('data-id');
		$(this).load("/ajax/update_sogl.php", {id: id}, function(){
			$(this).removeClass('stat_sogl');
			location.reload();
		});
	});
	$('.stat_otm').click(function(){
		var id = $(this).attr('data-id');
		$(this).load("/ajax/update_sogl_otm.php", {id: id}, function(){
			$(this).removeClass('stat_otm');
			location.reload();
		});
	});
	$('.podt_stat').click(function(){
		var id = $(this).attr('data-id');
		$('.answer_dog').load("/ajax/update_dog_p.php", {id: id});
	});

	$('body').on('click', '.more_curs', function(){
		var count = $(this).attr('data-count');
		$('.info_all_c').load("/ajax/info_all_c.php", {count: count}, function(){
			var i = count*1+10;
			$('.more_curs').attr('data-count', i)
		});
	});

	$('body').on('click', '.show_c_admin', function(){
		$('.list_cat_admin').show();
	});

	$('body').on('click', '.show_p_admin', function(){
		$('.list_pod_admin').show();
	});

	$('body').on('click', '.hide_admin_c', function(){
		$('.list_cat_admin').hide();
		$('.help_filtr').attr('data-id-cat', '');
	});
	$('body').on('click', '.hide_admin_p', function(){
		$('.list_pod_admin').hide();
		$('.help_filtr').attr('data-id-pod', '');
	});
	$('body').on('click', '.reset_admin_f', function(){
		$('.list_pod_admin, .list_cat_admin').hide();
		$('.help_filtr').attr('data-id-pod', '');
		$('.help_filtr').attr('data-id-cat', '');
	});


	$('body').on('click', '.go_admin_f', function(){
		var cat = $('.help_filtr').attr('data-id-cat');
		var pod = $('.help_filtr').attr('data-id-pod');
		$('.ajax_admin_caf').load("/ajax/ajax_admin_caf.php", {cat: cat, pod: pod});
	});

	$('body').on('click', '.list_cat_admin li', function(){
		var id = $(this).attr('data-value');
		$('.help_filtr').attr('data-id-cat', id);
	});
	$('body').on('click', '.list_pod_admin li', function(){
		var id = $(this).attr('data-value');
		$('.help_filtr').attr('data-id-pod', id);
	});

	$('body').on('click', '.more_ancets', function(){
		var count = $(this).attr('data-count');
		$('.m_ancets').load("/ajax/more_ancets.php", {count: count}, function(){
			var i = count*1+10;
			$('.more_ancets').attr('data-count', i)
		});
	});

	$('body').on('click', '.table_jornal', function(){
		var type = 'jornal';
		$('.m_ancets').load("/ajax/type_ancets.php", {type: type});
	});
	$('body').on('click', '.table_mail', function(){
		var type = 'mail';
		$('.m_ancets').load("/ajax/type_ancets.php", {type: type});
	});
	$('body').on('click', '.table_print', function(){
		var type = 'print';
		$('.m_ancets').load("/ajax/type_ancets.php", {type: type});
	});


	/**
	 работаю с анкетами
	 */
	//открываем списки
	$('body').on('click', '.sel_caf_okr', function(){
		$('.caf_okr').show();
	});
	$('body').on('click', '.sel_caf_cat', function(){
		$('.caf_cat').show();
	});
	$('body').on('click', '.sel_caf_curs', function(){
		$('.caf_curs').show();
	});
	$('body').on('click', '.sel_caf_f', function(){
		$('.caf_f').show();
	});
	//скрываем списки
	$('body').on('click', '.hide_caf_okr', function(){
		$('.caf_okr').hide();
		$('.help_filtr_a').attr('data-id-okr', '');
	});
	$('body').on('click', '.hide_caf_cat', function(){
		$('.caf_cat').hide();
		$('.help_filtr_a').attr('data-id-cat', '');
	});
	$('body').on('click', '.hide_caf_curs', function(){
		$('#cursFilt option:selected').removeAttr('selected');
		$('#cursFilt').parents('.ik_select').find('.ik_select_link_text').text('');
	});
	$('body').on('click', '.hide_caf_f', function(){
		$('#familia option:selected').removeAttr('selected');
		$('#familia').parents('.ik_select').find('.ik_select_link_text').text('');
	});

	$('body').on('click', '.hide_caf_s', function(){
		$('#school option:selected').removeAttr('selected');
		$('#school').parents('.ik_select').find('.ik_select_link_text').text('');
	});

	$('body').on('click', '.hide_num_ou', function(){
		$('#num_ou option:selected').removeAttr('selected');
		$('#num_ou').parents('.ik_select').find('.ik_select_link_text').text('');
	});
	//записываем атрибуты
	$('body').on('click', '.caf_okr li', function(){
		var id = $(this).attr('data-value');
		$('.help_filtr_a').attr('data-id-okr', id);
	});
	$('body').on('click', '.caf_cat li', function(){
		var id = $(this).attr('data-value');
		$('.help_filtr_a').attr('data-id-cat', id);
	});
	$('body').on('click', '.caf_curs li', function(){
		var id = $(this).attr('data-value');
		$('.help_filtr_a').attr('data-id-curs', id);
		var text = $(this).text();
		$('.pole_okr').val(text);
	});
	$('body').on('click', '.caf_f li', function(){
		var id = $(this).attr('data-value');
		$('.help_filtr_a').attr('data-id-f', id);
		var text = $(this).text();
		$('.pole_f').val(text);
	});
	//общая очистка
	$('body').on('click', '.reset_ank', function(){
		$('.help_filtr_a').attr('data-id-okr', '');
		$('.help_filtr_a').attr('data-id-cat', '');
		$('.help_filtr_a').attr('data-id-curs', '');
		$('.pole_okr').val('');
		$('.help_filtr_a').attr('data-id-f', '');
		$('.pole_f').val('');

		$('#cursFilt option:selected').removeAttr('selected');
		$('#cursFilt').parents('.ik_select').find('.ik_select_link_text').text('');
		$('#familia option:selected').removeAttr('selected');
		$('#familia').parents('.ik_select').find('.ik_select_link_text').text('');

		$('.caf_okr, .caf_cat, .caf_curs, .caf_f').hide();
	});

	//посылаем фильтр
	$('body').on('click', '.go_ank,.reset_ank', function(){
		var user = $('#currentUser').val();
		var year = $('#year').val();
		var okr = $('.help_filtr_a').attr('data-id-okr');
		var cat = $('.help_filtr_a').attr('data-id-cat');
		var curs = $('#cursFilt :selected').val();
		var ouID = $('#num_ou :selected').val();
		var work = $('#work :selected').val();

		var f = $('#familia :selected').val();
		var s = $('#school :selected').val();
		$('.anketa_block').load("/ajax/ajax_anceta.php", {work: work, okr: okr, cat: cat, s: s, curs: curs, f: f,user: user,year: year, ouID: ouID});
	});

	$('.add_v').click(function(){
		var html = '<tr>'+$('.vip1').html()+'</tr><tr>' + $('.vip2').html() +'</tr>' + $('.vip3').html() +'</tr>';
		$(this).parent().parent().before(html);
	});

	$('.show_repas_u').click(function(){
		$('.not_sh_pas').show();
	});

	$('.send_repas_u').click(function(){
		var iden = $('.repas_u').val();
		if(iden == ''){
			$('.repas_u').addClass('er_send');
		}else{
			$('.repas_u').removeClass('er_send');
			$('.answer_repas').load("/ajax/repas.php", {iden: iden});
		}

	});

	$('body').on('click', '.ik_select_list_inner li', function(){
		var iden = $(this).attr('data-value');
		if (iden != "t") {
			$('.superadmin_res').load("/ajax/superadmin_res.php", {iden: iden});
		}
	});

	$('body').on('click', '.superadmin_search', function(){
		var iden = $('.superadmin_t .ik_select_link_text').text();
		var fio = $('.superadmin_name').val();
		if(fio == ''){
			$('.superadmin_name').addClass('er_send');
		}else{
			$('.superadmin_name').removeClass('er_send');
			$('.superadmin_res').load("/ajax/superadmin_search.php", {iden: iden, fio: fio});
		}
	});

	$('body').on('click', '.superadmin_sb', function(){
		var iden = $('.superadmin_t .ik_select_link_text').text();
		var fio = '';
		$('.superadmin_res').load("/ajax/superadmin_search.php", {iden: iden, fio: fio});
	});

});


function loadPopup(){
	//loads popup only if it is disabled
	if($("#bgPopup").data("state")==0){
		$("#bgPopup").css({
			"opacity": "0.7"
		});
		$("#bgPopup").fadeIn("medium");
		$("#Popup").fadeIn("medium");
		$("#bgPopup").data("state",1);
	}
}

function disablePopup(){
	if ($("#bgPopup").data("state")==1){
		$("#bgPopup").fadeOut("medium");
		$("#Popup").fadeOut("medium");
		$("#bgPopup").data("state",0);
	}
}

function centerPopup(){
	var winw = $(window).width();
	var winh = $(window).height();
	var popw = $('#Popup').width();
	var poph = $('#Popup').height();
	$("#Popup").css({
		"position" : "absolute",
		"top" : winh/2-poph/2,
		"left" : winw/2-popw/2
	});
	//IE6
	$("#bgPopup").css({
		"height": winh
	});
}

$(document).ready(function() {
	$("#bgPopup").data("state",0);
	$("#myButton").click(function(){
		centerPopup();
		loadPopup();
	});

	$("#popupClose").click(function(){
		disablePopup();
	});
	$(document).keypress(function(e){
		if(e.keyCode==27) {
			disablePopup();
		}
	});

	$.datepicker.regional['ru'] = {
		closeText: 'Закрыть',
		prevText: '&#x3c;Пред',
		nextText: 'След&#x3e;',
		currentText: 'Сегодня',
		monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
			'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
		monthNamesShort: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
			'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
		dayNames: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
		dayNamesShort: ['вск', 'пнд', 'втр', 'срд', 'чтв', 'птн', 'сбт'],
		dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
		weekHeader: 'Нед',
		dateFormat: 'dd.mm.yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: true,
		yearSuffix: ''
	};

	$.datepicker.setDefaults($.datepicker.regional['ru']);
});



//Recenter the popup on resize - Thanks @Dan Harvey [http://www.danharvey.com.au/]
$(window).resize(function() {
	centerPopup();
});

