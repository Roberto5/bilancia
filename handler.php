<?php



class handler {
    private $file='db.json';
    var $reader=null;
    var $zero=null;
    var $history=null;
    var $buffer=false;
    function __construct($handler,$config=array()) {
        if ($handler instanceof readerHandelr)
            $this->reader=$handler;
        else $this->reader=new debugReader();
        
        $conf=$this->readConf();
        print_r($conf);
        $write=false;
        
        $default=array(
            'zero'=>false,
            'history'=>false,
        );
        
        foreach ($default as $key => $value) {
            if (isset($config[$key])) {
                echo $key;
                $value=$config[$key];
            }
            if (($key=='zero')&& $value) {
                echo 'zero!';
                $this->buffer=$this->read();
                $value=$this->buffer['weight'];
                $this->buffer['weight']=0;
                $conf['zero']=$value;
                $write=true;
            }
            $this->$key=$value;
        }
        if (isset($conf['zero'])) $this->zero=$conf['zero'];
        if ($write) {
            $this->writeConf($conf);
        }
        
        
        
    }
    function readConf() {
        $conf=file_get_contents($this->file);
        return json_decode($conf,true);
    }
    function writeConf($conf) {
        file_put_contents($this->file, json_encode($conf));
    }
    /**
     * read inpud 
     * @return array
     */
    function read() {
        if ($this->buffer) $result=$this->buffer;
        else {
            $result=$this->reader->read();
            $result['weight']-=$this->zero;
        }
        return $result;
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
        $input=file_get_contents('debugWeight.txt');
        if (!$input) {
            $result=array('message'=>'error "'.print_r($input,true).'"','weight'=>0);
        }
        else $result=array('message'=>'','weight'=>$input);
        return $result;
    }
}