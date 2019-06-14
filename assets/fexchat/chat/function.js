"use strict";
    /*
    -- Chat Service Done By Abdul Alim Jewel 
    */
let myTimeZone = moment.tz.guess();
var sn = ["newMessageChannel", "ownMsg", "oldMsg", "moreMsg", "roomList", "roomInfo", "contactLists", "listPaging",
                "contactListPaging", "newgroup", "newGroupPagination", "createChatroomDetails", "returnResults", "searchResults",
                "sortByChannel", "typing", "groupMemberlist", "exitGroup", "roomUserProfile", "addToGroup", "roomDetails", "sendMessage",
                "groupNameEdit", "groupNotification", "mediaMessage", "settingsData", "settingSuccess", "groupContactRemove","isSomeThingChange",
                "sendAddToGroup","disconnect","connect"
            ];
var prevActiveRoom,currentActiveRoom;
var roomlistTimer, roomlistnotTimer, oldMessageChannelTimer, typingChannelTimer, newMessageChannelTimer, ownMessageChannelTimer, moreMessageChannelTimer,
    roomInfoTimer, contactListzTimer, searchResultsTimer, newGroupTimer, returnResultsTimer, groupMemberlistTimer, typingTimer, doneTypingInterval = 10,
    finalDoneTypingInterval = 500; try {var socket = io.connect(`http://50.31.134.79:8000?userId=${userId}&userKey=${userKey}&timezone=${myTimeZone}`);} catch (e) {console.log('Can not connected !');}
var aSelector = (a, b = false) => {let returns = b ? document.querySelectorAll(a) : document.querySelector(a); returns == null ? console.log(a+'is null') : ``; return returns != null ? returns : document.querySelector("#this-is-for-default-selector");},
    snf = a => {return sn[a];},
    listen = (a, b, c) => {b.length ? b.forEach(e => {e.addEventListener(a, c)}) : b.addEventListener(a, c);return;},
    sendToServer = (a, b) => {socket.emit(snf(a), b);return;},
    listenServer = (a, b) => {socket.on(snf(a), b);return;},
    setSession = (a, b) => {sessionStorage.setItem(a, JSON.stringify(b));return;},
    getSession = a => {return JSON.parse(sessionStorage.getItem(a));},
    rmSession = a => {a.length ? a.forEach (e => { sessionStorage.removeItem(e) }) : sessionStorage.removeItem(a); return;},
    scrollBottom = a => {let line = aSelector(a);line.scrollTop = line.scrollHeight;return;},
    stripTags = a => {return a.replace(/[\u00A0-\u9999<>&](?!#)/gim, i => {return '&#' + i.charCodeAt(0) + ';';});},
    userCss = a => {return a === userId ? "me" : "you";},
    isActive = a => {return a === 1 ? "online" : "offline";},
    timeCovertToLocal = (a,b = 1) => {let serverTime = moment.tz(a, 'America/Chicago'),toLocalTime = serverTime.tz(myTimeZone); return b == 1 ? toLocalTime.format('LT') : b == 2 ? serverTime.fromNow() : ``; },
    isTitle = a => {return a.type == 1 && a.jobTitle ? a.jobTitle : a.type == 2 && a.roomTitle ? a.roomTitle : !a.jobTitle && a.roomTitle ? a.roomTitle : "";},
    check_box_marked_item_list = a  => {return a == null ? [] : a;},
    remove = (a, b) => {return a.filter(e => e !== b);},
    ajaxCall = () => {var ajax;try{ajax=new XMLHttpRequest()}catch(t){try{ajax=new ActiveXObject("Msxml2.XMLHTTP")}catch(t){try{ajax=new ActiveXObject("Microsoft.XMLHTTP")}catch(t){console.log("Something error....")}}}},
    checkbox_checked = (a, b ) => {return b != null && b.indexOf(a) > -1 ? "checked" : "";},
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
    changeurl = a => {window.history.pushState(null, "Messages", "/fexchat/fexchat/jobroom/" + a);return;},
    roomlistHTMLF = a => {return a.type === 1 ? `<div class="box" id="${a.roomId}" data="${a.roomId},${a.token},${a.job_id}"> <article class="media"> <div class="media-left"> <figure class="image is-48x48 f-i ${isActive(a.is_active)}"> <img src="${base_url}uploads/profile/${a.oppo_image}" alt="Image"> </figure> </div><div class="media-content"> <div class="content"> <p> <strong>${a.oppo_name}</strong> <span class="is-pulled-right">${timeCovertToLocal(a.messageTime,2)}</span> <br><b>${isTitle(a)}</b> <i class="mdi mdi-more is-pulled-right jobListPopUp"></i> <br><span>${a.msngrName}: ${a.msg_type == 1 ? `Sent an attachment..` : a.messageText.replace(/(<([^>]+)>)/ig, "").slice(0, 30)}</span>${unreadMsg(a.unread_msg)} </p></div></div></article> </div>` : a.type === 2 ? `<div class="box group" id="${a.roomId}" data="${a.roomId},${a.token},${a.job_id}"> <article class="media"> <div class="media-left"> <figure class="image is-48x48 f-i"> <img src="${base_url}uploads/profile/groupDefaultImage.png" alt="Image"> </figure> </div><div class="media-content"> <div class="content"> <p> <strong>${isTitle(a)}</strong> <span class="is-pulled-right">${timeCovertToLocal(a.messageTime,2)}</span> <br><span>${a.msngrName}: ${a.msg_type == 1 ? `Sent an attachment..` : a.messageText.replace(/(<([^>]+)>)/ig, "").slice(0, 30)}</span> ${unreadMsg(a.unread_msg)} </p></div></div></article> </div>` : "";},
    searchlistHTMLF = a => {console.log(a);return `<dd> <div class="box" data="${a.room_id},${a.token},${a.job_id}"> <article class="media"> <div class="media-left"> <figure class="image is-32x32 f-i"> <img src="${base_url}uploads/profile/${a.image}" alt="Image"> </figure> </div><div class="media-content"> <div class="content"> <p> <strong>${a.name != null ? a.name : ``} </strong><br><b>${isTitle(a)}</b><br/><span>${a.message.replace(/(<([^>]+)>)/ig, "")}</span> </p></div></div></article> </div></dd>`;},
    fileExtension = (a, b) => {return a.indexOf(b) > -1 ? true : false;},
    messageConvert = a => {var msgStr = a.messageText.split(",");return msgStr[0] == 'image' ? `<div class="f-msg ${userCss(a.userId)} f-file" value="${a.userId},${a.messageId}"> <div class="uploaded-image" style="background-image: url(${base_url}uploads/fexchat/${msgStr[3]});"> <div class="blur"></div><div class="inner-content"> <div id="spinner"> <div class="view" data-src="${base_url}uploads/fexchat/${msgStr[3]}">View</div></div></div></div><time>${timeCovertToLocal(a.messageTime)}${a.userId == userId ? `&nbsp;<span class="mdi mdi-check-all"> </span>` :``}</time> </div>` : a.userId != userId ? `<div class="f-msg you f-file" data="/uploads/fexchat/${msgStr[3]}" value="${a.userId},${a.messageId}"> <div id="f-file"> <div><i class="fa fa-file-o"></i></div><p>${msgStr[2]}</p></div><time>${timeCovertToLocal(a.messageTime)}</time> </div>` : ` <div class="f-msg me f-file" data="/uploads/fexchat/${msgStr[3]}" value="${a.userId},${a.messageId}"> <div id="f-file"> <p>${msgStr[2]}</p><div><i class="fa fa-file-o"></i> </div></div><time>${timeCovertToLocal(a.messageTime)}&nbsp;<span class="mdi mdi-check-all"> </span></time> </div>`;},
    mediaMsgConvert = a => {var data;if (!a.onlyDate) {data = a.messageText.split(",");}
                                     return a.onlyDate ? `<div class="date"> <h6 class="uk-text-center uk-heading-line"> <span>${a.onlyDate}</span> </h6> </div>` : data[0] == 'image' ? ` <div class="${userCss(a.userId)} f-file" value="${a.userId},${a.messageId}"> <img src="${base_url}uploads/fexchat/${data[3]}" alt="" data-src="${base_url}uploads/fexchat/${data[3]}"> <time>${a.userId != userId ? `<span>${a.userName},</span>` : ''} ${timeCovertToLocal(a.messageTime)}</time> </div>` : data[0] == 'file' && a.userId != userId ? ` <div class="f-msg you f-file" value="${a.userId},${a.messageId}" data="/uploads/fexchat/${data[3]}"> <div id="f-file"> <div><i class="fa fa-file-o"></i></div><p>${data[2]}</p></div><time><span>${a.userName},</span> ${timeCovertToLocal(a.messageTime)}</time> </div>` : `<div class="f-msg me f-file" value="${a.userId},${a.messageId}" data="/uploads/fexchat/${data[3]}"> <div id="f-file"> <p>${data[2]}</p><div> <i class="fa fa-file-o"></i> </div></div><time>${timeCovertToLocal(a.messageTime)}&nbsp;<span class="mdi mdi-check-all"> </span></time> </div>`; },
    onpress_enter_active_text = a => {return a == 1 ? `Send Message` : `Add a line break`;},
    desktop_notification_active_text = a => {return a == 1 ? "All Activity" : a == 2 ? "Important Activity only" : a == 3 ? "Nothing" : ``},
    setting_message_interval_active_text = a => {return a == 1 ? "Immediate" : a == 2 ? `Every 15 minutes` : a == 3 ? `Once an hour` : a == 4 ? `Once a Day` : a == 5 ? `Only send when offline` : ``;};

rmSession(["active_room","active_room_token","active_room_job","room_type","media_scroll_bottom","media_item_click","creategroupuser","userInfoModalLoadedId","setting_desktop_notification","setting_unread_message","add_people_to_group","delete_mid","setting_message_interval","setting_onpress_enter","onpress_enter"])