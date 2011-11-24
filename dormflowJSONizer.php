<?php
include_once "./lib/simple_html_dom.php";

function dormflowJSONize($source, $timestamp)
{
	$html = file_get_html($source);
	if (!$html) return '{"lastupdate":0,"flowdata":{}}';

	$jsonHeadKeys = array("rank", "ipaddr");
	$jsonKeys = array("fsum", "fin", "fout");
	$content = "";

	$lines = array();

	foreach($html->find('table[id=flow] tbody tr') as $user)
	{
		$jsonKey = '""';
		$line = array();

		foreach($user->find('th') as $infoKey => $infoValue)
		{
			$jsonInfoKey = $jsonHeadKeys[$infoKey];

			if( 	$jsonInfoKey == "ipaddr")
			{
				$jsonKey = trim("$infoValue->plaintext"); 
				continue;
			}

			array_push($line, "\"$jsonInfoKey\":$infoValue->plaintext");
		}

		foreach($user->find('td') as $infoKey => $infoValue)
		{
			$jsonInfoKey = $jsonKeys[$infoKey];

			array_push($line, "\"$jsonInfoKey\":".sprintf("%.2f", $infoValue->plaintext));
			continue;
		}

		if($jsonKey == '""') continue;

		preg_match("/([0-9]+)\.([0-9]+)$/", trim($jsonKey), $ipMatches);
		$jsonKey = sprintf("ip_%d_%d", $ipMatches[1], $ipMatches[2]);
		$line = "\"$jsonKey\":{" . implode(",", $line) . "}";
		array_push($lines, $line);
	}
		
	$content = "{\"lastupdate\":".$timestamp.",\"flowdata\":{" . implode(",", $lines) . "}}";
	
	$html->clear();
	unset($html);
	return $content;
}

