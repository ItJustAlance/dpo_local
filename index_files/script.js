$(function() {
	$('.index_curs').change(function(){
		var id = $(this).val();
		$(".curs_ajax").load("/ajax/load_list_curs_index.php", {id: id});
	});
});