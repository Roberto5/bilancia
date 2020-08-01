<?php
include 'handler.php';

//debug mode
$handler=null;//new debugReader();
$option=array();
if (isset($_GET['setZero'])&& $_GET['setZero']) {
    $option['zero']=true;
}
if (isset($_GET['history']) && $_GET['history']) {
    $option['history']=true;
}
//echo 'option';
//print_r($option);
//echo'<br>';
$reader=new handler($handler,$option);

echo json_encode($reader->read());