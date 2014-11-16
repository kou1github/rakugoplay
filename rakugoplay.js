//<script>
jQuery(function($) {
	var w = window, player;

	// 最初は隠しておく
	// $('#video').hide();

	// https://developers.google.com/youtube/iframe_api_reference
	var tag = document.createElement('script');
	tag.src = "//www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	w.onYouTubeIframeAPIReady = function() {
		player = new YT.Player('video', {
			//height : '450',
			//width : '800',
			// videoIdはこの段階ではセットしていない
			playerVars: {
				showinfo: 0,
				disablekb: 1
			},
			events : {
				onReady : function() {
					// 最後まで終わったらまた最初から再生されるように
					player.setLoop(true);
				},
				onStateChange: onPlayerStateChange
			}
		});
	};
	
	$(document).bind("touchmove", function() {
		event.preventDefault();
	});

	// ここからは動画の検索
	$("#rakugo").click(function() {
		// 落語ちゃんねる
		cueOrderedPlaylist('channel', 'UCMaihW8BJimpul-w3RsgZ3A', player);
	});
	$("#rakusearch").click(function() {
		// 落語ちゃんねる
		cueOrderedPlaylist('search', '落語', player);
	});
	
	$("#tbs").click(function() {
		// UCMaihW8BJimpul-w3RsgZ3A
		cueOrderedPlaylist('channel', 'tbsnewsi', player);
	});
	$("#ann").click(function() {
		// UCMaihW8BJimpul-w3RsgZ3A
		cueOrderedPlaylist('channel', 'ANNnewsCH', player);
	});

	$("#start_btn").click(function() {
		// 再生開始
		player.playVideo();
		console.log('player: ', player.getPlaylistIndex())

	});
	
	$("#stop_btn").click(function() {
		// 一時停止
		player.pauseVideo();
	});
	
	$("#back_btn").click(function() {
		// UCMaihW8BJimpul-w3RsgZ3A
		player.previousVideo();
	});
	$("#forward_btn").click(function() {
		// UCMaihW8BJimpul-w3RsgZ3A
		player.nextVideo();
	});
});
// </script>
function cueOrderedPlaylist(searchtype, word, player){

	if (searchtype == 'channel') {
		query = {
			url : 'http://gdata.youtube.com/feeds/api/users/' + word
					+ '/uploads?',
			dataType : 'jsonp',
			data : {
				'alt' : 'jsonc',
				'v' : 2,
				'max-results' : 50,
				'orderby' : "published",
			}
		};
	} else {
		query = {
			url : 'http://gdata.youtube.com/feeds/api/videos?',
			dataType : 'jsonp',
			data : {
				'q' : word,
				'alt' : 'jsonc',
				'v' : 2,
				'max-results' : 50,
				'format' : 5,
				'orderby' : "published",
				'start-index' : 1
			}
		};
	}
	
	
	  $.ajax(query).done(function(data) {
	      // 再生中の動画があれば止めて消す
	      player.stopVideo(); 
	      player.clearVideo(); 
	      $('#video').fadeIn();
	      var videos = [];
	      videoname = [];
	      $.each(data.data.items, function() {
	        videos.push(this.id);
	        videoname.push(this.title);
	      });

/*	      videos = videos.sort(function(a, b) {
	        return b.uploaded - a.uploaded;
	      });
*/
	      // ここでキューに動画のIDを突っ込むだけ
	      player.cuePlaylist(videos);
	    });
	
}

function onPlayerStateChange(event) {
	$("#title").text(videoname[event.target.getPlaylistIndex()]);

	var state = "";
	switch (event.data) {
	case YT.PlayerState.PLAYING:
		state = "＜再生中＞";
		break;
	default:
		state = "＜停止中＞";
		break;
	}
	$("#play_state").text(state);
}
