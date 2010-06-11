<?php
include_once "./lib/simple_html_dom.php";

function dormflowJSONize($source, $timestamp)
{
	$html = file_get_html($source);
	if (!$html) return "{\"lastupdate\":0,\"flowdata\":{}}";

	$jsonKeys = array("rank", "ipaddr", "fin", "fout", "fsum", "pkgin", "pkgout", "pkgsum", "banstat");
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

			// ignore pkg information and banstat
			if( 	$jsonInfoKey == "pkgin" || 
				$jsonInfoKey == "pkgout" || 
				$jsonInfoKey == "pkgsum" ||
				$jsonInfoKey == "banstat")
				continue;
			
			// put ipaddr into json key
			if( 	$jsonInfoKey == "ipaddr")
			{
				$jsonKey = trim("$infoValue->plaintext"); 
				continue;
			}

			if( 	$jsonInfoKey == "fin" || 
				$jsonInfoKey == "fout" || 
				$jsonInfoKey == "fsum"){
				array_push($line, "\"$jsonInfoKey\":".sprintf("%.2f", $infoValue->plaintext));
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
		
	$content = "{\"lastupdate\":".$timestamp.",\"flowdata\":{" . implode(",", $lines) . "}}";
	
	$html->clear();
	unset($html);
	return $content;
}

