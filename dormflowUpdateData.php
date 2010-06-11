<?php
include_once "./lib/simple_html_dom.php";
include_once "./dormflowJSONizer.php";
include_once "./bannedusersJSONizer.php";

function getFormattedDate($time)
{
	// year, mon, mday
	$date = getDate($time);
	$y = sprintf("%04d", $date['year']);
	$m = sprintf("%02d", $date['mon']);
	$d = sprintf("%02d", $date['mday']);
	return array($y, $m, $d);
}

function updateData($time, $updateBannedUsers)
{
	// http://dormflow.ntou.edu.tw/yyyy/mm/dd/
	$date = getFormattedDate($time);
	$uri = "http://dormflow.ntou.edu.tw/$date[0]/$date[1]/$date[2]/";
	$html = file_get_html($uri);
	$jsonFilename = "$date[0]$date[1]$date[2].json";

	$remoteLastUpdate = strtotime($html->find('td.m', -1)->plaintext);
	
	if($fileReader = fopen("jsonData/$jsonFilename", "r"))
	{
		/* get jsonData last update */
		$matchString = fgets($fileReader, 64);
		fclose($fileReader);

		if (preg_match("/^{\"lastupdate\":([0-9]+)/", $matchString, $matches)){ 
			if($matches[1] >= $remoteLastUpdate)
				return false;
		}
	} 
	

	/* starts update */
	if(!$fileWriter = fopen("jsonData/$jsonFilename", "w"))
		die("cannot write parsing data.");
	fwrite($fileWriter, dormflowJSONize($uri."%b1J%aa%d9sortbyflowsum.html", $remoteLastUpdate));
	fclose($fileWriter);

	if($updateBannedUsers){
		if(!$bannedUsersFileWriter = fopen("jsonData/bannedUsers.json", "w"))
			die("cannot write parsing data for banned users.");
		fwrite($bannedUsersFileWriter, banlistJSONize("http://dormflow.ntou.edu.tw/banip.html", $remoteLastUpdate));
		fclose($bannedUsersFileWriter);
	}

	return true;
}

updateBannedUsers()
{
}

updateData(time()-86400, false);
updateData(time()+86400, false);
