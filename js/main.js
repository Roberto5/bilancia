class main {
	operators=[1,2];
	selectedOp=1;
	weightDisplay=null;
	messageDisplay=null;
	constructor() {
		this.weightDisplay=$('#weight');
		this.messageDisplay=$('#message');
		this.weightDisplay.on('click',function(){m.refresh();});
		this.refresh();
	}
	refresh(option={}) {
		
		$.ajax({
			url:"backend.php",
			dataType:'json',
			data:option,
			success:function(data) {
				console.log('data',data);
				m.weightDisplay.text(data.weight+" KG");
				m.messageDisplay.text(data.message);
			}
		});
	}
	operator(id) {
		this.refresh();
		if (this.operators.includes(id)) {
			this.selectedOp=id;
			$('#operator div').removeClass('enabled');
			$('#op'+id).addClass('enabled');
			//@todo so something
		}
			
	}
}
var m;
$(function(){
	m=new main();
});
