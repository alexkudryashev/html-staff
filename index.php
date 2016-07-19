<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title></title>
</head>
<body>
<?php
//echo 'Hi there php';
//    phpinfo();
$echo = $_GET['input'];

print "<h2>Echo Web Service</h2>";
print "<form action='index.php' method='GET'/>";
print "<input name='input' value='$echo'/><br/>";
print "<input type='Submit' name='submit' value='GO'/>";
print "</form>";
    
if($echo != ''){
    $client = new SoapClient(null, array(
      'location' => "http://php-test.qdr/svc.php",
      'uri'      => "urn://test/req"));
try {
    $result = $client->__soapCall("echoo",array($echo));
    print 'result:'.$result;
} catch (Exception $e) {
    echo 'Caught exception: ',  $e->getMessage(), "\n";
}



}
  //var_dump($result);  
    phpinfo();

?>
</body>
</html>
