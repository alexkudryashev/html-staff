<?php
function get_domain_age($url)
{
$url = "http://web.archive.org/web/*/$url";
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch,CURLOPT_RETURNTRANSFER, 1);
$result = curl_exec($ch);
//curl_exec($ch);
curl_close($ch);
$patt="/times(.|\\n)*?between(.|\\n)*?\<a.*?\>(?P<startDate>(.*?))\<\\/a\>/im";
preg_match($patt, $result, $matches,PREG_OFFSET_CAPTURE);
return $matches['startDate'];
}
echo 'get_domain_age<br />';
echo '<pre>
results
';
print_r( get_domain_age("google.com"));
echo '</pre>';

/*                              
// your code
function get_domain_age($url) 
{ 
$url = "http://web.archive.org/web/* /"; + $url; //error.even if you remove ; after "" error persists + in php used for numbers
$ch = curl_init($url); 
curl_setopt($ch, CURLOPT_HEADER, 0); 
curl_setopt($ch,CURLOPT_RETURNTRANSFER, 1); 
$result = curl_exec($ch); 
curl_exec($ch);   // useless
curl_close($ch); 
preg_match("times between <a.*? >(.*?)<\/a>/", $result, $matches);  //no comment. all wrong
return $matches[1]; 
} 
get_domain_age("google.com");  //function result not used
*/

?>