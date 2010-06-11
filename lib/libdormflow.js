// libdormflow.js
// by Medical-Wei used for dormflow2
//

var jsonData=new Array();
var bannedUsersData;

var countDownStage1=60;
var countDownStage2=600;

var overflowQuota=3000;
var warningQuota=2500;

var daysRewinding=6;

var daysRewindingLoadingCount=daysRewinding;
var daysRewindingLoading=false;
var countDown=countDownStage1;

var r;
var detectedIP=false;
var userIP=false;
var displayDOM;

var translations=
{
"en":{
	   "YOUR_QUOTA": "your quota",
	   "STATISTICS": "statistics",
	   "USERS_LIST": "users list",
	   "BANNED_USERS": "banned users",
	   "PREFERENCES": "preferences",
	   "BANNED": "banned",
	   "UPLOAD": "up",
	   "DOWNLOAD": "down",
	   "TOTAL": "total",
	   "DAY": "day",
	   "DAYS": "days",
	   "BEGIN": "begin",
	   "DURATION": "duration",
	   "TILL": "till",
	   "NO_DATA": "no data",
	   "UNKNOWN": "unknown",
           "ALERT_NO_USER_IP": "You are connected to this site outside the NTOU dormitory Internet service. \nHowever, you can check out quota information of clients.",
           "ALERT_NO_STATISTICS": "No statistics since we don't know the IP of the dormitory.",
	   "LOADING": "loading…",
	   "ERROR_NOT_DORM_IP": "Error: Not a dormitory IP.",
	   "ERROR_DAYS_REWINDING": "Error: Not a valid number.",
	   "SAVED": "saved"
   },
"zh-tw":{
	   "YOUR_QUOTA": "您的流量",
	   "STATISTICS": "統計圖表",
	   "USERS_LIST": "用戶清單",
	   "BANNED_USERS": "鎖卡名單",
	   "PREFERENCES": "偏好設定",
	   "BANNED": "被鎖卡",
	   "UPLOAD": "上傳",
	   "DOWNLOAD": "下載",
	   "TOTAL": "總計",
	   "DAY": "天",
	   "DAYS": "天",
	   "BEGIN": "開始",
	   "DURATION": "天數",
	   "TILL": "直到",
	   "NO_DATA": "無資料",
	   "UNKNOWN": "不明",
           "ALERT_NO_USER_IP": "您現在不是使用海洋大學的宿舍網路，\n但您可以查看使用者的流量。",
           "ALERT_NO_STATISTICS": "由於無法得知您的 IP，我們並不提供統計圖表。",
	   "LOADING": "讀取中…",
	   "ERROR_NOT_DORM_IP": "錯誤：不是宿舍 IP。",
	   "ERROR_DAYS_REWINDING": "錯誤：不是正確的數字。",
	   "SAVED": "已儲存"
      },
"ja":{
	   "YOUR_QUOTA": "クォータ",
	   "STATISTICS": "統計",
	   "USERS_LIST": "ユーザリスト",
	   "BANNED_USERS": "禁止ユーザー",
	   "PREFERENCES": "オプション",
	   "BANNED": "禁止されます",
	   "UPLOAD": "アップ",
	   "DOWNLOAD": "ダウン",
	   "TOTAL": "総計",
	   "DAY": "日",
	   "DAYS": "日",
	   "BEGIN": "開始",
	   "DURATION": "持続時間",
	   "TILL": "終止",
	   "NO_DATA": "データーなし",
	   "UNKNOWN": "不明",
           "ALERT_NO_USER_IP": "あなたは今台湾海洋大学の寮のネットワークを使うのではありませんて、\nしかしあなたは使用者の流量を調べることができます。",
           "ALERT_NO_STATISTICS": "あなたを知ることができないため IP，統計図表を提供しません。",
	   "LOADING": "読み取る中…",
	   "ERROR_NOT_DORM_IP": "エラー：これは寮 IP ではありません。",
	   "ERROR_DAYS_REWINDING": "エラー：これは正しい数字ではありません。",
	   "SAVED": "適用しました"
      }
}

var g_=translations["en"];

/*!
 * jQuery Konami code trigger v. 0.1
 *
 * Copyright (c) 2009 Joe Mastey
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

(function($){
    $.fn.konami             = function( fn, params ) {
        params              = $.extend( {}, $.fn.konami.params, params );
        this.each(function(){
            var tgt         = $(this);
            tgt.bind( 'konami', fn )
               .bind( 'keyup', function(event) { $.fn.konami.checkCode( event, params, tgt ); } );
        });
        return this;
    };
    
    $.fn.konami.params      = {
        'code'      : [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],
        'step'      : 0
    };
    
    $.fn.konami.checkCode   = function( event, params, tgt ) {
        if(event.keyCode == params.code[params.step]) {
            params.step++;
        } else {
            params.step     = 0;
        }
        
        if(params.step == params.code.length) {
            tgt.trigger('konami');
            params.step     = 0;
        }
    };
})(jQuery);

Date.prototype.toDatabaseFormatString = function()
{
	var dys = this.getFullYear().toString();
	var dms = (this.getMonth()+1).toString();
	var dds = this.getDate().toString();
	var ths = this.getHours().toString();
	var tms = this.getMinutes().toString();
	var tss = this.getSeconds().toString();
	if ( dms.length == 1 ) dms = "0" + dms;
	if ( dds.length == 1 ) dds = "0" + dds;
	if ( ths.length == 1 ) ths = "0" + ths;
	if ( tms.length == 1 ) tms = "0" + tms;
	if ( tss.length == 1 ) tss = "0" + tss;
	return dys+"-"+dms+"-"+dds+" "+ths+":"+tms+":"+tss;
}

$.prototype.markStatus = function(fsum)
{
			this.removeClass();
			if(fsum > overflowQuota) this.addClass("overflow");
			else if(fsum > warningQuota) this.addClass("warning");
}

function getFormattedDate(shift)
{
	if(!shift) shift=0;
	theDate = new Date();
	theDate.setDate(theDate.getDate()+shift);
	
	yd = theDate.getFullYear();
	md = theDate.getMonth()+1;
	dd = theDate.getDate();
	ys = new String(yd);
	ms = new String(md);
	ds = new String(dd);
	if ( ms.length == 1 ) ms = "0" + ms;
	if ( ds.length == 1 ) ds = "0" + ds;
	return [ys+ms+ds, ys, ms, ds];
}

function getJSONData(datadate, callback)
{
	$.getJSON("jsonData/"+datadate+".json", callback);
}

function fetchData()
{
	dateString=getFormattedDate()[0];
	getJSONData(dateString, function(data)
	{
		if(jsonData[dateString] && data.lastupdate <= jsonData[dateString].lastupdate)
		{ return; }

		if(jsonData[dateString])
		{
			countDown=countDownStage2;
		}

		var lastUpdate = new Date(data.lastupdate*1000);
		$("#lastUpdate").text(lastUpdate.toDatabaseFormatString());

		jsonData[dateString]=data;
		showYourQuota(userIP);
		showUsersList();
		if(displayDOM=="statistics") showStatistics(userIP);

	});
	$.getJSON("jsonData/bannedUsers.json", function(data)
	{
		bannedUsersData=data;
		showBannedUsers();
		if(jsonData[dateString]) showYourQuota(userIP);
	});
}

function showYourQuota(ip)
{

	var ipText = "ip_" + ip[0] + "_" + ip[1];

	if(!jsonData[getFormattedDate()[0]])
	{
		fetchData();
		return;
	}

	var ipData = jsonData[getFormattedDate()[0]].flowdata[ipText];

	if( ip ){
		$("#ipAddrContext").html(emphasizeIP(ip));
		if( ipData )
		{

			$("#totalQuotaContext").html(emphasizeNumber(ipData.fsum)+" MiB");
			$("#totalQuotaContext").markStatus(ipData.fsum);
			$("#uploadQuotaContext").html(emphasizeNumber(ipData.fout)+" MiB");
			$("#downloadQuotaContext").html(emphasizeNumber(ipData.fin)+" MiB");
			$("#remainingQuotaContext").html(emphasizeNumber(overflowQuota-ipData.fsum)+" MiB");

		}
		else
		{
			if( bannedUsersData && bannedUsersData.bannedusers[ipText] )
				showBanned();
			else showNotFound();
		}
	}
	else
	{
		showUnknown();
	}

}

function emphasizeIP(ip)
{

	return "140.121.<em>" + ip[0] + "." + ip[1] + "</em>";

}

function emphasizeNumber(i)
{

	var numberFixed = i.toFixed(2).toString();
	var numberPart = /^([\-0-9]*)(\.[0-9]*)$/.exec(numberFixed);
	return "<em>" + numberPart[1] + "</em>" + numberPart[2];

}

function showNotFound()
{

	$("#totalQuotaContext").text(g_['NO_DATA']+" (<1G)");
	$("#totalQuotaContext").removeClass();
	$("#uploadQuotaContext").text(g_['NO_DATA']);
	$("#downloadQuotaContext").text(g_['NO_DATA']);
	$("#remainingQuotaContext").text(g_['NO_DATA']);

}

function showUnknown()
{

	$("#ipAddrContext").html("<em>"+g_['UNKNOWN']+"</em>");
	$("#totalQuotaContext").html("<em>"+g_['UNKNOWN']+"</em>");
	$("#totalQuotaContext").removeClass();
	$("#totalQuotaContext").addClass("warning");
	$("#uploadQuotaContext").text(g_['UNKNOWN']);
	$("#downloadQuotaContext").text(g_['UNKNOWN']);
	$("#remainingQuotaContext").text(g_['UNKNOWN']);

}

function showBanned()
{

	$("#totalQuotaContext").html("<em>"+g_['BANNED']+"</em>");
	$("#totalQuotaContext").removeClass();
	$("#totalQuotaContext").addClass("overflow");
	$("#uploadQuotaContext").text(g_['NO_DATA']);
	$("#downloadQuotaContext").text(g_['NO_DATA']);
	$("#remainingQuotaContext").text(g_['NO_DATA']);

}

function fetchUserIP()
{

	$.getJSON("fetchUserIP.php", function(data)
	{
		detectedIP=data.dormIP;
		userIP=detectedIP;
		// if(!userIP) window.alert(g_['ALERT_NO_USER_IP']);
		readPreferences();
	});

}

function displayYourQuota()
{
	$("#pageHeader h2").text(g_['YOUR_QUOTA']);
	$("#pageContent>*:not(#yourQuota)").hide();
	$("#yourQuota").show();
	$("#mainMenu>ul>*:not(.yourQuota)").removeClass("current");
	$("#mainMenu>ul>.yourQuota").addClass("current");
	document.title=g_['YOUR_QUOTA']+" | dormflow.ntou";
	displayDOM="yourQuota";
}

function displayStatistics()
{
	if(!userIP)
	{
		window.alert(g_['ALERT_NO_STATISTICS']);
		displayUsersList();
		return;
	}
	$("#pageHeader h2").text(g_['STATISTICS']);
	$("#pageContent>*:not(#statistics)").hide();
	$("#statistics").show();
	$("#mainMenu>ul>*:not(.statistics)").removeClass("current");
	$("#mainMenu>ul>.statistics").addClass("current");
	document.title=g_['STATISTICS']+" | dormflow.ntou";
	displayDOM="statistics";
	setTimeout("showStatistics(userIP)",0);
}

function displayUsersList()
{
	$("#pageHeader h2").text(g_['USERS_LIST']);
	$("#pageContent>*:not(#usersList)").hide();
	$("#usersList").show();
	$("#mainMenu>ul>*:not(.usersList)").removeClass("current");
	$("#mainMenu>ul>.usersList").addClass("current");
	document.title=g_['USERS_LIST']+" | dormflow.ntou";
	displayDOM="usersList";
}

function displayBannedUsers()
{
	$("#pageHeader h2").text(g_['BANNED_USERS']);
	$("#pageContent>*:not(#bannedUsers)").hide();
	$("#bannedUsers").show();
	$("#mainMenu>ul>*:not(.bannedUsers)").removeClass("current");
	$("#mainMenu>ul>.bannedUsers").addClass("current");
	document.title=g_['BANNED_USERS']+" | dormflow.ntou";
	displayDOM="bannedUsers";
}

function displayPreferences()
{
	$("#pageHeader h2").text(g_['PREFERENCES']);
	$("#pageContent>*:not(#preferences)").hide();
	$("#preferences").show();
	$("#mainMenu>ul>*:not(.preferences)").removeClass("current");
	$("#mainMenu>ul>.preferences").addClass("current");
	document.title=g_['PREFERENCES']+" | dormflow.ntou";
	displayDOM="preferences";
}

function showUsersList()
{
	var targetData = jsonData[getFormattedDate()[0]].flowdata;
	$("#usersListContext").empty();
	for( i in targetData ){
		var ipNum = /^ip_([0-9]*)_([0-9]*)$/.exec(i);
		var itemData = targetData[i];
		var item = $("<li></li>");
		var dict = $("<dl></dl>");
		dict.append($("<dt></dt>").html("140.121.<em>"+ipNum[1]+"."+ipNum[2]));
		dict.append($("<dd></dd>").addClass("fsum").html(g_['TOTAL']+": " + emphasizeNumber(itemData.fsum)+" MiB"));
		dict.append($("<dd></dd>").addClass("fout").html(g_['UPLOAD']+": "+emphasizeNumber(itemData.fout)+" MiB"));
		dict.append($("<dd></dd>").addClass("fin").html(g_['DOWNLOAD']+": "+emphasizeNumber(itemData.fin)+" MiB"));
		item.markStatus(itemData.fsum);
		item.append(dict);
		$("#usersListContext").append(item);
	}
}

function showBannedUsers()
{
	var targetData = bannedUsersData.bannedusers;
	$("#bannedUsersContext").empty();
	for( i in targetData ){
		var ipNum = /^ip_([0-9]*)_([0-9]*)$/.exec(i);
		var itemData = targetData[i];
		var item = $("<li></li>");
		var dict = $("<dl></dl>");
		var begin = new Date(itemData.begin*1000);
		var duration = itemData.duration;
		// var till = new Date((itemData.begin+86400*duration)*1000);
		dict.append($("<dt></dt>").html("140.121.<em>"+ipNum[1]+"."+ipNum[2]));
		// dict.append($("<dd></dd>").addClass("begin").html(g_['BEGIN']+": "+begin.toDatabaseFormatString()));
		dict.append($("<dd></dd>").addClass("begin").html(begin.toDatabaseFormatString()));
		dict.append($("<dd></dd>").addClass("duration").html(g_['DURATION']+": <em>"+duration+"</em> "+(duration>1?g_['DAYS']:g_['DAY'])));
		// dict.append($("<dd></dd>").addClass("till").html(g_['TILL']+": "+till.toDatabaseFormatString()));

		if(duration >= 7) item.addClass("overflow");
		else if(duration >= 2) item.addClass("warning");

		item.append(dict);
		$("#bannedUsersContext").append(item);
	}
}

function showStatistics(ip, continueLoading)
{
	if(daysRewindingLoadingCount>0)
	{
		if(daysRewindingLoading && !continueLoading) return;
		daysRewindingLoading=true;
		daysBack=daysRewinding-daysRewindingLoadingCount+1;
		dateString=getFormattedDate(-daysBack)[0];
		$("#statisticsIPAddrContext").html("<em>" + g_['LOADING'] + "</em> " + daysBack + "/" + daysRewinding);
		getJSONData(dateString,function(data){
			jsonData[dateString]=data;
			daysRewindingLoadingCount--;
			showStatistics(userIP, true);
		});
		return;
	}
	
	daysRewindingLoading=false;
	r.clear();

	var show = function () {
		this.flag.attr({opacity: 1});
	};

	var hide = function () {
		this.flag.attr({opacity: 0});
	};

	var dayLabels = new Array();
	var fin = new Array();
	var fout = new Array();
	var norec = new Array();
	var ipText = "ip_" + ip[0] + "_" + ip[1];

	for(i=daysRewinding;i>=0;i--)
	{
		var d = getFormattedDate(-i);
		dayLabels.push(d[2]+"/"+d[3]);
		if(jsonData[d[0]].flowdata[ipText]){
			fin.push(jsonData[d[0]].flowdata[ipText].fin);
			fout.push(jsonData[d[0]].flowdata[ipText].fout);
			norec.push(0);
		}else{
			fin.push(0);
			fout.push(0);
			norec.push(1000);
		}
	}

	var c = r.g.barchart(50, 50, 800, 370, [fin, fout, norec], {stacked: true, type: "soft"});
        c.bars[2].attr({fill: "#334"});
	for(i=0;i<=daysRewinding;i++){
		targetColumn = c[2][i];
		
		var y = new Array();
		var disp = new String(dayLabels[i]+"\n");

		y.push(targetColumn.bars[0].y);
		y.push(targetColumn.bars[1].y);
		y.push(targetColumn.bars[2].y);

		if(targetColumn.bars[2].value == "1000")
			disp+="<1000";
		else
			disp+=(fin[i]+fout[i]).toFixed(2);

		if(fin[i]+fout[i]>overflowQuota)
		{
			r.rect(targetColumn.attrs.x, 0, targetColumn.attrs.width, 1000).attr({fill:"#332222", "stroke-opacity":0}).insertBefore(targetColumn.bars[2]);
		}else if(fin[i]+fout[i]>warningQuota)
		{
			r.rect(targetColumn.attrs.x, 0, targetColumn.attrs.width, 1000).attr({fill:"#333322", "stroke-opacity":0}).insertBefore(targetColumn.bars[2]);
		}
		targetColumn.flag = r.g.popup(targetColumn.bars[0].x, Math.min.apply(Math, y), disp).insertBefore(targetColumn);
		if(daysRewinding>13) targetColumn.flag.attr({opacity: 0});
	};

	if(daysRewinding>13) c.hoverColumn(show, hide);

	$("#statisticsIPAddrContext").html(emphasizeIP(ip));
}

function updateCountdown()
{
	if(countDown>0)
	{
		countDown=countDown-1;

		var min = (Math.floor(countDown/60)).toString();
		var sec = (countDown%60).toString();
		if ( sec.length == 1 ) sec = "0" + sec;
		$("#updateCountdown").text(min+":"+sec);
	}
	else if(countDown==0)
	{
		countDown=countDownStage1;
		fetchData();
	}
}

$(document).ready(function(){
	if(document.LANG) g_=translations[document.LANG];
	r = Raphael("statisticsCanvas", 900, 400);
	fetchUserIP();
	displayYourQuota();
	$(document).everyTime("1s", function(i) {
		updateCountdown();
	}, 0);


	$('#preferencesNoIPDetection').hide();
	$('#prefIPDetection').change(function()
	{
		if($('#prefIPDetection')[0].checked)
			$('#preferencesNoIPDetection').hide();
		else
			$('#preferencesNoIPDetection').show();
	});
});

$(document).konami(function(){
	$("#mainMenu>ul>.preferences").show()
		.animate({opacity: 0}, 0).delay(50)
		.animate({opacity: 1}, 0).delay(50)
		.animate({opacity: 0}, 0).delay(50)
		.animate({opacity: 1}, 0).delay(50)
		.animate({opacity: 0}, 0).delay(50)
		.animate({opacity: 1}, 0);

});

function setPreferences()
{
	var prefIPDetection=$('#prefIPDetection')[0].checked;
	var prefIPSet=(!prefIPDetection)?[parseInt($('#prefIPSet_1')[0].value), parseInt($('#prefIPSet_2')[0].value)]:[0,0];
	var prefStatsHistory=parseInt($('#prefStatsHistory')[0].value);

	// sanity check
	if((!prefIPDetection) && (
		!prefIPSet[0] || prefIPSet[0]<204 || prefIPSet[0]>222 ||
	        !prefIPSet[1] || prefIPSet[1]<1   || prefIPSet[1]>254 )
	  ){
		window.alert(g_['ERROR_NOT_DORM_IP']);
		return;
	}

	if(!prefStatsHistory || prefStatsHistory>=100 && prefStatsHistory<=0){
		window.alert(g_['ERROR_DAYS_REWINDING']);
	}

	// saving information
	$.cookie('prefIPSet', (prefIPSet[0]*256 + prefIPSet[1]).toString() );
	$.cookie('prefStatsHistory', prefStatsHistory.toString() );

	// applying preferences
	readPreferences();

	// show information
	$("#preferencesApply").append('<span class="flash"> '+g_['SAVED']+'</span>');
	$('.flash').fadeOut(300);
}

function readPreferences()
{
	prefIPSet=parseInt($.cookie('prefIPSet'));
	prefStatsHistory=parseInt($.cookie('prefStatsHistory'));

	if(prefIPSet)
	{
		prefIPSetParsed = [Math.floor(prefIPSet/256), prefIPSet%256];
		userIP=prefIPSetParsed;
		$('#prefIPDetection')[0].checked=false;
		$('#prefIPSet_1')[0].value = prefIPSetParsed[0];
		$('#prefIPSet_2')[0].value = prefIPSetParsed[1];
		$('#preferencesNoIPDetection').show();
	} else {
		userIP=detectedIP;
	}

	if(prefStatsHistory)
	{
		daysRewindingLoadingCount=prefStatsHistory-daysRewinding+daysRewindingLoadingCount;
		daysRewinding=prefStatsHistory;
		$('#prefStatsHistory')[0].value=prefStatsHistory;
	}
	
	// updating information
	showYourQuota(userIP);

}
