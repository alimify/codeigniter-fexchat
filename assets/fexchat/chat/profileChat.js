    /*
    -- Chat Service Done By Abdul Alim Jewel 
    */
setSession("onpress_enter",true);
$("body").on("click",".f-file",function() {
let link = this.getAttribute("data");
link ? window.open(link,"_blank") : ``;
});
$('body').on('click','.view',function (e) {
	let link = this.dataset.src;
	link ? window.open(link,"_blank") : ``;
})