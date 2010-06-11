<?php

function fetchUserIP()
{
	if (empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
		return $_SERVER['REMOTE_ADDR'];
	} else {
		$myip = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
		return $myip[0];
	}

}

function fetchDormIP($ip)
{
	$split=explode('.', $ip);
	if((int) $split[0]==140 && (int) $split[1]==121 && ((int) $split[2] >= 204 && (int) $splite[2] <= 222))
		return array((int) $split[2], (int) $split[3]);
	return false;
}

$ip=fetchUserIP();
$dormip=fetchDormIP($ip);


// start assembling json

echo "{";

echo "\"userIP\":\"$ip\",";

if($dormip){
	echo "\"dormIP\":[${dormip[0]}, ${dormip[1]}]";
}else{
	echo "\"dormIP\":false";
}

echo "}";
