<?php
include_once "./lib/simple_html_dom.php";

function banlistJSONize($source, $timestamp)
{
	$html = file_get_html($source);
	if (!$html) return false;

	$jsonKeys = array("id", "ipaddr", "begin", "duration");
	$content = "";

	$lines = array();

	foreach($html->find('tr') as $user)
	{
		
		$jsonKey = '""';
		$line = array();
		foreach($user->find('td') as $infoKey => $infoValue)
		{
			$jsonInfoKey = $jsonKeys[$infoKey];
			// ignore top 1 and bottom 2 lines
			if(	$infoValue->plaintext == "NO" ||
				$infoValue->plaintext == "")
				break;

			if( 	$jsonInfoKey == "id")
			{
				continue;
			}

			// put ipaddr into json key
			if( 	$jsonInfoKey == "ipaddr")
			{
				$jsonKey = trim("$infoValue->plaintext"); 
				continue;
			}

			if( 	$jsonInfoKey == "begin")
			{
				array_push($line, "\"$jsonInfoKey\":".strtotime($infoValue->plaintext));
				continue;
			}
			
			array_push($line, "\"$jsonInfoKey\":$infoValue->plaintext");
			
		}

		if($jsonKey == '""') continue;

		preg_match("/([0-9]+)\.([0-9]+)$/", trim($jsonKey), $ipMatches);
		$jsonKey = sprintf("ip_%d_%d", $ipMatches[1], $ipMatches[2]);
		$line = "\"$jsonKey\":{" . implode(",", $line) . "}";
		array_push($lines, $line);
	}
		
	$content = "{\"lastupdate\":".$timestamp.",\"bannedusers\":{" . implode(",", $lines) . "}}";
	
	$html->clear();
	unset($html);
	return $content;
}

