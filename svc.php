<?php

function echoo($echo){
    return "ECHO: ".$echo;
}

$server = new SoapServer(null,
                         array('uri' => "urn://test/res"));
$server->addFunction('echoo');
$server->handle();

?>