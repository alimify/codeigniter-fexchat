/*

* This Chat Design and Frontend work was done by Akuma Isaac Akuma under ExcellentBridge Technologies

* 2017  

*/



/*

* Scroll the message display panel to bottom onload.  

*/



const msgNewest = function(){

	 let n = document.querySelector('main#mRoot');
	 try {
		 n.scrollTo(0, n.scrollHeight);
	 } catch (error) {
		 
	 }

	

},



/*

* Grab Emoji pattern from input box an convert it to img emoji with input value 

*/

getEmojiFromInput = function (e) {

	let val = e.split(' ');



	var nVal = [],



	makeImg = function (i) {

		var emo,

		catStr = ['smiley_and_people', 'flags', 'animal_and_nature', 'food_and_drink', 'activities', 'travel_and_places', 'objects', 'symbols'],

		caty = [smiley_and_people,flags,animal_and_nature,food_and_drink,activities,travel_and_places,objects,symbols];

		// Identify the categories the emoji belongs to and find the emoji index

		for (const key in emoji_categories) {

			catStr.forEach((cat,index)=>{

				if (key == cat) {

					caty[index].map(ele => {

						if (ele.pattern === i) {

							return emo = ele;

						}

					});

				}

			});

			

		}

		//Create the emoji	

		let img = `<img src="/assets/fexchat/emojis/images/${emo.image}" height="24px" width="24px" 

		alt="${emo.name === 'null' ? emo.short_name : emo.name}" data-pattern="${emo.pattern}">`;

		return img;

	};

	

	val.map((e,i)=>{

		let expr =/^:[a-z]*[0-9]*:$/;

		if (expr.test(e)) {

			nVal.push(makeImg(e));



		}else{

			nVal.push(e);

		}

	});

	

	return nVal.join(' ');

};

msgNewest();



/*

* Submit message  

*/

/*on('click', _$('#mSendBtn'), function (params) {

	let payLoad = _$('#editor').value,

	m = getEmojiFromInput(payLoad);

	let msg = `<div class="f-msg me" id="3">

						<div>${m} </div>

						<time>08:3AM&nbsp;<span class="mdi mdi-check"> </span></time>

					</div>`;

	$('#mRoot').append(msg);

	msgNewest();

	_$('#editor').value = '';

});*/



/* 

 *Contract's Sidebar Toggler 

*/

/*$('.jobListPopUp').click(e=>{

	$('.f-menu-siderbar').toggleClass('f-is-open');

});

$('#f-menu-siderbar-close').click(()=> $('.f-menu-siderbar').toggleClass('f-is-open'));*/



/* 

 * Chat history and contact list toggler

*/

$('.button.a').click(function(e){



	swapClass(this,'.button.a','active');

	let chatList = _$('#chatList');

	let contactList = _$('#contactList');

	if (_$('#contactListToggle').classList.contains('active')) {

		display(contactList);

	} else {

		displayNone(contactList);

	}	            	

	_$('#chatListToggle').classList.contains('active')?display(chatList):displayNone(chatList);



});





// $('.content .dropdown-item').click(function (e) {

// 	$(this).parent().prev('.f-dropdownTrigger').text(this.innerText);

// 	$('.content .dropdown-item').each((index, el)=> {

// 		el.classList.contains('active')? 

// 		el.classList.remove('active'):

// 		this === el? el.classList.add('active'):'';

// 	});

// });

		



on('click',_$('.add-to-group-dismiss'),function () {



	_$('.add-to-group').style.display = 'none';

});

on('click', _$('.f-modal-dismiss',true), function () {



	[..._$('.f-modal', true)].forEach(element => {

		element.style.display = 'none';



	});

});



toggleTwo('block','#out-of-office-toggle', '#out-of-office-modal');

toggleTwo('block','#add-to-group-display','.add-to-group');

toggleTwo('block','#mainSettingModal','#settingModal');

toggleTwo('block','#newGroup','#newGroupModal');

toggleTwo('block','#mainSetting', '.mainSetting-dropdown');

toggleTwo('block','.view','#viewImageModal',true);

toggleTwo('block', '#group-info', '.group-members');

toggleTwo('flex','.group-chat figure', '#group-info-modal');

toggleTwo('flex', '.single-chat figure', '#user-info-modal');

toggleTwo('flex', '.view-user-profile', '#user-info-modal');

/*

* Listen close all popup when another target is being click  

*/

$(document).on('click', function (event) {

	if (!$(event.target).closest($('.header.box .media')).length) {
		$('.group-members').hide();
	}
	if (!$(event.target).closest('.add-to-group-parent').length) {
		$('.add-to-group').hide();
	}
	if (!$(event.target).closest('.mainSetting-parent').length) {
		$('.mainSetting-dropdown').hide();
	}
	if (!$(event.target).closest('.f-dropdown').length) {
		$('.f-dropdown').children('.content').hide();
	}
});



/*

* View Image

*/

$('body').on('click','.view',function (e) {

	let src = this.dataset.src;

	_$('#modalDisplay>main>#gallery-display>img').src = src;

});



/*  

* Drop down dialog

*/

on('click', _$('.f-dropdownTrigger',true),function (params) {

	

	const trigger = this,

		  content = this.nextElementSibling

	

	toggleDisplay(content)



	on('click',[...content.children],function (e) {

		e.preventDefault()

		if (this === e.target || e.target.parentElement === this) {

			if (!(this.classList.contains('active'))) {

				[...this.parentElement.children].forEach(e=>e.classList.remove('active'))

				this.classList.add('active')

				trigger.innerText = this.innerText

			}

		}

		displayNone(content)

	})



})

	







/*

// EDITOR BOX 

*editor = input box

*eRoot = editor parent container

*mRoot = Message display container

*/



const a = _$('#editor'); 

a.value = '';

const eRoot = _$('footer#eRoot');

const mRoot = _$('main#mRoot'); 

const mSendBtn = _$('#mSendBtn');



/* 

*Create an Object that will store the very first Height values

*of the input box it's parent and previous sibling.

*Initial Height or Original Height

*/

var IH = { 

	editor : 0,

	main: 0,

	footer: 0,

	added: false,

	editorScroll:0

}

/* 

*On very first focus on the input box 

*set the Initial Heights..   

*/

on('keydown',a, function() {

	let e = this,

	b = e.scrollHeight;

	if (IH.added === false) {

		IH.editor = e.scrollHeight;

		IH.main = mRoot.clientHeight;

		IH.footer = eRoot.clientHeight;

		IH.added = true;

	}

});

/*

*Once the input box is empty reset all height to it 

*Original Height 

*/

const emptyEditor = function(){

	if (!this.value) {

		mRoot.style.height = IH.main + 'px';

		eRoot.style.height = IH.footer + 'px';

		this.style.height = IH.editor + 'px';

		this.style.overflowY = 'hidden';

	}

}



/*

*The Auto-Resize function based on the input box scrollHeight  

*/

function autosize() {

	var el = this;

	if (el.scrollHeight === IH.editor || el.clientHeight >= 140) {

		if (el.clientHeight >= 140) {

			// el.style.overflowY = 'scroll';

		}

		return;

	}

	

	el.style.cssText = 'height:auto; padding:0';

	el.style.cssText = 'height:' + el.scrollHeight + 'px';

	mRoot.style.height = (IH.main + 20) - el.scrollHeight + 'px';

	eRoot.style.height = (IH.footer - 20) + el.scrollHeight + 'px';

	

}

// on(a,'paste',autosize);





/* 

// Instantiate The Emoji Panel Headers and attached a click event to it,

// Once it's been clicked sum it's immediate parent children and listen 

// the event target..

*/



on('click', _$('.emoji-header>div', true),function(e) {

	const siblings = this.parentElement.children;

	[...siblings].forEach((element,index)=> {

		if(element.classList.contains('active')){

			if (e.target === element) {

				// console.log('clicked me')

			} else if(e.target.parentElement === element){

				// console.log('clicked child')

			}else{

				const changeEmoji =	()=>{

					const targetPanel = this.parentElement.dataset.target;

					i = [...siblings].indexOf(this),

					panelIn = _$('.'+targetPanel).children[i],

					panelOut = _$('.' + targetPanel).children[index];

					element.classList.remove('active');

					this.classList.add('active');

					panelIn.classList.toggle('emoji-active');

					panelOut.classList.toggle('emoji-active');

				}

				if (e.target === this) {

					changeEmoji();

				} else if (e.target.parentElement === this) {

					changeEmoji();

				}

			}



		}

	});

});



/*

 * File Upload and Download  

*/

//Abort Image Upload

const abortUpload = function () {

	let pr = this.parentElement.nextElementSibling;

	displayNone(pr);

	this.parentElement.innerHTML = `<span uk-icon="icon: warning"></span><div style="font-size:12px;z-index:22"> Canceled</div>`;

},



//Abort Image Download

abortDownload = function (e) {

	let pr = this.parentElement.nextElementSibling;

	displayNone(pr);

	this.parentElement.innerHTML = `<span class="mdi mdi-cloud-download download"></span>`;

},



//Download Image

downloadImage = function (e) {

	let pr = this.parentElement.parentElement.children.progress;

	display(pr);

	this.parentElement.innerHTML = `<div uk-spinner="ratio: 1"></div><span uk-icon="icon: close" class="downloading"></span>`;

},



//Upload Image

uploadImage = function (e) {

	var src,

	imageFile = [...this.files],linkId,

	//Create a unique id which will be used to update this element on success || failure

	imgName = imageFile[0].name.split('.');

	imgName = imgName[0];



	//We don't need the ID to be to long so if it's morethan five characters reduces it to five.

	if (imgName.split('').length > 5) {

		linkId = imgName.substring(0, 4)+'_'+Date.now();

	}else{

		linkId = imgName+ '_' + Date.now();

	}



	imageFile.map(e=>{

		src = window.URL.createObjectURL(e);

	});

	let = template = `<div class="f-msg me f-file">

                            <div class="uploading-image" id="${linkId}">

                                <div class="blur" style="background-image: url(${src});"></div>

                                <div class="inner-content">

                                    <div id="spinner">

                                      <div uk-spinner="ratio: 1"></div> 

                                      <span uk-icon="icon: close" class="downloading"></span>

                                    </div>

                                    

                                    <div id="progress">

                                        <progress class="uk-progress" value="0" max="100"></progress>

                                    </div>

                                </div>

                            </div>

                            <time>08:3AM</time>

						</div>`;



	//Appand a little preview					

	$('#mRoot').append(template);

	msgNewest();

	//This represent a AJAX request to upload the image

	var v = _$(`#${linkId} #progress progress`),

	progress = setInterval(e => {

		v.value = parseInt(v.value) + 10;

		

	}, 1000),



	uploaded = setTimeout(function() {

		var me = _$(`#${linkId}`);

		//To it to database if true || false update this queries below correctly

		me.classList.replace('uploading-image', 'uploaded-image');

		me.style.backgroundImage = `url(${src})`;

		_$(`#${linkId} #spinner`).innerHTML = `<div class="view" data-src="${src}">View</div>`;

		_$(`#${linkId} .blur`).style.backgroundImage = '';

		me.parentElement.children[1].innerHTML += `&nbsp;<span class="mdi mdi-check"> </span>`;

		if (v.value >= 100) {

			clearInterval(progress);

			clearTimeout(uploaded);

			$(`#${linkId} #progress`).hide();

		}

	}, 10010);



	



},

galleryDisplay = function (e) {

	let src = this.dataset.src,

		target = _$('#gallery-display img');

	target.src = src;



},

typing = function () {

	/*_$('.typing').classList.add('active');*/

},



/* 

* Toggle the Chat header for either group chat or one to one chat

* 

*/

groupChat = function (e) {



	let group = _$('.f-main-header')



	this.classList.contains('group')? group.classList.contains('group-chat')?''

		: group.classList.replace('single-chat', 'group-chat'): group.classList.replace('group-chat', 'single-chat')



	if (!(this.classList.contains('active'))) 

		[...this.parentElement.children].forEach(element=>{

			element !== this? element.classList.remove('active') : element.classList.add('active')

		})

	

},

searchMembers = function () {

	const val = this.value.toLowerCase(),

		members = _$('.group-members strong>a',true);

	let match = members.forEach((ele,i)=>{

		if(!(ele.text.toLowerCase().match(val))){

			_$('.group-members div.box',true)[i].style.display = 'none'

		}else{

			_$('.group-members div.box', true)[i].style.display = 'block'

		}

	});



},

mainSearch = function () {

	display(_$('#searchDisplay'));

}

/* 

*Group Info Setting 

*/

gFS = {

	prevName: '',

	added: false

};

on('keyup',_$('#mainSearch'),function () {

	this.value.trim() === '' ? displayNone(_$('#searchDisplay')):'';

});

on('focusout', _$('#mainSearch'), function () {

	this.value.trim() === '' ? displayNone(_$('#searchDisplay')) : '';

});

/*on('click',_$('#is-createGroup'),function (params) {

	_$('.f-modal-dismiss',true).forEach(ele=>ele.click())

	UIkit.notification({ message: 'Group Created', pos: 'top-center', status: 'success' });

})*/

on('click', _$('.edit>span#edit-edit'), function (e) {

	

	let input = this.previousElementSibling

	gFS.added?'': gFS.prevName = input.value

	input.readOnly = false;

	input.select(input);

	this.parentElement.classList.toggle('active')

})

on('click', _$('.edit>span#edit-cancel'),function (e) {

	let input = this.parentElement.children[0]

	input.value = gFS.prevName

	input.readOnly = true;

	this.parentElement.classList.toggle('active')

})

on('click', _$('.edit>span#edit-save'), function (e) {

	gFS.added = false

	let input = this.parentElement.children[0]

	input.readOnly = true;

	this.parentElement.classList.toggle('active')

})

on('click',_$('.switch',true),function (e) {

	this.classList.toggle('on')

	let n = this.nextElementSibling

	

	n.innerHTML = this.classList.contains('on')? '&nbsp;On' : '&nbsp;Off'

});



(function () {

	_$('.group-members .box',true).length < 20? displayNone(_$('.group-members input')):display(_$('.group-members input'))

})();

/* 

* Event Listers 

*/



on('keyup', a, emptyEditor);

on('keydown', a, autosize);



/*on('input', a, typing);

on('focusout', a, () => {

	_$('.typing').classList.remove('active');

});*/

on('input', _$('#mainSearch'), mainSearch);

on('input', _$('.group-members input'),searchMembers);

on('click', _$('#emojiToggle'), emojiToggle);

on('click', _$('#imageUpload'), e => _$('div input[name=uploadImage]').click());

on('click', _$('#allFileUpload'), e => _$('div input[name=uploadAll]').click());

//on('change', _$('#upload input[name=uploadImage]'),uploadImage)

$('#mRoot').on('click', '.me #spinner>span', abortUpload); 

$('#mRoot').on('click', '.you #spinner>.downloading', abortDownload);

$('#mRoot').on('click', '.you #spinner>.download', downloadImage);

$('body').on('click','.media-body img',galleryDisplay);

$('body').on('click', '#chatList>.box', groupChat);


on('input', _$('#editor'), function (params) {
	_$('#typing').classList.add('is-typing')
})
on('focusout', _$('#editor'), function (params) { _$('#typing').classList.remove('is-typing') });
on('keyup', _$('#editor'), function (params) {
	if (this.value === '') {
		_$('#typing').classList.remove('is-typing')
	}

});

