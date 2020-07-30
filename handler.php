<?php



class handler {
    var $reader=null;
    function __construct($handler) {
        if ($handler instanceof readerHandelr)
            $this->reader=$handler;
        else $this->reader=new debugReader();
    }
    /**
     * read inpud 
     * @return array
     */
    function read() {
        return $this->reader->read();
    }
}

interface readerHandelr {
    /**
     * @return Array;
     */
    function read();
}
//@todo add a production handler


class debugReader implements readerHandelr {
    function read() {
        $output=null;
        $return=null;
        exec('./random.sh',$output,$return);
        
        if (($return<0)||!is_numeric($output[0])) {
            $result=array('message'=>'error '.print_r($output,true),'weight'=>0);
        }
        else $result=array('message'=>'','weight'=>$output[0]);
        return $result;
    }
}