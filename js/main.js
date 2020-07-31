class main {
	operators=[1,2];
	selectedOp=1;
	constructor() {
		
	}
	operator(id) {
		
		if (this.operators.includes(id)) {
			this.selectedOp=id;
			$('#operator div').removeClass('enabled');
			$('#op'+id).addClass('enabled');
			//@todo so something
		}
			
	}
}
var m=new main();