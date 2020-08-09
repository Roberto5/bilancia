class main {
	operators=[1,2];
	products=[];
	selProduct=-1;
	selectedOp=1;
	weightDisplay=null;
	messageDisplay=null;
	subTotDisplay=null;
	init=true;
	count=null;
	history=null;
	constructor() {
		this.weightDisplay=$('#weight');
		this.messageDisplay=$('#message');
		this.subTotDisplay=$('#subtotal');
		this.weightDisplay.on('click',function(){m.refresh();});
		this.history=new History();
		this.count=new count(this.history,this.selectedOp);
		this.refresh();
	}
	addCount(type,n=0) {
		let w;
		if (type=='w') {
			w=parseFloat(this.weightDisplay.text());
		}
		else {
			w=n;
		}
		let price=$('#price').val()
		var name=this.selProduct!=-1 ? this.products[this.selProduct].name : '';
			
			var data={ 
				name:name,
				W:w,
				price:price,
				tot:w*price,
				type:type
			};
			this.count.add(data);
			this.refresh();
	}
	updateW(data) {
		let w=''
		if (data.weight<10) w+='0'
		w+=data.weight;
		let i;
		if ((i=w.indexOf('.'))>0) {
			let nz=4-w.substr(i).length;
			for (let a=0;a<nz;a++)
			w+='0';
		}
		else w+='.000';
		m.weightDisplay.text(w);
		m.messageDisplay.text(data.message);
		if (m.subTotDisplay.parent().contents()[0].id==undefined) {
			m.subTotDisplay.parent().contents().eq(0).remove();
		}
		m.subTotDisplay.before(this.selProduct!=-1 ? this.products[this.selProduct].name+' ' : '')
			.text(Math.round(data.weight*$('#price').val()*100)/100);
		this.count.display();
		this.history.display();
	}
	refresh(option={}) {
		var getopt='';
		if (this.init) {
			getopt='?getHistory=1';
		}
		$.ajax({
			url:"backend.php"+getopt,
			dataType:'json',
			data:option,
			success:function(data) {
				//console.log('data',data);
				m.updateW(data);
				if (m.init) {
					if (data.history!=null) {
						for (let i in data.history) {
							m.history.add(data.history[i],false);
						}
						m.history.display();
					}
					m.products=data.products;
					m.displayProducts();
					m.init=false;
				}
			}
		});
	}
	editProd() {
		if (this.products.length>0) {
			if ((this.selProduct>=0)&&(this.products[this.selProduct]!=null)) {
				$('#name').val(this.products[this.selProduct].name);
				$('#P-price').val(this.products[this.selProduct].price);
				$('#cat').val(this.products[this.selProduct].cat);
				$('#addProductDialog').dialog('option','buttons',{
					Cancella: function() {
						var name=m.products[m.selProduct].name;
						if (m.selProduct>=0) m.products.splice(m.selProduct,1);
          				$(this).dialog( "close" );
						m.selProduct=-1;
						$.ajax({
							url:'backend.php?delete='+name,
							dataType:'json',
							success:function(data) {
								m.updateW(data);
							}
						})
						m.displayProducts();
        			},
        			"Edit": function(){
						var data={
							name:$('#name').val(),
							price:$('#P-price').val(),
							cat:$('#cat').val()
						};
						var name=m.products[m.selProduct].name;
						m.products[m.selProduct]=data;
						m.displayProducts();
						$.ajax({
							url:'backend.php?edit='+name,
							data:{products:data},
							dataType:'json',
							method:'post',
							success:function(data) {
								console.log(data);
							}
						});
						$(this).dialog( "close" );
				}});
				$('#addProductDialog').dialog('open');
			}
			else console.log('il prodotto selezionato non esiste');
		}
		else console.log('nessun prodoto da editare');
	}
	addProd() {
		$('#name').val(null);
			$('#P-price').val(null);
			$('#cat').val(null);
			$('#addProductDialog').dialog('option','buttons',{
        "Aggiungi": function(){
			var data={
				name:$('#name').val(),
				price:$('#P-price').val(),
				cat:$('#cat').val()
			};
			m.addProduct(data);
			$(this).dialog( "close" );
		}
        
      });
			$('#addProductDialog').dialog('open');
	}
	addProduct(data) {
		console.log('data',data);
		if ((data!=null)&&(data.name!=null)&&(data.cat!=null)) {
			this.products.push(data);
			$.ajax({
				url:'backend.php?add='+data.name,
				data:{products:data},
				dataType:'json',
				method:'post',
				success : function(data) {
				console.log('data',data);
				m.weightDisplay.text(data.weight+" KG");
				m.messageDisplay.text(data.message);
				m.subTotDisplay.html((data.weight*$('#price').val())+' &euro;');
			}
			});
		}
		this.displayProducts();
	}
	displayProducts() {
		var temp={none:[]};
		var category;
		for (var i=0;i<this.products.length;i++) {
			category=this.products[i].cat=="" ? 'none' : this.products[i].cat;
			if (temp[category]==null) {
				temp[category]=[];
			}
			this.products[i].id=i;
			temp[category].push(this.products[i]);
		}
		var html='';
		for (var cat in temp) {
			html+='<div class="category">'+ (cat=='none'? '<span>non categorizzati</span>':'<span>'+cat+'</span>');
			for (var i in temp[cat])
				html+='<div class="button products ui-widget ui-button ui-corner-all" id="prod'+temp[cat][i].id+'">'+temp[cat][i].name+'</div>';
			html+='</div>';
		}
		//console.log(html);
		$('#products div span').html(html);
		$('.products').removeClass('ui-state-active');
		$('#prod'+this.selProduct).addClass('ui-state-active');
		$('.products').on('click',function(){
			var id=$(this).attr('id').substr(4);
			m.selectProd(id);
			$('.products').removeClass('ui-state-active');
			if (m.selProduct!=-1) $(this).addClass('ui-state-active');
			
		});
	}
	selectProd(id) {
		if (this.products[id]!=null) {
			if (this.selProduct!=id) {
				this.selProduct=id;
				$('#price').val(this.products[id].price);
			}
			else {
				this.selProduct=-1;
				$('#price').val(0);
			}
		}
		this.refresh();
	}
	operator(id) {
		this.refresh();
		if (this.operators.includes(id)) {
			this.selectedOp=id;
			this.count.changeOperator(id);
			$('#operator div').removeClass('enabled ui-state-active');
			$('#op'+id).addClass('ui-state-active');
			//@todo so something
		}
			
	}
	zero(){
		$.ajax({
			url:'backend.php?setZero=1',
			dataType:'json',
			success:function(data) {
				m.updateW(data);
			}
		});
	}
}
class count {
	_data=[[],[]];
	_current=[];
	_operator=1;
	_history=null;
	_display=$('#count table')[0];
	_tot=[0,0];
	_totchange=[true,true];
	constructor(history,op=1) {
		if (history instanceof History) 
			this._history=history;
		else throw new ReferenceError("history must be a history instance");
		this._operator=op;
		this._current=this._data[this._operator];
	}
	get len() {
		return this._current.length;
	}
	get tot() {
		var tot=0;
		if (this._totchange) {
			for (let i=0;i<this._current.length;i++) {
				tot+=this._current[i].tot*1;
			}
			this._tot[this._operator]=tot;
			this._totchange[this._operator]=false;
		}
		else tot=this._tot[this._operator];
		return tot;
	}
	changeOperator(op) {
		this._operator=op;
		if (this._data[this._operator]==null) this._data[this._operator]=[];
		this._current=this._data[this._operator];
	}
	add(item) {
		this._current.push(item);
		this._totchange[this._operator]=true;
	}
	remove(i) {
		this._current.splice(i,1);
		this._totchange[this._operator]=true;
	}
	set(data) {
		this._current=data;
	}
	display() {
		while (this._display.rows.length>1)
			this._display.deleteRow(1);
		for (let i=0;i<this._current.length;i++) {
			let r=this._display.insertRow();
			var j=0;
			for (let k in this._current[i]) {
				if (k!='type') {
					r.insertCell(j);
					r.cells[j].textContent=this._current[i][k];
					if ((k=='price')||(k=='tot')) r.cells[j].className='euro';
					if ((k=='W')&&(this._current[i].type=='w')) r.cells[j].className='kg';
				}
				
				j++;
			}
		}
		$('#tot span').text(this.tot);
		let tr=$('#count tr');
		tr.hover(function (){$(this).toggleClass('ui-state-hover')});
		tr.on('click',function(){
			let i=$(this)[0].rowIndex;
			if ((i>0)&&confirm('cancellare la riga?')) {
				m.count.remove(i-1);
				m.count.display();
			}
		});
	}
	close() {
		if (this.len>0) {
			this._history.add({
				date:new Date().getTime(),
				operator:this._operator,
				tot:this.tot,
				data:this._current.slice()
			});
		this._data[this._operator]=[];
		this._current=[];
		this._tot[this._operator]=0;
		this._history.display();
		this.display();
		}
		
	}
}
class History {
	_data=[];
	_display=$('#history table')[0];
	
	get len() {
		return this._data.length;
	}
	
	add(item,save=true) {
		this._data.push(item);
		if (save) $.ajax({
			url:'backend.php',
			method:'post',
			dataType:'json',
			data:{history:item},
			success:function(data) {
				console.log('history add',data);
			}
		});
	}
	remove(i) {
		let id=this._data[i].date;
		this._data.splice(i,1);
		$.ajax({
			url:'backend.php?deleteHistory='+id,
			dataType:'json',
			success:function(data) {
				console.log('history delete',data);
			}
		});
	}
	get(i) {
		return this._data[i];
	}
	getAll() {
		return this._data;
	}
	display(limit=5) {
		while (this._display.rows.length>1)
			this._display.deleteRow(1);
		if (limit<0) limit=this._data.length;
		for (let i=0;i<this._data.length && i<limit;i++) {
			let r=this._display.insertRow();
			var j=0;
			for (let k in this._data[i]) {
				let v;
				if (k=='date') {
					let d=new Date(this._data[i].date*1);
					v=d.getDate()+'/'+(d.getMonth()+1)+' '+d.getHours()+':'+d.getMinutes();
				}
				else v=this._data[i][k];
				if (k!='data') {
					r.insertCell(j);
					r.cells[j].textContent=v;
					if (k=='tot') r.cells[j].className='euro';
				}
				j++;
			}
		}
		$('#history tr').on('click',function(){
			$('#historyDialog').dialog('open');
			let index=$(this)[0].rowIndex-1;
			$('#historyDialog').data('id',index);
			let display=$('#historyDialog table')[0];
			while (display.rows.length>1)
				display.deleteRow(1);
			let data=m.history.get(index);
			for (let i=0;i<data.data.length;i++) {
				let r=display.insertRow();
				var j=0;
				for (let k in data.data[i]) {
					r.insertCell(j);
					r.cells[j].textContent=data.data[i][k];
					j++;
				}
			}
			let h=$('#historyDialog span');
			let d=new Date(data.date*1);
			let v=d.getDate()+'/'+(d.getMonth()+1)+' '+d.getHours()+':'+d.getMinutes();
			h.eq(0).text(v);
			h.eq(1).text(data.operator);
			h.eq(2).text(data.tot);
			/**/
 		}).hover(function (){$(this).toggleClass('ui-state-hover')});;
	}
}
var m;
$(function(){
	m=new main();
	$('.button:not(.ui-state-disabled)').button();
	$('.button.ui-state-disabled').button({disabled: true});
	
	$('.enabled').addClass('ui-state-active');
	$('#addProductDialog').dialog({autoOpen: false,buttons: {
		Cancella: function() {
          $(this).dialog( "close" );

        },
        "Aggiungi": function(){
			data={
				name:$('#name').val(),
				price:$('#P-price').val(),
				cat:$('#cat').val()
			};
			m.addProduct(data);
			$(this).dialog( "close" );
		}
        
      }});
	$('#historyDialog').dialog({autoOpen: false,buttons: {
		Cancella: function() {
			let i=$(this).data('id');
			m.history.remove(i);
			m.refresh();
            $(this).dialog( "close" );
			
        },
        "edit": function(){
			let i=$(this).data('id');
			if ((m.count.len==0)||(confirm('cancellare il conto corrente?'))) {
				m.count.set(m.history.get(i).data);
				m.history.remove(i);
			}
			$(this).dialog( "close" );
			m.refresh();
		}
        
      }
	});
	$('#item').dialog({
		autoOpen: false,
		buttons: {
			aggiungi: function (){
				let n=$(this).find('input').val();
				m.addCount('i',n);
				$(this).dialog('close');
			}
		}
	});
});
