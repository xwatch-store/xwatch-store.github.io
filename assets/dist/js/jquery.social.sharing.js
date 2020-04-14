var share = {
	showPopup : function(url){
		var width = 600;
		var height = 400;
		var poswidth = window.screen.width / 2 - width / 2;
		var posheight = window.screen.height / 2 - height / 2;
		window.open(url, '', 'menubar=no,toolbar=no,resizable=no,scrollbars=yes,height=' + height + ',width=' + width + ',left=' + poswidth + ',top=' + posheight);
	}
}

var pathname_split = location.pathname.split("/");
pathname_split.length = pathname_split.length-1;
if(pathname_split.indexOf("legal") >= 0){//if subfolder
	pathname_split.length = pathname_split.length-1;
}

var url = location.origin+pathname_split.join("/")+"/order.php?prod="+$.cookie('PRODUCT')+"&lang="+$.cookie('PAGE_LANG')+"&net="+$.cookie('net');
var title = $('title').text();
var description = $('meta[name="description"]').attr('content');
$('.social-btn-container-facebook').on('click',function(){
	share.showPopup('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(url));
});

$('.social-btn-container-twitter').on('click',function(){
	share.showPopup('https://twitter.com/intent/tweet/?text='+description+'&url='+url+'&via='+title);
});