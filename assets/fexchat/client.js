"use strict";
(function() {
    /*
    -- Chat Service Done By Abdul Alim Jewel 
    */
sessionStorage.clear();
if (socket != undefined && base_url && userId && userKey) {
var socketChannel = ["newMessageChannel", "ownMsg", "oldMsg", "moreMsg", "roomList", "roomInfo", "contactLists", "listPaging",
                "contactListPaging", "newgroup", "newGroupPagination", "createChatroomDetails", "returnResults", "searchResults",
                "sortByChannel", "typing", "groupMemberlist", "exitGroup", "roomUserProfile", "userInfo", "roomDetails", "sendMessage",
                "groupNameEdit", "groupNotification", "mediaMessage", "settingsData", "settingSuccess", "groupContactRemove"
            ];
var prevActiveRoom,currentActiveRoom;
var roomlistTimer, roomlistnotTimer, oldMessageChannelTimer, typingChannelTimer, newMessageChannelTimer, ownMessageChannelTimer, moreMessageChannelTimer,
    roomInfoTimer, contactListzTimer, searchResultsTimer, newGroupTimer, returnResultsTimer, groupMemberlistTimer, typingTimer, doneTypingInterval = 10,
    finalDoneTypingInterval = 500;
var aSelector = (a, b = false) => {return b ? document.querySelectorAll(a) : document.querySelector(a);},
    socketChannelF = a => {return socketChannel[a];},
    listen = (a, b, c) => {b.length ? b.forEach(e => {e.addEventListener(a, c)}) : b.addEventListener(a, c);return;},
    sendToServer = (a, b) => {socket.emit(socketChannelF(a), b);return;},
    listenServer = (a, b) => {socket.on(socketChannelF(a), b);return;},
    setSession = (a, b) => {sessionStorage.setItem(a, JSON.stringify(b));return;},
    getSession = a => {return JSON.parse(sessionStorage.getItem(a));},
    scrollBottom = a => {let line = aSelector(a);line.scrollTop = line.scrollHeight;return;},
    stripTags = a => {return a.replace(/[\u00A0-\u9999<>&](?!#)/gim, i => {return '&#' + i.charCodeAt(0) + ';';});},
    userCss = a => {return a === userId ? "me" : "you";},
    isActive = a => {return a === 1 ? "online" : "offline";},
    isTitle = a => {return a.type == 1 ? a.jobTitle : a.type == 2 ? a.roomTitle : "";},
    createGroupLength = (a = getSession("creategroupuser")) => {return a == null ? [] : a;},
    remove = (a, b) => {return a.filter(e => e !== b);},
    ajaxCall = () => {var ajax;try{ajax=new XMLHttpRequest()}catch(t){try{ajax=new ActiveXObject("Msxml2.XMLHTTP")}catch(t){try{ajax=new ActiveXObject("Microsoft.XMLHTTP")}catch(t){console.log("Something error....")}}}},
    checkbox_checked = (a, b = getSession("creategroupuser")) => {return b != null && b.indexOf(a) > -1 ? "checked" : "";},
    aHiding = a => {aSelector(a, true).forEach(e => {e.style.display = 'none';});return;},
    onclickDataSend = function() {var dataofclick = this.getAttribute('data').split(",");prevActiveRoom = getSession("active_room"); currentActiveRoom = dataofclick[0];
                      if (prevActiveRoom != currentActiveRoom) {setSession("active_room", dataofclick[0]);setSession("active_room_token", dataofclick[1]);setSession("active_room_job", dataofclick[2]);addActiveCss(currentActiveRoom, prevActiveRoom);aSelector(".name-bar").style.display = "none";aSelector(".view-more").style.display = "none";aSelector(".spinner-for-msg").style.display = "";writeOnroom(false);roomHeaderSelector.children[0].innerHTML = '<div class="uk-align-center"><span uk-spinner="ratio: .8"></span></div>';$("#mRoot>div").slice(2).remove();sendToServer(20, {job: dataofclick[2],room: dataofclick[0],roomKey: dataofclick[1]});}
                          prevActiveRoom = dataofclick[0];},
    nullToFalse = a => {return a == null ? false : a;},
    writeOnroom = a =>{aSelector("#eRoot").style.pointerEvents = a ? `` : "none";aSelector("#editor").disabled = a ? false : true;},
    addActiveCss = (a, b) => {if (b) {$("#" + b).removeClass("active");}
                              if (a != b) {$("#" + a).addClass("active");}
                              return;},
    unreadMsg = a => {return a > 0 ? `<span class="tag is-pulled-right noti">${a}</span>` : "";},
    changeurl = a => {window.history.pushState(null, "Messages", "/fexchat/jobroom/" + a);return;},
    roomlistHTMLF = a => {return a.type === 1 ? `<div class="box" id="${a.roomId}" data="${a.roomId},${a.token},${a.job_id}"> <article class="media"> <div class="media-left"> <figure class="image is-48x48 f-i ${isActive(a.is_active)}"> <img src="${base_url}uploads/profile/${a.oppo_image}" alt="Image"> </figure> </div><div class="media-content"> <div class="content"> <p> <strong>${a.oppo_name}</strong> <span class="is-pulled-right">${a.messageTime}</span> <br><b>${isTitle(a)}</b> <i class="mdi mdi-more is-pulled-right jobListPopUp"></i> <br><span>${a.msngrName}: ${a.msg_type == 1 ? `Sent an attachment..` : a.messageText.replace(/(<([^>]+)>)/ig, "").slice(0, 30)}</span>${unreadMsg(a.unread_msg)} </p></div></div></article> </div>` : a.type === 2 ? `<div class="box group" id="${a.roomId}" data="${a.roomId},${a.token},${a.job_id}"> <article class="media"> <div class="media-left"> <figure class="image is-48x48 f-i"> <img src="${base_url}uploads/profile/groupDefaultImage.png" alt="Image"> </figure> </div><div class="media-content"> <div class="content"> <p> <strong>${isTitle(a)}</strong> <span class="is-pulled-right">${a.messageTime}</span> <br><span>${a.msngrName}: ${a.msg_type == 1 ? `Sent an attachment..` : a.messageText.replace(/(<([^>]+)>)/ig, "").slice(0, 30)}</span> ${unreadMsg(a.unread_msg)} </p></div></div></article> </div>` : "";},
    searchlistHTMLF = a => {return `<dd> <div class="box" data="${a.room_id},${a.token},${a.job_id}"> <article class="media"> <div class="media-left"> <figure class="image is-32x32 f-i"> <img src="${base_url}uploads/profile/${a.image}" alt="Image"> </figure> </div><div class="media-content"> <div class="content"> <p> <strong>${a.name} </strong><br><b>${isTitle(a)}</b><br/><span>${a.message.replace(/(<([^>]+)>)/ig, "")}</span> </p></div></div></article> </div></dd>`;},
    fileExtension = (a, b) => {return a.indexOf(b) > -1 ? true : false;},
    messageConvert = a => {var msgStr = a.messageText.split(",");return msgStr[0] == 'image' ? `<div class="f-msg ${userCss(a.userId)} f-file" value="${a.userId},${a.messageId}"> <div class="uploaded-image" style="background-image: url(${base_url}uploads/fexchat/${msgStr[3]});"> <div class="blur"></div><div class="inner-content"> <div id="spinner"> <div class="view" data-src="${base_url}uploads/fexchat/${msgStr[3]}">View</div></div></div></div><time>${a.messageTime}${a.userId == userId ? `&nbsp;<span class="mdi mdi-check-all"> </span>` :``}</time> </div>` : a.userId != userId ? `<div class="f-msg you f-file" data="/uploads/fexchat/${msgStr[3]}" value="${a.userId},${a.messageId}"> <div id="f-file"> <div><i class="fa fa-file-o"></i></div><p>${msgStr[2]}</p></div><time>${a.messageTime}</time> </div>` : ` <div class="f-msg me f-file" data="/uploads/fexchat/${msgStr[3]}" value="${a.userId},${a.messageId}"> <div id="f-file"> <p>${msgStr[2]}</p><div><i class="fa fa-file-o"></i> </div></div><time>${a.messageTime}&nbsp;<span class="mdi mdi-check-all"> </span></time> </div>`;},
    mediaMsgConvert = a => {var data;if (!a.onlyDate) {data = a.messageText.split(",");}
                                     return a.onlyDate ? `<div class="date"> <h6 class="uk-text-center uk-heading-line"> <span>${a.onlyDate}</span> </h6> </div>` : data[0] == 'image' ? ` <div class="${userCss(a.userId)} f-file" value="${a.userId},${a.messageId}"> <img src="${base_url}uploads/fexchat/${data[3]}" alt="" data-src="${base_url}uploads/fexchat/${data[3]}"> <time>${a.userId != userId ? `<span>${a.userName},</span>` : ''} ${a.messageTime}</time> </div>` : data[0] == 'file' && a.userId != userId ? ` <div class="f-msg you f-file" value="${a.userId},${a.messageId}" data="/uploads/fexchat/${data[3]}"> <div id="f-file"> <div><i class="fa fa-file-o"></i></div><p>${data[2]}</p></div><time><span>${a.userName},</span> ${a.messageTime}</time> </div>` : `<div class="f-msg me f-file" value="${a.userId},${a.messageId}" data="/uploads/fexchat/${data[3]}"> <div id="f-file"> <p>${data[2]}</p><div> <i class="fa fa-file-o"></i> </div></div><time>${a.messageTime}&nbsp;<span class="mdi mdi-check-all"> </span></time> </div>`; },
    onpress_enter_active_text = a => {return a == 1 ? `Send Message` : `Add a line break`;},
    desktop_notification_active_text = a => {return a == 1 ? "All Activity" : a == 2 ? "Important Activity only" : a == 3 ? "Nothing" : ``},
    setting_message_interval_active_text = a => {return a == 1 ? "Immediate" : a == 2 ? `Every 15 minutes` : a == 3 ? `Once an hour` : a == 4 ? `Once a Day` : a == 5 ? `Only send when offline` : ``;};
sendToServer(19, {userId: userId,userKey: userKey, timeZone : moment.tz.guess()});
sendToServer(20, {job: job,room: room,roomKey: roomKey});
setSession("active_room", room);
setSession("active_room_token",roomKey);
setSession("active_room_job",job);
writeOnroom(false);

listenServer(4, d => {clearTimeout(roomlistTimer);
                     roomlistTimer = setTimeout(function() {$("#chatList>div").slice(1).remove();var data = '';
                     if(!d){data += `<div>Nothing Founds....</div>`}else{d.forEach (e => {data += roomlistHTMLF(e) });}
                     $('#chatList').append(data);addActiveCss(getSession("active_room"), false);
    },0);
});
listen('click',aSelector('#chatList>.f-dropdown>.content>.dropdown-item',true),function(){ sendToServer(14, {sort: parseInt(this.getAttribute('data')) }); });
listenServer(2, data => {clearTimeout(oldMessageChannelTimer);
                        oldMessageChannelTimer = setTimeout(() => {writeOnroom(true);$("#mRoot>div").slice(2).remove();aSelector(".view-more").style.display = "";aSelector(".spinner-for-msg").style.display = "none";var initialmsg = '';
                        data.forEach (e => { initialmsg +=  e.onlyDate ? `<div class="date"><span class=" tag">${e.onlyDate}</span></div>` : `${e.messageType == 1 ? messageConvert(e) : `<div class="f-msg ${userCss(e.userId)}"><p>${e.messageText}</p><time>${e.userId != userId && getSession("room_type") == 2 ? `<span>${e.userName}, </span>` : ""}${e.messageTime}</time></div>`}` });
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
listenServer(15, e =>{ aSelector("#typing").innerHTML = e.type ? `<i class="typing active">${e.typer}</i>` : ``});
listenServer(0, data => {
                    var newMessageData = data.messageType == 1 ? messageConvert(data) : '<div class="f-msg ' + userCss(data.userId) + '"><p>' + data.messageText + '</p><time>' + data.messageTime + '</time></div>';
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
                            select.parentElement.children[1].innerHTML += `${data.messageTime} &nbsp;<span class="mdi mdi-check"> </span>`;
                        } else {
                            aSelector(`#${theMessage[1]}`).innerHTML = `<i class="fa fa-file-o"></i>`;
                            select.parentElement.parentElement.children[1].innerHTML += `${data.messageTime}&nbsp;<span class="mdi mdi-check"> </span>`;
                        }
                    } else {
                        var ownMessageData = '<div class="f-msg ' + userCss(data.userId) + '"><p>' + data.messageText + '</p><time>' + data.messageTime + '&nbsp;<span class="mdi mdi-check"> </span></time></div>';
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
                             data.forEach (e => { moremsgs += e.onlyDate ? `<div class="date"><span class=" tag">${e.onlyDate}</span></div>` : e.messageType == 1 ? messageConvert(e) : `<div class="f-msg ${userCss(e.userId)}"><p>${e.messageText}</p><time>${e.messageTime}</time></div>`});
                             $(moremsgs).insertAfter("#mRoot>div:nth-child(2)");
    },0);
});
var roomHeaderSelector = aSelector(".f-main>.f-main-header>.header>.media"),
    groupInfoModal = aSelector("#group-info-modal>div"),
    groupModalNotification = groupInfoModal.children[5].children[0].children[1].children[0],
    groupModalExit = groupInfoModal.children[6].children[0].children[0].children[1];
listenServer(5, a => {clearTimeout(roomInfoTimer);
                     roomInfoTimer = setTimeout(function() {setSession("room_type",a.room_type);changeurl(getSession("active_room_job") + '/' + getSession("active_room") + '/' + getSession("active_room_token"));setSession("media_scroll_bottom", true);setSession("media_item_click",true);aSelector(".name-bar").style.display = "";
                     let  roomTypeClassSetSelector = roomHeaderSelector.parentElement.parentElement.classList,roomTypeClass = a.room_type == 1 ? `single-chat` : `group-chat`;
                     roomTypeClassSetSelector.contains(roomTypeClass) ? `` : roomTypeClassSetSelector.contains("single-chat") ? roomTypeClassSetSelector.replace("single-chat",roomTypeClass) : roomTypeClassSetSelector.replace("group-chat",roomTypeClass);
                     roomHeaderSelector.children[0].innerHTML = `<figure class="cursor image is-48x48 f-i ${a.room_type == 1 ? isActive(a.is_active) : ""} userIcon"> <img src="${base_url}uploads/profile/${a.room_type == 1 && a.image ? a.image : a.room_type == 2 ? `groupDefaultImage.png` : ""}" alt="Image"> </figure>`;
                     roomHeaderSelector.children[1].children[0].innerHTML = `${a.room_type == 2 ? a.room_title : a.room_type == 1 ? `${a.name}<small>&nbsp;${a.job_title}</small>` : ""}`;
                    let hisTime = a.hisTime ? moment().tz(a.hisTime) : false;  
                     roomHeaderSelector.children[1].children[1].children[2].innerHTML = ` | ${hisTime ? `${hisTime.format(`hh:mm A `)} ${hisTime.zoneAbbr()}, ` : ``}${a.country}`;                     if(a.room_type == 1){sendToServer(18,a.oppo_id);}else if(a.room_type == 2){
                     roomHeaderSelector.children[1].children[1].children[0].innerHTML = `<i class="mdi mdi-accounts-outline" style="font-size: 1.35em;vertical-align: text-bottom;"> </i> ${a.member} |`;
                     groupInfoModal.children[2].children[0].children[0].value = a.room_title;
                     groupInfoModal.children[3].children[0].innerHTML = `<i class="mdi mdi-accounts-outline" style="font-size: 1.35em;vertical-align: text-bottom;"> </i> ${a.member} Participants`;
                     groupInfoModal.children[4].children[0].children[1].innerHTML = `${a.admin_name}`;
                     if(a.notification){ groupModalNotification.classList.add("on"); groupModalNotification.nextElementSibling.innerHTML = "&nbsp;On"; }else{groupModalNotification.classList.remove("on");groupModalNotification.nextElementSibling.innerHTML = "&nbsp;Off"; } }
    },0);
});
listen('click',aSelector("#edit-save"),function(){ sendToServer(22,groupInfoModal.children[2].children[0].children[0].value); });
listen('click',groupModalNotification,function(){ this.getAttribute("class") == 'switch' ? sendToServer(23,false) : sendToServer(23,true); });
listen("click",groupModalExit,() => {sendToServer(17,true)})
listenServer(17,d => {aHiding(".f-modal");writeOnroom(d ? false : true);UIkit.notification({ message: d ? 'You have leaved from this room..' : `Fail to exit..`, pos: 'top-center', status: 'success' });});
$('#contactListToggle').one("click", function() {sendToServer(6, {getData: true});});
listenServer(6, d => {clearTimeout(contactListzTimer);
                    contactListzTimer = setTimeout(function() {var contactlisted = '';
                    d.forEach (e => { contactlisted += e.type === 1 && e.oppo_image && e.oppo_name ? `<div class="box" data="${e.roomId},${e.token},${e.job_id}"> <article class="media"> <div class="media-left"> <figure class="image is-48x48 f-i ${isActive(e.is_active)}"> <img src="${base_url}uploads/profile/${e.oppo_image}" alt="Image"> </figure> </div><div class="media-content"> <div class="content"> <p> <strong> ${e.oppo_name}</strong> <br><b>${e.jobTitle}</b> </p></div></div></article> </div>` : e.type === 2 && e.oppo_image && e.oppo_name ? `<div class="box" data="${e.roomId},${e.token},${e.job_id}"> <article class="media"> <div class="media-left"> <figure class="image is-48x48 f-i ${isActive(e.is_active)}"> <img src="${base_url}uploads/profile/${e.oppo_image}" alt="Image"> </figure> </div><div class="media-content"> <div class="content"> <p> <strong>${e.oppo_name}</strong> <br><b>${e.roomTitle}</b> </p></div></div></article> </div>` : ``});
                    aSelector('#contactList').innerHTML = contactlisted;
   },0);
});


 
        var searchText = aSelector('#mainSearch'),
            searchDisplaySelector = aSelector('#searchDisplay'),
            searchTimer,
            searchTyping = 10;
listen("keydown",searchText, function(event) {
            clearTimeout(searchTimer)
            searchTimer = setTimeout(function() {
                var searchValue = searchText.value,
                    searchLength = searchValue.length;
                if (searchLength > 0) {
                    searchDisplaySelector.innerHTML = `<div>Search...</div><div><span class="uk-align-center" uk-spinner="ratio: .8"></span> </div>`;
                    sendToServer(13, {
                        search: true,
                        keywords: searchValue
                    })
                } else {
                    sendToServer(13, {
                        search: false
                    })
                }
            }, searchTyping)

});

listenServer(13, function(data) {
            clearTimeout(searchResultsTimer);
            searchResultsTimer = setTimeout(function() {
var searchDataHTML = "<div>Search...</div>";
if(data){
data.forEach (e => { searchDataHTML +=   searchlistHTMLF(e); });
}else{
searchDataHTML += '<h5 style="text-align:center">No Result Found</h5>';
}
searchDisplaySelector.innerHTML = searchDataHTML;


            }, 1000);
        })


var newGroupModal = aSelector('#newGroupModal>main');
$('#newGroup').one("click", () => {sendToServer(9, {getData: true})});
listenServer(9, d => {
            clearTimeout(newGroupTimer);
            newGroupTimer = setTimeout(function() {
                var newgroupz = '';
                d.forEach (e =>{newgroupz += `<div class="box"> <article class="media"> <div class="media-left"> <figure class="image is-48x48 f-i ${isActive(e.is_active)}"> <img src="${base_url}uploads/profile/${e.oppo_image}" alt="Image"> </figure> </div><div class="media-content"> <div class="content"> <p> <strong>${e.oppo_name}</strong> <br><b>${isTitle(e)}</b> <input data="${e.oppo_id}" class="uk-checkbox uk-float-right group-member-checkbox" type="checkbox" ${checkbox_checked(e.oppo_id)}> </p></div></div></article> </div>`;});
                newGroupModal.children[5].innerHTML = newgroupz;
            }, 0);
        });
$("body").on("click",".group-member-checkbox", e => {
        var inputuser = createGroupLength();
    if(e.target.checked){ inputuser.push(parseInt(e.target.attributes.data.value)) }else{ inputuser = remove(inputuser, parseInt(e.target.attributes.data.value));}
        setSession("creategroupuser", inputuser);   
                });
listen("click",aSelector("#is-createGroup"),e => {
            var errorsOfroom = [];
            var chatroomName = newGroupModal.children[1].children[0].value;
            var chatroomUsers = createGroupLength();
            if (chatroomName.length < 5 || chatroomName.length > 50) {
                errorsOfroom.push("Name can not be less than 5 letters or can not be 50 letters");
            }
            if (chatroomUsers.length < 1) {
                errorsOfroom.push("You have to select atleast one member..");
            }
            if (errorsOfroom.length <= 0) {
                newGroupModal.children[2].innerHTML = "";
                sendToServer(11, {name: chatroomName,user: chatroomUsers});
            } else {
                var dataImplement = '';
                errorsOfroom.forEach(e => {dataImplement += `<font color="red">${e}</font><br/>`;});
                newGroupModal.children[2].innerHTML = dataImplement;
            }
});
listenServer(12, function(data) {
            clearTimeout(returnResultsTimer);
            returnResultsTimer = setTimeout(function() {
                if (data.results === true) {
                    sessionStorage.clear();
                    aHiding('.f-modal');
                    sendToServer(9, {
                        getData: true
                    })
                    newGroupModal.children[1].children[0].value = "";
    UIkit.notification({ message: 'Group Created', pos: 'top-center', status: 'success' });
                }
    },0);
});

var groupMemberlistSelector = aSelector(".group-members>div:nth-child(2)");
listen("click",aSelector("#group-info"),() => {groupMemberlistSelector.innerHTML = `<div class="uk-align-center"><span uk-spinner="ratio: .8"></span></div>`;sendToServer(16,true);});
listenServer(16,function(data){
    clearTimeout(groupMemberlistTimer);
    groupMemberlistTimer = setTimeout(function(){
    var groupMemberlistHTML = "";
        if(!data){ groupMemberlistHTML = "<div>No Member founds..</div>"}else{
   data.forEach (e =>{groupMemberlistHTML += `<div class="box"> <article class="media"> <div class="media-left"> <figure class="image is-32x32 f-i "> <img src="${base_url}uploads/profile/${e.image}" alt="Image"> </figure> </div><div class="media-content"> <div class="content"> <p> <strong> <a href="javascript:void(0)" class="view-user-profile" data="${e.user_id}">${e.name}</a> </strong> </p></div></div></article> </div>`; });
        }
   groupMemberlistSelector.innerHTML = groupMemberlistHTML;
   },0);
});
var userInfoModal = aSelector("#user-info-modal>div"),
    userInfoModelName = userInfoModal.children[2].children[0].children[0],
    userInfoModalSpinner = userInfoModal.children[1].children[1],
    userInfoModalImage = userInfoModal.children[1].children[0],
    userInfoModalLocation = userInfoModelName.nextElementSibling.nextElementSibling,
    userInfoModalSkill = userInfoModal.children[3],
    userInfoModalDesc = userInfoModal.children[4].children[0].children[1],
    userinfoModalContactRemove = userInfoModal.children[6].children[0].children[0].children[1];
listenServer(18,function(data){
if(!data){

}else{
    //Style
    Array.from(userInfoModal.children).forEach(function(e,i,a){i > 1 ? e.style.display = `block` : ``});
    userInfoModalSpinner.style.display = "none";
    userInfoModalImage.style.display = "block";
    userInfoModelName.innerHTML = data.name;
    setSession("userInfoModalLoadedId",data.id);    
    userInfoModalImage.style.backgroundImage = `url(/uploads/profile/${data.image})`;
    var skills = '';
    if(data.skill != null){data.skill.split(",").forEach(e => { skills += `<span class="tag">${e}</span>`});}
    userInfoModalSkill.innerHTML = `<p> Skills <br>${skills}</p>`;
    userInfoModalLocation.innerHTML = `<span uk-icon="icon: location;ratio:.8" style="vertical-align: text-top;"></span>${data.city},${data.country}`;
    userInfoModalDesc.innerHTML = data.description;
}
});
listen("click",userinfoModalContactRemove,() => {
sendToServer(27,getSession("userInfoModalLoadedId"));
});
listenServer(27,d => {
aHiding(".f-modal");
UIkit.notification({ message: d ? 'A Contact Remove From Group..' : `Fail to remove contact..`, pos: 'top-center', status: 'success' });
});
var desktop_notification_selector = aSelector("#settingModal>main>form>.columns>.f-dropdown:nth-child(1)>.content>.dropdown-item",true),
    setting_unread_message_selector = aSelector(".setting-unread-msg>.dropdown-item",true),
    setting_message_interval_selector = aSelector(".setting-unread-interval>.dropdown-item",true),
    onpress_enter_selector = aSelector("#settingModal>main>form>.columns>.f-dropdown:nth-child(3)>.content>.dropdown-item",true),
    unread_message_interval_html = aSelector("#settingModal>main>form>.columns>.f-dropdown:nth-child(2)>.f-dropdownTrigger",true),    
    desktop_notification_html = aSelector("#settingModal>main>form>.columns>.f-dropdown:nth-child(1)>.f-dropdownTrigger"),
    onpress_enter_setting_html = aSelector("#settingModal>main>form>.columns>.f-dropdown:nth-child(3)>.f-dropdownTrigger"),
    out_office_input_field_selector = aSelector("#out-of-office-modal>main>.control>.input");
listen("click",desktop_notification_selector,function(){setSession("setting_desktop_notification",this.getAttribute("data"));});
listen("click",setting_unread_message_selector,function(){setSession("setting_unread_message",this.getAttribute("data"));});
listen("click",setting_message_interval_selector,function(){setSession("setting_message_interval",this.getAttribute("data"));});
listen("click",onpress_enter_selector,function(){setSession("setting_onpress_enter",this.getAttribute("data"));});
listen("click",aSelector("#settingModal>footer>.field>.control:first-child",true),function(){
setSession("setting_desktop_notification",false);
setSession("setting_unread_message",false);
setSession("setting_message_interval",false);
setSession("setting_onpress_enter",false);
});
listen("click",aSelector("#settingModal>footer>.field>.control:last-child",true),function(){
sendToServer(25,{notification : nullToFalse(getSession("setting_desktop_notification")), unread_msg : nullToFalse(getSession("setting_unread_message")), interval : nullToFalse(getSession("setting_message_interval")),onpress_enter : nullToFalse(getSession("setting_onpress_enter"))})
});
listen("click",aSelector("#out-of-office-modal>footer>.field>.control:last-child"),() => {
 sendToServer(25,{out_office : stripTags(out_office_input_field_selector.value)});
});
listenServer(25,data => {
out_office_input_field_selector.value = data.out_of_office_msg;
out_office_input_field_selector.parentElement.nextElementSibling.innerText = data.out_of_office_msg;
desktop_notification_selector.forEach(e => {parseInt(e.getAttribute("data")) == data.desktop_notification ? `${e.classList.add("active")}${desktop_notification_html.innerHTML = desktop_notification_active_text(data.desktop_notification)}` : `` });
setting_unread_message_selector.forEach(e => {parseInt(e.getAttribute("data")) == data.send_msg_to_mail ? `${e.classList.add("active")}${unread_message_interval_html[0].innerHTML = desktop_notification_active_text(data.send_msg_to_mail)}` : `` });
setting_message_interval_selector.forEach(e => {parseInt(e.getAttribute("data")) == data.send_msg_interval ? `${e.classList.add("active")}${unread_message_interval_html[1].innerHTML = setting_message_interval_active_text(data.send_msg_interval)}` : `` });
onpress_enter_selector.forEach(e => {parseInt(e.getAttribute("data")) == data.onpress_enter ? `${e.classList.add("active")}${data.onpress_enter == 1 ? setSession("onpress_enter",true) : setSession("onpress_enter",false) }${onpress_enter_setting_html.innerHTML = onpress_enter_active_text(data.onpress_enter)}` : ``; });
});
listenServer(26,data => {
aHiding(".f-modal");
data ? UIkit.notification({ message: 'Settings Updated !', pos: 'top-center', status: 'success' }) : UIkit.notification({ message: 'Settings Can not Updated !', pos: 'top-center', status: 'success' });
});
listen("scroll",aSelector("#chatList"),function(){
    let scrollHeight = this.scrollHeight - 1,
        scrollPosition = this.clientHeight + this.scrollTop;
  if (scrollPosition >= scrollHeight) {sendToServer(7, {page: true})}
        });  
listen("scroll",aSelector("#contactList"),function(){
    let scrollHeight = this.scrollHeight - 1,
        scrollPosition = this.clientHeight + this.scrollTop;
  if (scrollPosition >= scrollHeight) {sendToServer(8, {page: true})}
        }); 
listen("scroll",aSelector("#creategroupdata"),function(){
    let scrollHeight = this.scrollHeight - 1,
        scrollPosition = this.clientHeight + this.scrollTop;
  if (scrollPosition >= scrollHeight) {sendToServer(9, {page: true})}
        }); 
listen("scroll",aSelector("#viewImageModal>#modalDisplay>main>#gal>.media-body"),function(){
  if (this.scrollTop <= 0) {sendToServer(24, {page: true})}
        }); 
var mediaScrollMove = 0,
   mediaScrollSelector = aSelector('#viewImageModal>#modalDisplay>main>#gal>.media-body');
$("body").on('click','.view',() => { if(getSession("media_item_click")){mediaScrollSelector.innerHTML = '<div class="uk-align-center"><span uk-spinner="ratio: .8"></span></div>'; setSession("media_item_click", false); sendToServer(24,{media : true});   } });
listenServer(24,data =>{
    var mediaMsg = ``;
    if(!data){ mediaMsg += "No media have shared...";}else{data.forEach (e => { mediaMsg += mediaMsgConvert(e); });  }
mediaScrollSelector.innerHTML = mediaMsg;
if(getSession("media_scroll_bottom")){
mediaScrollMove = 0;
setSession("media_scroll_bottom",false);   
}
   mediaScrollSelector.scrollTo(0,mediaScrollSelector.scrollHeight - mediaScrollMove);
   mediaScrollMove = mediaScrollSelector.scrollHeight;
});

listen("click",aSelector("#viewImageModal>#modalDisplay>main>.menuBar>.bar2"),() => {
let link = aSelector("#modalDisplay>main>#gallery-display>img").src;
link ? window.open(link,"_blank") : ``;
});

listen("click",aSelector("#viewImageModal>#modalDisplay>main>.menuBar>.bar3"),() => {
var ajax;
try{ajax=new XMLHttpRequest()}catch(t){try{ajax=new ActiveXObject("Msxml2.XMLHTTP")}catch(t){try{ajax=new ActiveXObject("Microsoft.XMLHTTP")}catch(t){console.log("Something error....")}}}
listen("load",ajax,function(){
aHiding(".f-modal");
UIkit.notification({ message: JSON.parse(this.responseText).response ? 'You have deleted a file..' : `Fail to delete..`, pos: 'top-center', status: 'success' });
});
listen("error",ajax,function(){
aHiding(".f-modal");
UIkit.notification({ message: `Fail to delete file..`, pos: 'top-center', status: 'success' });
});
ajax.open('POST',"/fexchat/deleteFile/"+parseInt(getSession("delete_mid")));
ajax.send();
});



/*Is Desktop Notification Enabled..*/
let desktop_notification_status = aSelector("#settingModal>main>form>div:nth-child(1)");
if (window.Notification && Notification.permission !== 'default') {
    desktop_notification_status.innerHTML = `Desktop notification is Enabled...`;
}else{
desktop_notification_status.innerHTML = `Desktop alerts are not enabled on this browser. <a href="http://fexjob.com/fexchat/desktop_notification_enable">Click Here</a> to enable desktop alerts.`;
}



var fileSendToServer = function(e) {
       var fileSrc, filesData = [...this.files], fileId,fileTemplete,
                    fileName = filesData[0].name.split('.'),
                    fileComma = filesData[0].name.replace( /,/g, "" ),
                    fileName = fileName[0],isImage = fileExtension(filesData[0].type,'image');
fileId = fileName.split('').length > 5 ? fileName.substring(0, 4)+'_'+Date.now() : fileName+ '_' + Date.now();
    if(isImage){
    filesData.map(e=>{
        fileSrc = window.URL.createObjectURL(e);
    });
fileTemplete = `<div class="f-msg me f-file">
                            <div class="uploading-image" id="${fileId}">
                                <div class="blur" style="background-image: url(${fileSrc});"></div>
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
                    <time></time>
                        </div>`;
    }else{
        fileTemplete = `<div class="f-msg me f-file">
                            <div id="f-file">
                                <p>${fileComma}</p>   
                                <div id="${fileId}">
                                    <span uk-icon="icon: close" title="Cancel Upload" class="downloading" style="z-index: 1"></span>
                                    <div uk-spinner="ratio: 1" class="file-uploading"></div>
                                    <div id="progress" style="display:block;">
                                        <progress class="uk-progress" value="0" max="100"></progress>
                                    </div> 
                                </div>                                
                            </div>
                            <time></time>
                        </div>`;
    }

$("#mRoot").append(fileTemplete);
scrollBottom("#mRoot");
var formdata = new FormData();
  formdata.append('file1',filesData[0]);
  formdata.append('id',fileId);
var ajax;
try{ajax=new XMLHttpRequest()}catch(t){try{ajax=new ActiveXObject("Msxml2.XMLHTTP")}catch(t){try{ajax=new ActiveXObject("Microsoft.XMLHTTP")}catch(t){console.log("Something error....")}}}
  //var ajax = new XMLHttpRequest();
listen('progress',ajax.upload,function(e){
    var UploadedParcent = Math.round((e.loaded / e.total)*100);
    aSelector(`#${fileId} #progress progress`).value = UploadedParcent;
  });
listen('load',ajax,function(e){
        var select = aSelector(`#${fileId}`),
            responseDatas = JSON.parse(this.responseText),
           statusOf = responseDatas.response,
           responseFileName = responseDatas.file;
        if(statusOf){
        var fileMessage = isImage ? `image,${fileId},${fileComma},${responseFileName}` : `file,${fileId},${fileComma},${responseFileName}`;
        sendToServer(21, {message: fileMessage, type : 1});
    }else  {
aHiding(`#${fileId} #progress`);
if(isImage){
aSelector(`#${fileId} #spinner`).innerHTML = `<span uk-icon="icon: warning"></span><div style="font-size:12px;z-index:22"> Failed</div>`;
        }else{
aSelector(`#${fileId}`).innerHTML = `<span uk-icon="icon: warning"></span>`;
        }
        }
          });
listen('error',ajax,function(e){
    if(isImage){aSelector(`#${fileId} #spinner`).innerHTML = `<span uk-icon="icon: warning"></span><div style="font-size:12px;z-index:22"> Failed</div>`;
}else{aSelector(`#${fileId}`).innerHTML = `<span uk-icon="icon: warning"></span>`;}
  });
listen('abort',ajax,function(e){
    if(isImage){aSelector(`#${fileId} #spinner`).innerHTML = `<span uk-icon="icon: warning"></span><div style="font-size:12px;z-index:22"> Failed</div>`;
}else{aSelector(`#${fileId}`).innerHTML = `<span uk-icon="icon: warning"></span>`;}
  });
  ajax.open('POST',"/fexchat/file_upload");
  ajax.send(formdata); }
listen('change', aSelector('#upload input[name=uploadAll]'),fileSendToServer);
listen('change', aSelector('#upload input[name=uploadImage]'),fileSendToServer)
$('body').on('click', '#chatList>.box',onclickDataSend);
$('body').on('click', '#contactList>.box',onclickDataSend);
$('body').on('click', '#searchDisplay>dd>.box',onclickDataSend);
$("body").on("click",".f-file",function() {
let link = this.getAttribute("data"),
    value = this.getAttribute("value");
link ? window.open(link,"_blank") : ``;
value = value ? value.split(",") : false;
value ? aSelector("#viewImageModal>#modalDisplay>main>.menuBar>.bar3").style.display = value[0] == userId ? `` : `none` : ``;
value ? setSession("delete_mid",parseInt(value[1])) : ``;
});
$("body").on("click",".view-user-profile",function(){
    Array.from(userInfoModal.children).forEach(function(e,i,a){i > 1 ? e.style.display = `none` : ``});
    userInfoModalSpinner.style.display = "";
    userInfoModalImage.style.display = "none";
    let data = this.getAttribute("data");
    if(data){sendToServer(18,data);}
});


}
})();