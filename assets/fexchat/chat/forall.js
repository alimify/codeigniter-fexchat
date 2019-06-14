    /*
    -- Chat Service Done By Abdul Alim Jewel 
    */


sendToServer(20, {job: job,room: room,roomKey: roomKey});
setSession("active_room", room);
setSession("active_room_token",roomKey);
setSession("active_room_job",job);
writeOnroom(false);


listenServer(2, data => {clearTimeout(oldMessageChannelTimer);
                        oldMessageChannelTimer = setTimeout(() => {writeOnroom(true);$("#mRoot>div").slice(2).remove();aSelector(".view-more").style.display = "";aSelector(".spinner-for-msg").style.display = "none";var initialmsg = '';
                        data.forEach (e => { initialmsg +=  e.onlyDate ? `<div class="date"><span class=" tag">${e.onlyDate}</span></div>` : `${e.messageType == 1 ? messageConvert(e) : `<div class="f-msg ${userCss(e.userId)}"><p>${e.messageText}</p><time>${e.userId != userId && getSession("room_type") == 2 ? `<span>${e.userName}, </span>` : ""}${timeCovertToLocal(e.messageTime)}</time></div>`}` });
                        $('#mRoot').append(initialmsg);scrollBottom("#mRoot");
    }, 0);
});
listen('keydown', aSelector('#editor'), event => {
                clearTimeout(typingTimer);
                typingTimer = setTimeout( ()=> {
                    sendToServer(15, {
                        type: true
                    });
                }, doneTypingInterval);
                if (event.which === 13 && event.shiftKey === false && getSession('onpress_enter')) {
                    sendToServer(21, {
                        message: getEmojiFromInput(stripTags(event.target.value)),
                        type: 0
                    });
                    event.target.value = "";
                    event.preventDefault();
                }
            });
listen('keyup', aSelector('#editor'), event => {
                clearTimeout(typingTimer)
                typingTimer = setTimeout( () =>{
                    sendToServer(15, {
                        type: false
                    });
                }, finalDoneTypingInterval);
            });
listen('click', aSelector("#mSendBtn"), () => {
                var messageField = aSelector('#editor');
                sendToServer(21, {
                    message: getEmojiFromInput(stripTags(messageField.value)),
                    type: 0
                });
                messageField.value = "";
            });
listenServer(0, data => {
                    var newMessageData = data.messageType == 1 ? messageConvert(data) : '<div class="f-msg ' + userCss(data.userId) + '"><p>' + data.messageText + '</p><time>' + timeCovertToLocal(data.messageTime) + '</time></div>';
                    $('#mRoot').append(newMessageData);
                    scrollBottom("#mRoot");
            });
listenServer(1, data =>{
                    if (data.messageType == 1) {
                        var theMessage = data.messageText.split(","),
                            select = aSelector(`#${theMessage[1]}`);
                        if (theMessage[0] == 'image') {
                            aHiding(`#${theMessage[1]} #progress`);
                            select.classList.replace('uploading-image', 'uploaded-image');
                            select.style.backgroundImage = `url(${base_url}uploads/fexchat/${theMessage[3]})`;
                            aSelector(`#${theMessage[1]} #spinner`).innerHTML = `<div class="view" data-src="${base_url}uploads/fexchat/${theMessage[3]}">View</div>`;
                            aSelector(`#${theMessage[1]} .blur`).style.backgroundImage = '';
                            select.parentElement.children[1].innerHTML += `${timeCovertToLocal(data.messageTime)} &nbsp;<span class="mdi mdi-check"> </span>`;
                        } else {
                            aSelector(`#${theMessage[1]}`).innerHTML = `<i class="fa fa-file-o"></i>`;
                            select.parentElement.parentElement.children[1].innerHTML += `${timeCovertToLocal(data.messageTime)}&nbsp;<span class="mdi mdi-check"> </span>`;
                        }
                    } else {
                        var ownMessageData = '<div class="f-msg ' + userCss(data.userId) + '"><p>' + data.messageText + '</p><time>' + timeCovertToLocal(data.messageTime) + '&nbsp;<span class="mdi mdi-check"> </span></time></div>';
                        $('#mRoot').append(ownMessageData);
        }
     scrollBottom("#mRoot");
});
listen('click',aSelector("#mRoot>.view-more"),function() {aSelector("#mRoot>.view-more").style.display = "none";aSelector("#mRoot>.spinner-for-msg").style.display = "";sendToServer(3, {page: "loadingpage" }); });
listenServer(3, function(data) {clearTimeout(moreMessageChannelTimer);
                              moreMessageChannelTimer = setTimeout(function() {
                             aSelector("#mRoot>.view-more").style.display = !data ? `none` : ``;
                             aSelector("#mRoot>.spinner-for-msg").style.display = "none";
                             var moremsgs = '';
                             data.forEach (e => { moremsgs += e.onlyDate ? `<div class="date"><span class=" tag">${e.onlyDate}</span></div>` : e.messageType == 1 ? messageConvert(e) : `<div class="f-msg ${userCss(e.userId)}"><p>${e.messageText}</p><time>${timeCovertToLocal(e.messageTime)}</time></div>`});
                             $(moremsgs).insertAfter("#mRoot>div:nth-child(2)");
    },0);
});

listenServer(30,d => {
writeOnroom(false);
})
listenServer(31,d => {
if(getSession("room_type")){writeOnroom(true);}
})