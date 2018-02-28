//<script>
jQuery(function($) {
	var w = window, player;

	// 最初は隠しておく
	// $('#video').hide();

	// https://developers.google.com/youtube/iframe_api_reference
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	w.onYouTubeIframeAPIReady = function() {
		player = new YT.Player('video', {
			//height : '450',
			//width : '800',
			// videoIdはこの段階ではセットしていない
                         videoId: 'MMO_Ozw9PPA',
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
		// 落語検索
		cueOrderedPlaylist('search', '落語', player);
	});

	$("#rakugodot").click(function() {
		// 落語.com
		cueOrderedPlaylist('channel_fab', 'UCIW83GpLM0Vk2Y5qgCFJAnA', player);
	});

	$("#rakugochoice").click(function() {
		// 古典落語名人選
		cueOrderedPlaylist('channel_fab', 'UCqLDf0fgL4z3W9jSONAM5Fg', player);
	});


	$("#jpnnews").click(function() {
		// 日本ニュース
		cueOrderedPlaylist('channel', 'UChZvNZvdKuCz-4vsf1ET_fQ', player);
	});
	$("#ann").click(function() {
		// ANNnewsCH
		cueOrderedPlaylist('channel', 'UCGCZAYq5Xxojl_tSXcVJhiQ', player);
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

    // http://aws01.kou1aws.pgw.jp 用
    var API_KEY = '';
    // ドメインなし
    // var API_KEY = '';
    var API_URL = 'https://www.googleapis.com/youtube/v3/search';
	if (searchtype == 'channel') {
            query = {
                url: API_URL,
                dataType: 'jsonp',
                type: 'GET',
                data: {
                    key : API_KEY,
                    part: 'snippet',
                    channelId: word,
                    maxResults : 50,
                    type : 'video',
                    order: 'date'
                }
            };
	} else if (searchtype == 'channel_fab') {
		query = {
				url: API_URL,
				dataType: 'jsonp',
				type: 'GET',
				data: {
						key : API_KEY,
						part: 'snippet',
						channelId: word,
						maxResults : 50,
						type : 'video',
						order: 'viewCount'
				}
		};
	} else {
            query = {
                url: API_URL,
                dataType: 'jsonp',
                type: 'GET',
                data: {
                    key : API_KEY,
                    part: 'snippet',
                    q : word,
                    maxResults : 50,
                    type : 'video',
                    order: 'date'
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
	      $.each(data.items, function() {
	        videos.push(this.id.videoId);
	        videoname.push(this.snippet.title);
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
