"use strict";
    /*
    -- Chat Service Done By Abdul Alim Jewel 
    */

listenServer(28,d => { d.ThisId = userId; sendToServer(28,d); });


listenServer(4, d => {clearTimeout(roomlistTimer);
                     roomlistTimer = setTimeout(function() {$("#chatList>div").slice(1).remove();var data = '';
                     if(!d){data += `<div>Nothing Founds....</div>`}else{d.forEach (e => {data += roomlistHTMLF(e) });}
                     $('#chatList').append(data);addActiveCss(getSession("active_room"), false);
    },0);
});
listen('click',aSelector('#chatList>.f-dropdown>.content>.dropdown-item',true),function(){ sendToServer(14, {sort: parseInt(this.getAttribute('data')) }); });
listenServer(15, e =>{ aSelector("#typing").innerHTML = e.type ? `<p>${e.typer}</p>` : ``});

var roomHeaderSelector = aSelector(".f-main>.f-main-header>.header>.media"),
    groupInfoModal = aSelector("#group-info-modal>div"),
    groupModalNotification = groupInfoModal.children[5].children[0].children[1].children[0],
    groupModalExit = groupInfoModal.children[6].children[0].children[0].children[1];
listenServer(5, a => {clearTimeout(roomInfoTimer);
                     roomInfoTimer = setTimeout(function() {
                    let viewContractLink = aSelector(".view-contract>button");
                     if(a.room_type == 1){
                        viewContractLink.value = userRole == 'customer' && a.con_int == 1 ? `/customer/job-milestones/${a.job_id}/${a.create_for}` : userRole == 'freelancer' && a.con_int == 1 ? `/professional/contract-payment/${a.job_id}` : userRole == 'customer' && a.con_int == 2 ? `/customer/hire-freelancer/${a.create_for}` : userRole == 'freelancer' && a.con_int == 2 ? `/professional/job-details/${a.job_id}` : ``;
                        viewContractLink.innerHTML = a.con_int == 1 ? `View Contract` : userRole == 'customer' && a.con_int == 2 ? `Hire Me` : userRole == 'freelancer' && a.con_int == 2 ? `View Job` : ``;                
                    }else if(a.room_type == 2){viewContractLink.value = ``;}
                    setSession("room_type",a.room_type);changeurl(getSession("active_room_job") + '/' + getSession("active_room") + '/' + getSession("active_room_token"));setSession("media_scroll_bottom", true);setSession("media_item_click",true);aSelector(".name-bar").style.display = "";
                     let  roomTypeClassSetSelector = roomHeaderSelector.parentElement.parentElement.classList,roomTypeClass = a.room_type == 1 ? `single-chat` : `group-chat`;
                     roomTypeClassSetSelector.contains(roomTypeClass) ? `` : roomTypeClassSetSelector.contains("single-chat") ? roomTypeClassSetSelector.replace("single-chat",roomTypeClass) : roomTypeClassSetSelector.replace("group-chat",roomTypeClass);
                     roomHeaderSelector.children[0].innerHTML = `<figure class="cursor image is-48x48 f-i ${a.room_type == 1 ? isActive(a.is_active) : ""} userIcon"> <img src="${base_url}uploads/profile/${a.room_type == 1 && a.image ? a.image : a.room_type == 2 ? `groupDefaultImage.png` : ""}" alt="Image"> </figure>`;
                     roomHeaderSelector.children[1].children[0].innerHTML = `${a.room_type == 2 && a.room_title ? a.room_title : a.room_type == 1 && a.job_title ? `${a.name}<small>&nbsp;${a.job_title}</small>` : a.room_type == 1 && a.room_title ? `${a.name}<small>&nbsp;${a.room_title}</small>` : ""}`;
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
                    d.forEach (e => { contactlisted += e.type === 1 && e.oppo_name ? `<div class="box" data="${e.roomId},${e.token},${e.job_id}"> <article class="media"> <div class="media-left"> <figure class="image is-48x48 f-i ${isActive(e.is_active)}"> <img src="${base_url}uploads/profile/${e.oppo_image}" alt="Image"> </figure> </div><div class="media-content"> <div class="content"> <p> <strong> ${e.oppo_name}</strong> <br><b>${e.jobTitle}</b> </p></div></div></article> </div>` : e.type === 2 && e.oppo_name ? `<div class="box" data="${e.roomId},${e.token},${e.job_id}"> <article class="media"> <div class="media-left"> <figure class="image is-48x48 f-i ${isActive(e.is_active)}"> <img src="${base_url}uploads/profile/${e.oppo_image}" alt="Image"> </figure> </div><div class="media-content"> <div class="content"> <p> <strong>${e.oppo_name}</strong> <br><b>${e.roomTitle}</b> </p></div></div></article> </div>` : ``});
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
var newgroupz = '';
if(d){d.forEach (e =>{newgroupz += `<div class="box"> <article class="media"> <div class="media-left"> <figure class="image is-48x48 f-i ${isActive(e.is_active)}"> <img src="${base_url}uploads/profile/${e.image}" alt="Image"> </figure> </div><div class="media-content"> <div class="content"> <p> <strong>${e.name}</strong> <br><b>${e.job_title ? e.job_title : ``}</b> <input data="${e.id}" class="uk-checkbox uk-float-right group-member-checkbox" type="checkbox" ${checkbox_checked(e.id,getSession("creategroupuser"))}> </p></div></div></article> </div>`;});}
newGroupModal.children[5].innerHTML = newgroupz;
        });

$("body").on("click",".group-member-checkbox", e => {
        var inputuser = check_box_marked_item_list(getSession("creategroupuser"));
    if(e.target.checked){ inputuser.push(parseInt(e.target.attributes.data.value)) }else{ inputuser = remove(inputuser, parseInt(e.target.attributes.data.value));}
        setSession("creategroupuser", inputuser);   
                });
listen("click",aSelector("#is-createGroup"),e => {
            var errorsOfroom = [];
            var chatroomName = newGroupModal.children[1].children[0].value;
            var chatroomUsers = check_box_marked_item_list(getSession("creategroupuser"));
            if (chatroomName.length < 5 || chatroomName.length > 50) {
                errorsOfroom.push("Name can not be less than 5 letters or can not be more than 50 letters");
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
                    rmSession(["creategroupuser"]);
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
        console.log(data);
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

///Add People To Group
listen("click",aSelector("#add-to-group-display"),function(){
    this.nextElementSibling.children[0].innerHTML = '<div class="uk-align-center uk-position-center"><span uk-spinner="ratio: .8"></span></div>';
    this.nextElementSibling.children[1].style.pointerEvents = "none";
    sendToServer(19, parseInt(getSession("room_type")));
});

listenServer(19,d => {
let room_type = getSession("room_type"),
    itsSelector = aSelector(".add-to-group>div");
var itsHTML = ``;
if(!d){itsHTML += `<div class="box"><div class="media-content"> <div class="content"> <p> <strong> Nothing Founds...</strong></p></div></div></div>`; }

if(d){
itsSelector.nextElementSibling.style.pointerEvents = "";
d.forEach(e => {
itsHTML += `<div class="box"> <article class="media"> <div class="media-left"> <figure class="image is-48x48 f-i "> <img src="${room_type == 1 ? "/uploads/profile/groupDefaultImage.png" : e.image}" alt="Image"> </figure> </div><div class="media-content"> <div class="content"> <p> <strong> <a href="javascript:void(0)">${room_type == 1 ? e.title : e.name}</a> </strong> <br><a>${room_type == 1 && e.users != null ? e.users : e.job_title != null ? e.job_title.slice(0, 30) : ``}</a><input class="uk-checkbox uk-float-right" data=${room_type == 1 ? e.group_id : e.id} type="checkbox"> </p></div></div></article> </div>`;
})
}
itsSelector.innerHTML = itsHTML;
})

$("body").on("click",".add-to-group .uk-checkbox",function(e){
let addPeopleToGroup = check_box_marked_item_list(getSession("add_people_to_group")),
   marked = parseInt(this.getAttribute("data")),
   afterRes = e.target.checked ? (addPeopleToGroup.push(marked),addPeopleToGroup) : remove(addPeopleToGroup,marked);
   setSession("add_people_to_group",afterRes);
})

$("body").on("click",".add-to-group-dismiss",function(){
	rmSession('add_people_to_group');
})
$("body").on("click",".add-to-group .is-link",function(){
let items = getSession("add_people_to_group"),
    room_type = getSession("room_type");
items != null && items.length ? sendToServer(29,{room_type : room_type, items : items}) : ``; 
})

listenServer(29,d => {
    aHiding(".add-to-group");
    UIkit.notification({ message: d ? 'Member added successfully ...' : `Fail to add member..`, pos: 'top-center', status: 'success' });

})

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

$("body").on("click",".view-contract>button",function(){
    let link = this.getAttribute("value");
    link ? window.open(link,"_blank") : ``;
});