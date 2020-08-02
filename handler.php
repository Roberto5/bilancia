<?php



class handler {
    private $file='db.json';
    var $reader=null;
    var $zero=null;
    var $history=null;
    var $buffer=false;
    var $products=array();
    var $debug=[];
    function __construct($handler,$config=array()) {
        if ($handler instanceof readerHandelr)
            $this->reader=$handler;
        else $this->reader=new debugReader();
        
        $conf=$this->readConf();
        //sprint_r($conf);
        $write=false;
        
        $default=array(
            'zero'=>false,
            'history'=>false,
            /*'products'=>array(),
            'edit'=>false,
            'add'=>false,
            'delete'=>false*/
        );
        if (array_key_exists('products', $conf))
            $this->products=$conf['products'];
        if (array_key_exists('edit', $config)&& $config['edit']) {
            $this->debug[]=$config;
            foreach ($this->products as $key=>$prod) {
                if ($prod['name']==$config['edit']) {
                    $this->products[$key]=$config['products'];
                    $this->debug[]=$this->products[$key];
                }
            }
            $write=true;
        }
        if (array_key_exists('add', $config) && $config['add']) {
            $this->products[]=$config['products'];
            $write=true;
        }
        if (array_key_exists('delete', $config) && $config['delete']) {
            $temp=array();
            foreach ($this->products as $value) {
                if ($config['delete']!=$value['name']) $temp[]=$value;
            }
            $this->products=$temp;
            $write=true;
        }
        $conf['products']=$this->products;
        foreach ($default as $key => $value) {
            if (isset($config[$key])) {
                echo $key;
                $value=$config[$key];
            }
            
            if (($key=='zero')&& $value) {
                
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
        if (isset($conf['products']) && is_array($conf['products'])) $this->products=$conf['products'];
        
        
        
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
            if (is_numeric($result['weight']))
            $result['weight']-=$this->zero;
            else {
                $result['weight']=0;
                $result['message'].=' il peso letto non è un numero';
            }
        }
        $result['products']=$this->products;
        $result['debug']=$this->debug;
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