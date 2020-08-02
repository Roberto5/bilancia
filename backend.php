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
if (isset($_POST['products'])&& is_array($_POST['products'])) {
    foreach ($_POST['products'] as $key => $value) {
        $option['products'][$key]=htmlentities($value);
    }
    
}
if (isset($_GET['add']) && $_GET['add']) {
    $option['add']=true;
}
if (isset($_GET['edit']) && $_GET['edit']) {
    $option['edit']=htmlentities($_GET['edit']);
}
if (isset($_GET['delete']) && $_GET['delete']) {
    $option['delete']=htmlentities($_GET['delete']);
}
//echo 'option';
//print_r($option);
//echo'<br>';
$reader=new handler($handler,$option);

echo json_encode($reader->read());