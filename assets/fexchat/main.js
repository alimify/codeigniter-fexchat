(function(){
				const msgNewest =  document.querySelector('main#mRoot')
				msgNewest.scrollTo(0,msgNewest.scrollHeight)
        	})();
        	( function(){
        		const initialHeights = []
        		var airMode = true
	            $('#summernote').summernote({
	                toolbar: false,
	                height: 40,
	                disableResizeEditor: true,
	                tooltip: null,
	                popover: false,
	                callbacks:{
	                	onFocus: e=>{
	                		$('#mSendBtn').addClass('active')
	                	}
	                }
	            })
	            $('.note-editable').focusout(e=>{
	            	$('#mSendBtn').removeClass('active')
	            })
	            var jobListPopUp_isOpen = false;
	            //Menu side bar
	            $('#parent').on('click','.jobListPopUp',function (e) {
	             	const parentHeight = e.delegateTarget.clientHeight
	             	const currentX = e.originalEvent.screenX
	             	const currentY = e.originalEvent.screenY - 109
            		if ( currentY >( parentHeight - 148 ) ) {
            			let y = currentY - 144
            			$('.f-popup.pop-dialog').css({
	            			top: y + 'px',
	            			left: currentX + 'px'}).addClass('is-opendown').removeClass('is-opentop')
            			jobListPopUp_isOpen = true
            		}else{
            			$('.f-popup.pop-dialog').css({
	            			top: currentY + 'px',
	            			left: currentX + 'px'
            			}).addClass('is-opentop').removeClass('is-opendown')
            			jobListPopUp_isOpen = true
            		}
            		$('.f-popup.pop-dialog>span').click(function(){
            			let a = $('.f-popup.pop-dialog')
            			a.hasClass('is-opendown')? a.removeClass('is-opendown') : a.removeClass('is-opentop')
            		})
            	})
            	$('.f-popup.pop-dialog li').click(e=>{
            		$('.f-menu-siderbar').toggleClass('f-is-open')
            	})
	            $('#f-menu-siderbar-close').click(()=> $('.f-menu-siderbar').toggleClass('f-is-open'))
	        })();

           
	       	
	        (function (argument) {

	        	function getEle(ele){
	        		return document.querySelector(ele)
	        	}
	        	function on(ele,event,callback) {
	        		return ele.addEventListener(event,callback)
	        	}
	       		const upload = getEle('#upload')
	       		on(upload,'click',e=>{
	       			(getEle('div input[name=upload]')).click()
	       		})
	       		
	           
	        	let a = getEle('.note-editable.panel-body')
	        	const eRoot = getEle('footer#eRoot') //Editor Component
	        	const mRoot = getEle('main#mRoot') //Message display component
	        	const mSendBtn = getEle('#mSendBtn')
	        	mRoot.scrollTo(0,mRoot.scrollHeight)
	            on(a,'paste', e=> {
	            	let initialHeight = a.clientHeight
	            	if( initialHeight >= 92)return
	        		mRoot.style.height = mRoot.clientHeight - 90 +'px'
	        		eRoot.style.height = eRoot.clientHeight + 91 +'px'
	        		a.style.height = '132px'

	            })

	            on(a,'keyup', e=>{
	        		let initialHeight = parseInt(e.target.style.height)
	        		if( initialHeight >= 102) return
	            	// else if(e.target.scrollTop >= 10)
		            mRoot.style.height = mRoot.clientHeight - e.target.scrollTop +'px'
		            eRoot.style.height = 1+eRoot.clientHeight + e.target.scrollTop +'px'
		            a.style.height = initialHeight + e.target.scrollTop +'px'
	            })
	        })();