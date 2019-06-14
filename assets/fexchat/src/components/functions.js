
function toggleDisplay(ele, display = 'block') {
        try {
            return ele.style.display = ele.style.display === display ? 'none' : display;
        } catch (error) { }
        
    }
function displayNone(ele) {
    try {
        return ele === undefined ? '' : ele.style.display = 'none';
    } catch (error) {}
        

    }
function display(ele) {
    try {
        return ele === undefined ? '' : ele.style.display = 'block';
    } catch (error) {}
        
    }

function hide(e, ...arg) {
    try {
        if (e.target == arg[0]) {
            toggleDisplay(arg[1]);
        } else {
            if (e.target != arg[1]) {
                displayNone(arg[1]);
            }
        }
    } catch (error) {}
        
    }
function loopThrough(e, className) {
    try {
        var r = '';
        $(className).each(function (index, el) {
            if (e.target === el) {
                r = el;
            }
        });
        return r;
    } catch (error) {}
        
    }
function show(a, b, t) {
    try {
        if (t === undefined || false) {
            $(a).on('click', e => $(b).show());
            return;
        }
        $(a).on('click', e => toggleDisplay(_$(b)));
    } catch (error) {}
        
    }

function jHide(a, b) {
    try {
        $(a).on('click', e => $(b).hide());
    } catch (error) {}
        
    }
function swapClass(e, ele, classToSwap) {
        //ele === element
        //className === element with the class name to attach event on 
        //class to swap  
        try {
            $(ele).each(function (index, el) {
                if (e !== el && el.classList.contains('active')) {
                    el.classList.remove(classToSwap)
                } else {
                    e === el ? el.classList.add(classToSwap) : '';
                }
            })
        } catch (error) {}
        
    }
  function on(event, ele, callback) {
       try {
           if (ele.length) {
            ele.forEach(element => {
                element.addEventListener(event, callback);
            });
            return; 
        }
        return ele.addEventListener(event, callback);
       } catch (error) {}
        
    }
    /* 
    *Element Selector
    */
const  _$ = function(ele,singular = false) {
        if (singular) {
            return document.querySelectorAll(ele);
        }
        return document.querySelector(ele);
    },
   
 css = (ele,styles)=>{
         for(let prop in styles){
             ele.style.cssText += prop+' :'+styles[prop];
         }
    },

    emojiToggle = function (e) {
        let target = _$('.emoji-container');
        toggleDisplay(target);
        var me = _$('#emojiToggle i').classList;
        
        const tF = () => {
            me.toggle('fa-smile-o');
            me.toggle('fa-times');
            me.toggle('active');
        }
        
        
        if (target.style.display !== 'none') {
            return tF();
        }
        return tF();
    },

    toggleTwo = function (display = 'block',toggler,target,multi = false) {
        if (multi) {
            $('body').on('click',toggler,function () {
                toggleDisplay(_$(target),display);
            }); 
        }else{
            $('body').on('click', toggler,function () {
                toggleDisplay(_$(target),display);
            });
        }
        
    };  