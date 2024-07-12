
	
$(document).ready(function(e) {
	
	$(".header-eye").click(function(e) {
		
		if($(".lowVision").is(":visible")){
			$(".lowVision").hide();
			unsetStyles();
		}
		else if($(".lowVision").is(":hidden")){
			$(".lowVision").show();
			setBodyStyle('setStyle1');
			setBodyFontSize('setNormalFont');
			setBodyFontType('font1');
		}
		
		
		
		e.preventDefault();
        e.stopPropagation();
		return false;
	});
	if($.cookie('bodyStyle'))
		setBodyStyle($.cookie('bodyStyle'))
	if($.cookie('fontSize'))
		setBodyFontSize($.cookie('fontSize'))
	if($.cookie('bodyFont'))
		setBodyFontType($.cookie('bodyFont'))
		
				 
    $("body").delegate(".lowVision .a-fontsize a","click", function (){
		setBodyFontSize($(this).attr("data-set"));
		
		if(!$.cookie('bodyStyle'))
				 setBodyStyle('setStyle1')
			else if($.cookie('bodyStyle'))
				 setBodyStyle($.cookie('bodyStyle'));
		return false;
				 
	});
	
	$("body").delegate(".lowVision .a-colors a","click", function (){
		setBodyStyle($(this).attr("data-set"));
		
		if(!$.cookie('fontSize'))
				 setBodyFontSize('setNormalFont')
			else if($.cookie('fontSize'))
				 setBodyFontSize($.cookie('fontSize'));
		return false;
	});
	
	$("body").delegate(".lowVision .a-font select","change", function (){
		setBodyFontType($(this).val());
		
		if(!$.cookie('bodyFont'))
				 setBodyFontType('font1')
			else if($.cookie('bodyFont'))
				 setBodyFontType($.cookie('bodyFont'))
				 
	});
	
	
	$("body").delegate("#normalversion","click", function (){
		unsetStyles();
		
	});
	
});

function unsetStyles(){
	removeBodyClass(1);
	removeBodyClass(2);
	removeBodyClass(3);
	$.removeCookie('bodyStyle', { path: '/' });
	$.removeCookie('fontSize', { path: '/' });
	$.removeCookie('bodyFont', { path: '/' });
	$(".lowVision").hide();
	$(".header-eye").show();
}

function removeBodyClass(ID){
	if(ID == 1) {
		$("body").removeClass("setSmallFont setNormalFont setBigFont");
	}
	
	if(ID == 2) {
		$("body").removeClass("setStyle1 setStyle2 setStyle3");
	}
	
	if(ID == 3) {
		$("body").removeClass("font1 font2 font3");
	}
}

function setBodyFontSize(font){
	$(".lowVision").show();
	$(".header-eye").hide();
	removeBodyClass(1);
		$(".lowVision a").removeClass("sizeActive");
		$(".lowVision").find("a[data-set='" + font + "']").addClass("sizeActive");
		$.cookie('fontSize', font, { path: '/' });
			$("body").addClass(font);
			
			
}

function setBodyFontType(font){
	
	$(".lowVision").show();
	$(".header-eye").hide();
	removeBodyClass(3);
		$(".lowVision option").removeAttr("selected");
		$(".lowVision").find("option[value='" + font + "']").attr("selected","selected");
		$.cookie('bodyFont', font, { path: '/' });
			$("body").addClass(font);
			
			
}


function setBodyStyle(style){
	$(".lowVision").show();
	$(".header-eye").hide();
	removeBodyClass(2);
		$(".lowVision a").removeClass("bodyActive");
		$(".lowVision").find("a[data-set='" + style + "']").addClass("bodyActive");
		$.cookie('bodyStyle', style, { path: '/' });
			$("body").addClass(style);
			
			
}
