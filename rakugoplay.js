//<script>
jQuery(function($) {
	var w = window, player;
	
	getScript('https://www.youtube.com/iframe_api');
	
	var firstScriptTag = document.getElementsByTagName('script')[0];
	
	$(document).bind("touchmove", function() {
		event.preventDefault();
	});

	// ここからは動画の検索
	$("#rakugo").click(function() {
		// 落語ちゃんねる
		getChannelVideos('UCMaihW8BJimpul-w3RsgZ3A');
	});
	$("#rakusearch").click(function() {
		// 落語ちゃんねる
		cueOrderedPlaylist('search', '落語', player);
	});
	
	$("#tbs").click(function() {
		// UCMaihW8BJimpul-w3RsgZ3A
		getChannelVideos('tbsnewsi');
	});
	$("#ann").click(function() {
		// UCMaihW8BJimpul-w3RsgZ3A
		getChannelVideos('ANNnewsCH');
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

/*----------------------------------------*/
/* Step.0 準備*/
/*----------------------------------------*/
//ライブラリを非同期で読み込むための関数を予め用意
function getScript(src){
    !(function(d,s,src){
        var js = d.createElement(s);
        js.src = src;
        var fjs = d.getElementsByTagName(s)[0];
        fjs.parentNode.insertBefore(js, fjs);
    })(document,'script',src)
}

/*----------------------------------------*/
/* Step.2 Google Client Libraryを利用して認証処理を行う*/
/*----------------------------------------*/
//APIの設定
const APIKEY = 'AIzaSyAMU3Oo-PoQLFWH81RchsgDbzafXC4vlKw';
//初期化実行
function handleClientLoad(){
    //API　Key をセット
    gapi.client.setApiKey(APIKEY);
    //YouTube Data API v3を読み込み
    gapi.client.load('youtube','v3',getChannelId);
}

//iframe_apiが読み込まれたら,
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '400',
        videoId: 'M7lc1UVf-VE',
		events : {
			onReady : function() {
				// 最後まで終わったらまた最初から再生されるように
				player.setLoop(true);
			},
			onStateChange: onPlayerStateChange
		}
        events:{
            'onReady': onPlayerReady
        }
    });
}

//playerの設定が完了したら、
function onPlayerReady(ev){
    //client.jsを読み込む。
    getScript('https://apis.google.com/js/client.js?onload=handleClientLoad');
}

/*----------------------------------------*/
/* Step.3 チェンネルIDを取得する*/
/*----------------------------------------*/
const BASEPATH = '/youtube/v3/';
//ユーザーIDを指定
const userId = 'tbsnewsi';
//チャンネル情報の取得
function getChannelId(){
    //チャンネルリソースを使用する。
    var resource = 'channels';
    //チャンネルIDだけが必要なので、partはidだけを指定
    var params = {
        part:'id',
        forUsername:userId
    }
    //リクエスト
    gapi.client.request({
        path: BASEPATH+resource,
        params: params,
        callback: getChannelVideos
    });
}

/*----------------------------------------*/
/* Step.4 チャンネルの新着動画を取得する */
/*----------------------------------------*/
//チャンネルの動画を取得
function getChannelVideos(response){
    //チャンネルIDを抽出
    var channelId = response.items[0].id;
    //searchリソースを使用する
    var resource = 'search';
    var params = {
        part:'id,snippet',
        channelId:channelId,
        order:'date',
        maxResults:5
    }
    //リクエスト
    gapi.client.request({
        path: BASEPATH+resource,
        params: params,
        callback: setVideos
    });
}
