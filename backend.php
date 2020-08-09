<?php
include 'handler.php';

function clean_input($input) {
    $output=null;
    if (is_array($input)) {
        foreach ($input as $key => $value) {
            $output[$key]=clean_input($value);
        }
    }
    else $output=htmlentities($input);
    return $output;
}


function get($array,$key,$bool=false) {
    if (isset($array[$key]) && $array[$key]) {
        return $bool ? true : clean_input($array[$key]);
    }
        
    else return false;
}

//debug mode
$handler=null;//new debugReader();
$option=array(
    'zero'=>get($_GET,'setZero',true),
    'getHistory'=>get($_GET,'getHistory',true),
    'history'=>get($_POST,'history'),
    'products'=>get($_POST, 'products'),
    'add'=>get($_GET, 'add',true),
    'edit'=>get($_GET, 'edit'),
    'delete'=>get($_GET,'delete'),
    'deleteHistory'=>get($_GET,'deleteHistory')
);
//echo 'option';
//print_r($option);
//echo'<br>';
$reader=new handler($handler,$option);

echo json_encode($reader->read());