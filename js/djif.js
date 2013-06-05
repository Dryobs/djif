
/************************************
 * PREVIEW
 ************************************/
var triggered = 0;
function initTrigger() {
	triggered = 0;
}
function setTrigger() {
	triggered++;
}
function getTrigger() {
	return triggered;
}

function setPreview(input, html) {

	if (input.parent().find('.preview').length) {
		input.parent().find('.preview').html(html);
	} else {
		input.animate({width: "-=60px"}, 0, 'linear', function(){
			input.parent().append( '<div class="preview">'+html+'</div>' );
		});
	}
}

function preview(input) {
	if (input.val()) {
		if (!getTrigger()) {
			setTrigger();
			if (input.parent().hasClass('sound_group')) {
				var loader = '<img src="/images/loader_blue.gif" />';
				var component = 'audio';
			} else {
				var loader = '<img src="/images/loader_orange.gif" />';
				var component = 'gif';
			}
			setPreview( input, loader);
			$.ajax({
				type: "POST",
				url: "/ajax/media",
				data: { url: input.val(),
						component: component,
						width: 50,
						height: 50,
						ajax : true	}
			}).done(function( output ) {
				setPreview( input, output);
			});
		}
		initTrigger();
	} else {
		input.removeAttr('style');
		input.parent().find('.preview').remove();
	}
}


/************************************
 * YOUTUBE
 ************************************/
function insert_youtube (hash, yt_hash, width=300, autoplay=0) {
	
		players[hash] = new YT.Player('_'+hash+'_speaker', {
			width: width,
			height: '349',
			playerVars: {
							wmode: "opaque"
					},
			events: {
				'onReady': function () {
					players[hash].cueVideoById(yt_hash);
				},
				'onStateChange': function (event) {
					switch (event.data) {
						case 0:
						case 2:
						case 5:
							disableDjif(hash);
						break;
						case 1:
							enableDjif(hash);
						break;
					}
				}
			}
		});
	
}

function youtube_play(hash) {
	if( $('#_'+hash+'_djif').attr('data-hasplayed') == 'true') {
		players[hash].playVideo();
	} else {
		$('#_'+hash+'_djif').attr('data-hasplayed', 'true');
	}
	players[hash].seekTo(0);
}
function youtube_stop(hash) {
	players[hash].stopVideo();
}


/************************************
 * DJIF SWITCH
 ************************************/
function disableDjif(hash) {
	$('#_'+hash+'_djif .mask').removeClass('animated');
	document.querySelector('#_'+hash+'_screen .gif').style.display = 'none';
	document.querySelector('#_'+hash+'_screen .stopped').style.display = '';
	$('#_'+hash+'_djif').attr('data-actif', 'false');
}

function enableDjif(hash) {
	$('#_'+hash+'_djif .mask').addClass('animated');
	document.querySelector('#_'+hash+'_screen .stopped').style.display = 'none';
	document.querySelector('#_'+hash+'_screen .gif').style.display = '';
	$('#_'+hash+'_djif').attr('data-actif', 'true');
}

function djif_switch(hash) {
	switch(document.getElementById('_'+hash+'_djif').getAttribute('data-actif')) {
		case 'true':
			disableDjif(hash);
			audio_stop[hash]();
			break;
		case 'false':
			var djifs = document.querySelectorAll('.djif[data-actif="true"]');
			for (var i = 0; i < djifs.length; i++) {
				djifs[i].click();
			}
			audio_play[hash]();
			enableDjif(hash);
			break;
		case 'ignore':
			document.getElementById('_'+hash+'_djif').setAttribute('data-actif', 'true');
			break;
	}
}

//var onYouTubeIframeAPIReady;
$(function(){
	
	/************************************
	 * "NEW" FORM
	 ************************************/
	$('form#new_djif').submit(function() {
		var gif = $('#gifSource').val();
		var sound = $('#soundSource').val();
		if (gif == '' || sound == '') {
			$('#tooltip').fadeIn(100);
			return false;
		} else {
			$.ajax({
				type: "POST",
				url: "/ajax/new",
				data: { gif_url: $('#gifSource').val(),
						audio_url: $('#soundSource').val(),
						ajax : true	}
			}).done(function( output ) {
				$('#action').append( output );
				$('#tinyurl').hide(0);
				$('#screen').hide(0);
				$('#speaker').hide(0);
				$('.preview').remove();
				$('#mozaique').remove();
				$('form#new_djif').fadeOut(200, function() {
				$('form#new_djif').remove();
				$('#tinyurl').fadeIn(200);
				$('#screen').fadeIn(200);
				$('#speaker').fadeIn(200);
				$("#tinyurl input").select();
				});
			});
			return false;
		}
	});
	
	$('form#new_djif input').each(function(i,elt) {

		var element = $(elt);
		element.data('val',  element.val() ); // save value
		element.change(function() { // works when input will be blured and the value was changed
	        if( element.val() != element.data('val') ){ // check if value changed
	        	element.data('val',  element.val() ); // save new value
	        	preview(element);
	        }
	    });
		element.keyup(function() { // works immediately when user press button inside of the input
	        if( element.val() != element.data('val') ){ // check if value changed
	        	element.data('val',  element.val() ); // save new value
	        	preview(element);
	        }
	    });
	});
	
	$('#mozaique').jMosaic({
        items_type: ".djif", // Type of elements in the selector (Default: img);
		 min_row_height: 100, // Minimal row height (Default: 150);
		 margin: 3, // Space between elements (Default: 0);
		 is_first_big: false // First row - largest (Default: false);
	});
	
	/*$('#mozaique .djif').each(function(i,elt){
		$(elt).click(function(){
		    $('.jMosaic-item.resized').each(function(i2,elt2){
		        $(elt2).removeClass('resized')
		            .animate({
		                'width': $(elt2).attr('data-orig-width'),
		                'height': $(elt2).attr('data-orig-height')
		            });
		    });
		    $(elt).attr('data-orig-width', $(elt).css('width'));
		    $(elt).attr('data-orig-height', $(elt).css('height'));
		    $(elt).addClass('resized').animate({'width': '+=100', 'height': '+=50'});
		});
	});*/
	
	/************************************
	 * DJIFS LOAD
	 ************************************/
	
	var shareMsg = "Hey%20!%20Check%20this%20out%20";
	$('.djif').each(function(i, elt){
		var hash= $(elt).attr('data-hash');
		var url = 'http://djif.net/'+hash;
		
		$(elt).prepend('<div class="mask mask-1"></div>'+
						'<div class="mask mask-2"></div>'+
						'<div class="mask mask-3">'+
							'<div class="social-link">'+
								'<a href="http://twitter.com/share?text='+shareMsg+url+'">'+
									'<img src="/images/twitter.png" />'+
								'</a>'+
								'<a href="https://plus.google.com/share?url='+url+'">'+
									'<img src="/images/googleplus.png" />'+
								'</a>'+
								'<a href="http://www.facebook.com/sharer.php?u='+url+'">'+
									'<img src="/images/facebook.png" />'+
								'</a>'+
							'</div>'+
							'<a href="/edit/'+hash+'">'+
								'<span class="iconic wrench"></span>Edit this <span class="edit_djif">Djif</span>'+
							'</a>'+
						'</div>');
		
		$(elt).click(function(event){
			gif_load[hash]();
			djif_switch(hash);
		});
	});
	
	
	
	
});

$('#remix').mouseleave(function() {
	$('#tooltip').fadeOut(200);
});

$(window).bind("load", function() {
	for (var i in audio_load) {
		audio_load[i]();
	}
});





