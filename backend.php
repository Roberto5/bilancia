<?php
include 'handler.php';

//debug mode
$handler=null;//new debugReader();
$reader=new handler($handler);

echo json_encode($reader->read());