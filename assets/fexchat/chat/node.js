var mysql = require('mysql'),

    moment = require('moment'),
    fetch = require('node-fetch'),
    FormData = require('form-data'),
    io = require('socket.io').listen(8000, {
        /*origins: 'localhost:*'*/
    }).sockets,
    uuidv1 = require('uuid/v1'),

    db = mysql.createConnection({

        host: "50.31.134.79",

        user: "petrobas_ualim",

        password: "_dMMQ)yOtm6y",

        database: "petrobas_alim"

    });





//Check IO Server Started or NOT

if (io) {

    console.log("Server Connected..")

} else {

    console.log("Server fail to connect");

}

//Check MySQL Connected or MOT

db.connect(function(err) {

    if (err) {

        console.log("MySQL Error : fail to connect, more info - " + err)

    } else {

        console.log("MySQL Connected..")

    }

});





///Clear Time Out Variable

var socketTimer, userInfoTimer, sendMessageTimer, typingChannelTimer, sortByChannelTimer, createChatroomDetailsTimer, roomDetailsTimer;



////Declare Variables...

var roomListChannel = "roomList",

    newMessageChannel = "newMessageChannel",

    ownMessageChannel = "ownMsg",

    typingChannel = "typing",

    roomInfo = "roomInfo";



///Declare Functions...

function settingsDataSending(socket, userId) {

    ///Send Settings Data and Profile Data...

    db.query('SELECT desktop_notification,send_msg_to_mail,send_msg_interval,onpress_enter,out_of_office_msg FROM chatroom_preference WHERE user_id = ?', [userId], function(err, results) {

        if (results.length) {
            socket.emit('settingsData', results[0]);
        }
    });

    return;

}



function roomlistfunc(socket, userId, page, sort) {

    db.query('UPDATE chatroom_preference SET room_page_number = ? WHERE user_id = ?', [page, userId])

    var pageNumber = page * 20,

        sortingCause = sort == 1 ? `WHERE unread_msg > 0 ` : sort == 2 ? `WHERE con_int = 1 ` : sort == 3 ? `WHERE con_int = 2 ` : ` `;

    var roomSql = 'SELECT c.mid,c.msg_type,c.room_id,c.user_id,c.message,c.status,c.timestamp,c.token,c.job_id,c.creator_id,c.roomTitle,c.type,c.image,c.msngr_name,c.oppo_id,c.oppo_name,c.oppo_image,c.jobTitle,c.unread_msg,c.con_int,chatroom_preference.is_active  FROM(SELECT ms.mid,ms.msg_type, ms.room_id, ms.user_id,ms.message,ms.status,ms.timestamp,ms.token,ms.job_id,ms.creator_id,ms.roomTitle,ms.unread_msg,ms.con_int,ms.type,ms.image,ms.msngr_name,ms.oppo_id,ms.oppo_name,ms.oppo_image,job.title AS jobTitle FROM(SELECT fs.mid,fs.msg_type, fs.room_id, fs.user_id,fs.message,fs.status,fs.timestamp,fs.token,fs.job_id,fs.creator_id,fs.roomTitle,fs.type,fs.image,fs.msngr_name,fs.oppo_id,fs.unread_msg,fs.con_int,CONCAT(join_user.first_name, " ",join_user.last_name) AS oppo_name,join_user.image AS oppo_image FROM(SELECT ju.mid,ju.msg_type, ju.room_id, ju.user_id,ju.message,ju.status,ju.timestamp,ju.token,ju.job_id,ju.creator_id,ju.roomTitle,ju.type,join_user.image,join_user.first_name AS msngr_name,ju.oppo_id,ju.unread_msg,ju.con_int FROM (SELECT bd.mid,bd.msg_type, bd.room_id, bd.user_id,bd.message,bd.status,bd.timestamp,bd.token,bd.oppo_id,bd.unread_msg,chatroom_room.con_int,chatroom_room.job_id,chatroom_room.creator_id,chatroom_room.title AS roomTitle,chatroom_room.type FROM (SELECT a.id AS mid,a.type AS msg_type, a.room_id, a.user_id,a.message,a.status,a.timestamp,chatroom_member.token,chatroom_member.oppo_id,chatroom_member.unread_msg FROM (SELECT * FROM chatroom_messages WHERE id IN (SELECT MAX(id) FROM chatroom_messages WHERE room_id IN (SELECT room_id FROM chatroom_member WHERE user_id = ?) GROUP BY room_id)) AS a INNER JOIN chatroom_member ON a.room_id = chatroom_member.room_id AND chatroom_member.user_id = ?) AS bd INNER JOIN chatroom_room ON chatroom_room.id = bd.room_id) AS ju INNER JOIN join_user ON ju.user_id = join_user.id) AS fs LEFT JOIN join_user ON join_user.id= fs.oppo_id) AS ms LEFT JOIN job ON job.id = ms.job_id)AS c LEFT JOIN chatroom_preference ON chatroom_preference.user_id = c.oppo_id ' + sortingCause + 'ORDER BY mid DESC LIMIT 0, ?';

    db.query(roomSql, [userId, userId, pageNumber], function(err, grouplist) {

        if (grouplist.length) {
            var grouplisting = [];

            grouplist.forEach(e => {
                grouplisting.push({
                    roomId: e.room_id,
                    roomTitle: e.roomTitle,
                    jobTitle: e.jobTitle,
                    msngrId: e.user_id,
                    msngrName: e.msngr_name,
                    msngrPhoto: e.image,
                    messageText: e.message,
                    unread_msg: e.unread_msg,
                    messageTime: e.timestamp,
                    token: e.token,
                    creator_id: e.creator_id,
                    job_id: e.job_id,
                    type: e.type,
                    oppo_name: e.oppo_name,
                    oppo_image: e.oppo_image,
                    msg_type: e.msg_type,
                    is_active: e.is_active
                })
            });

            socket.emit(roomListChannel, grouplisting);
        } else {
            socket.emit(roomListChannel, false)
        }

    });

}



function newgroupdata(socket, userId, page) {

    var contPagesLoad = page * 20;

    db.query('UPDATE chatroom_preference SET creategroup_page = ? WHERE user_id = ?', [page, userId])

    db.query('SELECT a.*,b.is_active FROM (SELECT a.*,b.title AS job_title FROM(SELECT id,CONCAT(first_name," ",last_name) AS name,image FROM join_user WHERE id IN (SELECT user_id FROM chatroom_member WHERE room_id IN (SELECT room_id FROM chatroom_member WHERE user_id = ?) AND user_id <> ?) LIMIT 0,?) a LEFT JOIN job b ON b.id = (SELECT MAX(job_id) FROM chatroom_room WHERE (creator_id = ? AND create_for = a.id) OR (creator_id = a.id AND create_for = ?) )) a LEFT JOIN chatroom_preference b ON b.user_id = a.id', [userId, userId, contPagesLoad,userId,userId], function(err, bcontactList) {
      socket.emit("newgroup", !err && bcontactList.length ? bcontactList : false);

    });

}



function contactlistupdate(socket, userId, page) {

    var contPagesLoad = page * 20;
    db.query('UPDATE chatroom_preference SET contact_page_number = ? WHERE user_id = ?', [page, userId])

    db.query('SELECT c.mid,c.room_id,c.user_id,c.message,c.unread_msg,c.status,c.timestamp,c.token,c.job_id,c.creator_id,c.roomTitle,c.type,c.image,c.msngr_name,c.oppo_id,c.oppo_name,c.oppo_image,c.jobTitle,chatroom_preference.is_active  FROM(SELECT ms.mid, ms.room_id, ms.user_id,ms.message,ms.unread_msg,ms.status,ms.timestamp,ms.token,ms.job_id,ms.creator_id,ms.roomTitle,ms.type,ms.image,ms.msngr_name,ms.oppo_id,ms.oppo_name,ms.oppo_image,job.title AS jobTitle FROM(SELECT fs.mid, fs.room_id, fs.user_id,fs.message,fs.unread_msg,fs.status,fs.timestamp,fs.token,fs.job_id,fs.creator_id,fs.roomTitle,fs.type,fs.image,fs.msngr_name,fs.oppo_id,CONCAT(join_user.first_name, " ",join_user.last_name) AS oppo_name,join_user.image AS oppo_image FROM(SELECT ju.mid, ju.room_id, ju.user_id,ju.message,ju.unread_msg,ju.status,ju.timestamp,ju.token,ju.job_id,ju.creator_id,ju.roomTitle,ju.type,join_user.image,join_user.first_name AS msngr_name,ju.oppo_id FROM (SELECT bd.mid, bd.room_id, bd.user_id,bd.message,bd.unread_msg,bd.status,bd.timestamp,bd.token,bd.oppo_id,chatroom_room.job_id,chatroom_room.creator_id,chatroom_room.title AS roomTitle,chatroom_room.type FROM (SELECT a.id AS mid, a.room_id, a.user_id,a.message,chatroom_member.unread_msg,a.status,a.timestamp,chatroom_member.token,chatroom_member.oppo_id FROM (SELECT * FROM chatroom_messages WHERE id IN (SELECT MAX(id) FROM chatroom_messages WHERE room_id IN (SELECT room_id FROM chatroom_member WHERE user_id = ?) GROUP BY room_id)) AS a INNER JOIN chatroom_member ON a.room_id = chatroom_member.room_id AND chatroom_member.user_id = ?) AS bd INNER JOIN chatroom_room ON chatroom_room.id = bd.room_id) AS ju INNER JOIN join_user ON ju.user_id = join_user.id) AS fs LEFT JOIN join_user ON join_user.id= fs.oppo_id) AS ms LEFT JOIN job ON job.id = ms.job_id)AS c LEFT JOIN chatroom_preference ON chatroom_preference.user_id = c.oppo_id WHERE oppo_name IS NOT NULL AND oppo_image IS NOT NULL ORDER BY oppo_name ASC LIMIT 0, ?', [userId, userId, contPagesLoad], function(err, bcontactList) {

        if (bcontactList.length) {
            var contactListing = [];

            bcontactList.forEach(e => {
                contactListing.push({
                    roomId: e.room_id,
                    roomTitle: e.roomTitle,
                    jobTitle: e.jobTitle,
                    msngrId: e.user_id,
                    msngrName: e.msngr_name,
                    msngrPhoto: e.image,
                    messageText: e.message,
                    unread_msg: e.unread_msg,
                    messageTime: e.timestamp,
                    token: e.token,
                    creator_id: e.creator_id,
                    job_id: e.job_id,
                    type: e.type,
                    oppo_name: e.oppo_name,
                    oppo_image: e.oppo_image,
                    is_active: e.is_active
                });
            });

            socket.emit("contactLists", contactListing);

        }

    });

}





///For Room Information

function realTimeHeader(socket, id, key) {

    db.query('SELECT a.*,countries.name AS country,countries.sortname AS country_code FROM(SELECT a.*,CONCAT(join_user.first_name, " ",join_user.last_name) AS admin_name FROM(SELECT a.*, COUNT(chatroom_member.user_id) AS member FROM (SELECT cat.*,chatroom_preference.is_active,chatroom_preference.my_timezone AS hisTime FROM(SELECT c.*,CONCAT(join_user.first_name," ",join_user.last_name) AS name,join_user.image,join_user.country_id FROM(SELECT b.*,chatroom_member.oppo_id,chatroom_member.notification FROM (SELECT a.*,job.title AS job_title FROM (SELECT id AS room_id,job_id,creator_id,create_for,con_int,title AS room_title,type AS room_type FROM chatroom_room WHERE id = ?) AS a LEFT JOIN job ON job.id = job_id) AS b INNER JOIN chatroom_member ON chatroom_member.room_id = b.room_id AND token = ?) AS c LEFT JOIN join_user ON join_user.id = c.oppo_id) AS cat LEFT JOIN chatroom_preference ON chatroom_preference.user_id = cat.oppo_id) AS a LEFT JOIN chatroom_member ON chatroom_member.room_id = a.room_id) AS a LEFT JOIN join_user ON join_user.id = a.creator_id) AS a LEFT JOIN countries ON countries.id = a.country_id', [id, key], function(err, roomInfos) {

        if (!err && roomInfos.length) {
            var thisData = roomInfos[0];
            socket.emit(roomInfo, thisData);

        } else {

            socket.emit(roomInfo, false);

        }

    });

}


function insertMemberToGroup(userId,roomId) {
if(!userId || !roomId){return false;}
let sql = `INSERT INTO chatroom_member (user_id,room_id,token) SELECT ?,?,? FROM DUAL WHERE NOT EXISTS (SELECT user_id,room_id FROM chatroom_member WHERE user_id = ? AND room_id = ?)`;
db.query(sql,[userId,roomId,uuidv1(),userId,roomId], (err,res) => {
return !err ? true : false;
})

}




function isSomeThingChange(socket,userId,type = 1){
     //type 1- online, 2 - message
let sqlplus = type == 1 ? `oppo_id = ?` : type == 2 ? `user_id = ? OR room_id = room_id` : ``,
    sql = `SELECT a.*,chatroom_preference.history_chatroom FROM(SELECT socket FROM chatroom_preference WHERE user_id IN (SELECT user_id FROM chatroom_member WHERE ${sqlplus})) AS a LEFT JOIN chatroom_preference ON chatroom_preference.user_id = ${userId}`;

if(sqlplus){
   db.query(sql,[userId],(err,res) => {

if(!err && res.length){res.forEach(e => {socket.to(e.socket).emit('isSomeThingChange',{userId : userId, type : type,room : e.history_chatroom});});}

});
     
    }
}






///Declare Socket Area 

io.on("connection", function(socket) {
    var getQueryParams = socket.handshake.query,
        userId = parseInt(getQueryParams.userId),
        userKey = getQueryParams.userKey,
        timeZone = getQueryParams.timezone;

    socketTimer = setTimeout(function() {


        db.query('SELECT * FROM join_user WHERE id = ? AND chat_token = ?', [userId, userKey], function(err, userInfoRes) {

            if (!err && userInfoRes.length) {

                var userName = userInfoRes[0].first_name + " " + userInfoRes[0].last_name,

                    userPhoto = "" + userInfoRes[0].image;
                   




                db.query('SELECT * FROM chatroom_preference WHERE user_id = ?', [userId], function(err, resofcount) {

                    if (resofcount.length) {
                        db.query('UPDATE chatroom_preference SET socket = ? , list_total_page = (SELECT ROUND(COUNT(*)/20)+1 as bcount FROM chatroom_member WHERE user_id = ?),is_active = ?,active_update_time =?,my_timezone = ? WHERE user_id = ? ', [socket.id, userId, 1, moment().format("YYYY-MM-DD HH:mm:ss"), timeZone, userId],(err,res) =>{
                            if(!err){
                                 isSomeThingChange(socket,userId); // Know The World You have come.....
                            }
                        });
                    } else {
                        db.query('INSERT INTO chatroom_preference SET ?', {
                            user_id: userId,
                            socket: socket.id
                        });

                    }
                });



                socket.join(newMessageChannel);
                socket.join("isSomeThingChange");
                socket.join(typingChannel);

                settingsDataSending(socket, userId);

                ///Recieved Message From Client

                socket.on('sendMessage', function(sendMessage) {

                        db.query('SELECT * FROM chatroom_preference WHERE user_id = ?', [userId], function(err, userprefer) {

                            if (userprefer.length) {
                                var message = sendMessage.message,

                                    lastRoom = userprefer[0].last_active_chatroom,

                                    messageType = sendMessage.type;

                                if (message && lastRoom) {
                                    db.query('INSERT INTO chatroom_messages SET ?', {
                                        room_id: lastRoom,
                                        user_id: userId,
                                        message: message,
                                        type: messageType
                                    }, function(err, newMsgRes) {

                                        if (!err) {
                                            db.query('SELECT * FROM chatroom_messages WHERE id = ?', [newMsgRes.insertId], function(err, getInsRes) {

                                                if (getInsRes.length) {

                                                    ///Message Data 

                                                    var messageData = {
                                                        userId: userId,
                                                        userName: userName,
                                                        userPhoto: userPhoto,
                                                        messageId: getInsRes[0].id,
                                                        messageText: getInsRes[0].message,
                                                        messageTime: getInsRes[0].timestamp,
                                                        messageStatus: getInsRes[0].status,
                                                        messageType: getInsRes[0].type,
                                                        onlyDate: false
                                                    }
////Send Mail On New Message
var mailform = new FormData();
mailform.append('rId', lastRoom);
mailform.append("name",userName);
mailform.append("message",message);
fetch('http://fexjob.com/fexchat/sendMsgToOfflineUser', { method: 'POST', body: mailform })
    .then(function(res) {
        return res.text();
    }).then(function(body) {
        //console.log(body);
    });
                                                    ///Add +1 To inActive User
                                                    socket.emit("isSomeThingChange",{userId : userId, type : 2,room : false});

                                                    db.query('SELECT user_id,socket,is_active FROM chatroom_preference WHERE user_id IN (SELECT user_id FROM chatroom_member WHERE room_id = ?)', [lastRoom], function(err, results) {

                                                        if (results.length) {

                                                            results.forEach(e => {
                                                            if(e.is_active != 1){
                                                                db.query('UPDATE chatroom_member SET unread_msg = unread_msg+1 WHERE user_id = ? AND room_id = ? AND unread_msg <= 99', [e.user_id, lastRoom]);
                                                            }else{
                                                             socket.to(e.socket).emit('isSomeThingChange',{userId : userId, type : 2,room : false});
                                                            }
                                                            });

                                                        }

                                                    });


                                                    ///Send To Active User

                                                    db.query('SELECT socket,user_id FROM chatroom_preference WHERE last_active_chatroom = ?', [lastRoom], function(err, emitToLastActiveRoom) {

                                                        if (emitToLastActiveRoom.length) {
                                                            emitToLastActiveRoom.forEach(e => {

                                                                if (e.user_id === userId) {
                                                                    socket.emit(ownMessageChannel, messageData); //Socket newmsg Emit 

                                                                } else {

                                                                    socket.to(e.socket).emit(newMessageChannel, messageData); //Socket newmsg Emit

                                                                }

                                                            }); /// For Loop

                                                        } //if emit to last active room has length

                                                    }); //Emit to last active chatroom

                                                } //If GetInsRes have lengt

                                            }); //Last Inserted and send to user

                                        } ///if not have error

                                    }); //Inserted into db

                                } //If Message have text

                            }

                        });

                    }) //End recieved new message



                ////Someone Typing Message

                socket.on(typingChannel, function(typing) {

                    clearTimeout(typingChannelTimer);

                    typingChannelTimer = setTimeout(function() {

                        db.query('SELECT socket,user_id,type FROM(SELECT socket,user_id,last_active_chatroom AS room_id FROM chatroom_preference WHERE last_active_chatroom = (SELECT last_active_chatroom FROM chatroom_preference WHERE user_id = ? LIMIT 0,1)) AS a INNER JOIN chatroom_room ON chatroom_room.id = a.room_id', [userId], function(err, userprefer) {

                            if (userprefer.length) {

                                userprefer.forEach(e => {

                                    if ((e.type === 1) && (e.user_id != userId) && (typing.type === true)) {

                                        socket.to(e.socket).emit(typingChannel, {
                                            type: true,
                                            typer: userName + " is typing.."
                                        });
                                    } else if ((e.user_id != userId) && (typing.type === true)) {

                                        socket.to(e.socket).emit(typingChannel, {
                                            type: true,
                                            typer: "Someone is typing.."
                                        });
                                    } else {

                                        socket.to(e.socket).emit(typingChannel, {
                                            type: false,
                                            typer: ""
                                        });
                                    }

                                }); /// For Loop

                            }

                        });

                    }, 0);

                });



                ///RoomListing

                db.query('SELECT * FROM chatroom_member WHERE user_id = ?', [userId], function(err, getUpdate) {

                    if (getUpdate.length) {

                        for (var i = 0; i < getUpdate.length; i++) {

                            if (!getUpdate[i].oppo_id) {

                                db.query('SELECT * FROM chatroom_member WHERE room_id = ?', [getUpdate[i].room_id], function(err, restapi) {

                                    if (restapi.length === 2) {

                                        for (var j = 0; j < restapi.length; j++) {

                                            if (restapi[j].user_id != userId) {
                                                db.query('UPDATE chatroom_member SET oppo_id = ? WHERE room_id = ? AND user_id = ?', [restapi[j].user_id, restapi[j].room_id, userId]);
                                            }

                                        }

                                    } else if (restapi.length) {
                                        db.query('UPDATE chatroom_member SET oppo_id = ? WHERE room_id = ? AND user_id = ?', [0, restapi[0].room_id, userId]);
                                    }

                                });

                            }

                            if ((getUpdate.length - 1) === i) {
                                roomlistfunc(socket, userId, 1, );
                            }

                        }

                    }

                });





                ////Room Data Emiting

                socket.on("roomDetails", function(roomDetails) {

                    clearTimeout(roomDetailsTimer);

                    roomDetailsTimer = setTimeout(function() {

                        var job = roomDetails.job,

                            room = roomDetails.room,

                            roomKey = roomDetails.roomKey;

                        //roomKey Check

                        db.query('SELECT * FROM chatroom_member WHERE user_id = ? AND room_id = ? AND token = ?', [userId, room, roomKey], function(err, roomMatch) {

                            if (roomMatch.length) {

                                var roomKeyDB = roomMatch[0].token;

                                if (roomKey === roomKeyDB) {

                                    db.query('UPDATE chatroom_member SET unread_msg = ? WHERE user_id = ? AND room_id = ?', [0, userId, room], function(err, res) {

                                        if (!err) {
                                            db.query('SELECT room_page_number,sortby FROM chatroom_preference WHERE user_id = ? LIMIT 0,1', [userId], function(err, eres) {

                                                if (eres.length) {
                                                    roomlistfunc(socket, userId, eres[0].room_page_number, eres[0].sortby);
                                                }

                                            });

                                        }

                                    })

                                    db.query('UPDATE chatroom_preference SET last_active_chatroom = ?,chatroom_last_msgid = (SELECT id FROM chatroom_messages WHERE room_id = ? ORDER BY id DESC LIMIT 0,1),chatroom_page = (SELECT ROUND(COUNT(*)/5)+1 as bcount FROM chatroom_messages WHERE room_id = ?),page_number = 1,media_current_page = 1, media_total_page = (SELECT ROUND(COUNT(*)/8)+1 as bcount FROM chatroom_messages WHERE room_id = ? AND type =1), history_chatroom = ? WHERE user_id = ?', [room, room, room, room, room, userId], function(err, updateprefer) {

                                        if (!err) {

                                            realTimeHeader(socket, room, roomKey);

                                            ///For Message List

                                            db.query('SELECT a.user_id,CONCAT (a.first_name, " ",a.last_name) AS user_name,a.image,a.msg_id,a.message,a.msg_status AS status,a.type,a.timestamp FROM (SELECT * FROM (SELECT id AS msg_id,room_id,user_id,message,status AS msg_status,type,timestamp FROM chatroom_messages WHERE room_id = ? ORDER BY ID DESC LIMIT 0,5) AS nsg INNER JOIN join_user ON nsg.user_id = join_user.id) AS a ORDER BY a.msg_id ASC', [room], function(err, oldMsg) {

                                                if (oldMsg.length) {
                                                    var initialmsg = [],
                                                        oldMsgChannel = "oldMsg";

                                                    for (var i = 0; i < oldMsg.length; i++) {

                                                        if ((i > 0) && (moment(oldMsg[i - 1].timestamp).format('D') < moment(oldMsg[i].timestamp).format('D'))) {
                                                            initialmsg.push({
                                                                onlyDate: moment(oldMsg[i].timestamp).format('ll')
                                                            });
                                                        }

                                                        initialmsg.push({
                                                            userId: oldMsg[i].user_id,
                                                            userName: oldMsg[i].user_name,
                                                            userPhoto: oldMsg[i].image,
                                                            messageId: oldMsg[i].msg_id,
                                                            messageText: oldMsg[i].message,
                                                            messageStatus: oldMsg[i].status,
                                                            messageType: oldMsg[i].type,
                                                            messageTime: oldMsg[i].timestamp,
                                                            onlyDate: false
                                                        })
                                                    }

                                                    socket.emit(oldMsgChannel, initialmsg);
                                                }

                                            });

                                        } // if updateprefer not error

                                    }); //Update SQL prefer

                                } //RoomKey Match With DB End

                            } //Check RoomRows Length End

                        }); ///RoomKey Check End

                    }, 0);

                }); //End RoomDetails Socket






                ///SortBy RoomList

                var sortByChannel = "sortByChannel";

                socket.on(sortByChannel, function(data) {

                    clearTimeout(sortByChannelTimer);

                    sortByChannelTimer = setTimeout(function() {

                        db.query('UPDATE chatroom_preference SET sortby = ? WHERE user_id = ?', [data.sort, userId]);

                        roomlistfunc(socket, userId, 1, data.sort);

                    }, 0);

                })



                ///Pagination

                var listPagination = "listPaging",

                    listPageCount = 1;

                socket.on(listPagination, function(listPage) {

                    listPageCount++

                    db.query('SELECT * FROM chatroom_preference WHERE user_id = ? LIMIT 0 , 1', [userId], function(err, dbListPage) {

                        var dbTotalPage = dbListPage[0].list_total_page,

                            dbCurrentPage = dbListPage[0].room_page_number;

                        if (dbTotalPage > dbCurrentPage) {

                            roomlistfunc(socket, userId, listPageCount, dbListPage[0].sortby);

                        }



                    });

                })





                ///Create New Group

                var newGroup = "newgroup";

                socket.on(newGroup, function(newgrpdata) {

                    newgroupdata(socket, userId, 1);

                });



                //Pagination

                var newGroupPagination = "newGroupPagination";

                groupPageCount = 1;

                socket.on(newGroupPagination, function(listPage) {

                    groupPageCount++

                    db.query('SELECT * FROM chatroom_preference WHERE user_id = ? LIMIT 0 , 1', [userId], function(err, dbListPage) {

                        var dbTotalPage = dbListPage[0].list_total_page,

                            dbCurrentPage = dbListPage[0].creategroup_page;

                        if (dbTotalPage > dbCurrentPage) {

                            newgroupdata(socket, userId, groupPageCount);

                        }



                    });

                })



                ///Recived new Chatroom Data

                var createChatroomDetails = "createChatroomDetails",

                    returnResults = "returnResults";

                socket.on(createChatroomDetails, function(datad) {

                    clearTimeout(createChatroomDetailsTimer);

                    createChatroomDetailsTimer = setTimeout(function() {

                        db.query('INSERT INTO chatroom_room SET ?', {

                            title: datad.name,

                            type: 2,

                            creator_id: userId

                        }, function(err, added) {

                            var insId = added.insertId;
                             insertMemberToGroup(userId,insId)

                            db.query('INSERT INTO chatroom_messages SET ?', {

                                user_id: userId,

                                room_id: insId,

                                message: 'Created chatroom..'

                            })
                            
         datad.user.forEach(e => { insertMemberToGroup(e,insId) })
                            socket.emit(returnResults, {

                                results: true

                            })

                        });

                    }, 0);

                });



                ////ContactLists

                var contactLists = "contactLists";

                socket.on(contactLists, function(contactListc) {

                    contactlistupdate(socket, userId, 1);

                })



                ///Pagination

                var contPagination = "contactListPaging",

                    contPageCount = 1;

                socket.on(contPagination, function(listPage) {

                    contPageCount++

                    db.query('SELECT * FROM chatroom_preference WHERE user_id = ? LIMIT 0 , 1', [userId], function(err, dbListPage) {

                        var dbTotalPage = dbListPage[0].list_total_page,

                            dbCurrentPage = dbListPage[0].contact_page_number;

                        if (dbTotalPage > dbCurrentPage) {

                            contactlistupdate(socket, userId, contPageCount);

                        }



                    });

                })



                ///Search Results 

                var searchResults = "searchResults";

                socket.on(searchResults, function(getSearch) {

                    if (getSearch.search === true) {

                        db.query('SELECT d.room_id,d.msngr,d.message,d.timestamp,d.token,d.oppo_id,d.image,d.name,d.job_id,d.title AS roomTitle,job.title AS jobTitle,d.type FROM(SELECT * FROM(SELECT b.room_id,b.msngr,b.message,b.timestamp,b.token,b.oppo_id,join_user.image,CONCAT(join_user.first_name, " ",join_user.last_name) AS name FROM(SELECT a.room_id,a.msngr,a.message,a.timestamp,chatroom_member.token,chatroom_member.oppo_id FROM(SELECT room_id,message,first_name AS msngr,timestamp FROM chatroom_messages INNER JOIN join_user ON join_user.id = chatroom_messages.user_id WHERE CONCAT(chatroom_messages.message,join_user.first_name,join_user.last_name) REGEXP ? AND chatroom_messages.type <> 1 AND chatroom_messages.room_id IN (SELECT room_id FROM chatroom_member WHERE user_id = ?) AND chatroom_messages.user_id <> ? GROUP BY chatroom_messages.room_id) AS a INNER JOIN chatroom_member ON a.room_id = chatroom_member.room_id AND chatroom_member.user_id = ?) AS b LEFT JOIN join_user ON join_user.id = b.oppo_id) AS c INNER JOIN chatroom_room ON chatroom_room.id = c.room_id)AS d LEFT JOIN job ON job.id = d.job_id', [getSearch.keywords.replace(' ', '|'), userId, userId, userId], function(err, results) {

                            if (results.length) {

                                socket.emit(searchResults, results);

                            } else {

                                socket.emit(searchResults, false);

                            }

                        });

                    }

                })





                //Group member list

                socket.on('groupMemberlist', function(data) {

                    if (data) {

                        db.query('SELECT user_id, CONCAT(join_user.first_name," ",join_user.last_name) AS name, image FROM(SELECT user_id FROM chatroom_member WHERE room_id = (SELECT last_active_chatroom FROM chatroom_preference WHERE user_id = ? LIMIT 0,1)) AS a INNER JOIN join_user ON join_user.id = a.user_id', [userId], function(err, results) {

                            if (results.length) {

                                socket.emit('groupMemberlist', results);

                            } else {

                                socket.emit('groupMemberlist', false);

                            }

                        })

                    }

                });



                ///UserProfile Info

                socket.on('roomUserProfile', function(data) {

                    db.query('SELECT a.*,cities.name AS city_name FROM (SELECT a.*,GROUP_CONCAT(skill.title SEPARATOR ", ") AS skill FROM(SELECT a.*,countries.name AS country_name FROM(SELECT * FROM join_user WHERE id = ?) AS a LEFT JOIN countries ON countries.id = a.country_id)AS a LEFT JOIN skill ON skill.id IN (SELECT skill_id FROM join_user_skill WHERE join_user_id = a.id)) AS a LEFT JOIN cities ON cities.id = a.city_id', [data], function(err, results) {

                        if (!err && results.length) {

                            socket.emit('roomUserProfile', {
                                id: results[0].id,
                                name: results[0].first_name + " " + results[0].last_name,
                                image: results[0].image,
                                description: results[0].desc,
                                skill: results[0].skill,
                                city: results[0].city_name,
                                country: results[0].country_name
                            });

                        } else {

                            socket.emit('roomUserProfile', false)

                        }

                    })

                });



                //Group Name Editing...

                var groupNewName;

                socket.on('groupNameEdit', function(data) {

                    groupNewName = data;

                    db.query('SELECT * FROM chatroom_member WHERE room_id = (SELECT last_active_chatroom FROM chatroom_preference WHERE user_id = ?)', [userId], function(err, results) {

                        if (results.length) {

                            db.query('UPDATE chatroom_room SET title = ? WHERE id = ?', [groupNewName, results[0].room_id]);

                            realTimeHeader(socket, results[0].room_id, results[0].token);

                        }

                    })

                })



                socket.on('groupNotification', function(data) {

                    db.query('UPDATE chatroom_member SET notification = ? WHERE user_id = ? AND room_id = (SELECT last_active_chatroom FROM chatroom_preference WHERE user_id = ? LIMIT 0,1)', [data, userId, userId]);

                })




                ///Here Was RoomDetails..



                var moreMessageChannel = "moreMsg";



                socket.on(moreMessageChannel, function(moreMsgs) {

                        db.query('SELECT * FROM chatroom_preference WHERE user_id = ? LIMIT 0,1', [userId], function(err, chprefer) {

                                if (chprefer.length) {

                                    var roomNo = chprefer[0].last_active_chatroom,

                                        roomLastMsg = chprefer[0].chatroom_last_msgid,

                                        havePages = chprefer[0].chatroom_page,

                                        countPage = chprefer[0].page_number;

                                    if (havePages > countPage) {

                                        db.query('UPDATE chatroom_preference SET page_number = page_number+1 WHERE user_id = ?', [userId], function(err, uresults) {});

                                        db.query('SELECT a.user_id,CONCAT (a.first_name, " ",a.last_name) AS user_name,a.image,a.msg_id,a.message,a.msg_status AS status,a.type,a.timestamp FROM (SELECT * FROM (SELECT id AS msg_id,room_id,user_id,message,status AS msg_status,type,timestamp FROM chatroom_messages WHERE room_id = ? AND id <= ? ORDER BY ID DESC LIMIT ?,5) AS nsg INNER JOIN join_user ON nsg.user_id = join_user.id) AS a ORDER BY a.msg_id ASC', [roomNo, roomLastMsg, countPage * 5], function(err, emoreMsgs) {

                                            if (emoreMsgs.length) {

                                                var moreinitialmsg = [];

                                                for (var i = 0; i < emoreMsgs.length; i++) {

                                                    if ((i > 0) && (moment(emoreMsgs[i - 1].timestamp).format('D') < moment(emoreMsgs[i].timestamp).format('D'))) {

                                                        moreinitialmsg.push({

                                                            onlyDate: moment(emoreMsgs[i].timestamp).format('ll')

                                                        })

                                                    }





                                                    moreinitialmsg.push({

                                                        userId: emoreMsgs[i].user_id,

                                                        userName: emoreMsgs[i].user_name,

                                                        userPhoto: emoreMsgs[i].image,

                                                        messageId: emoreMsgs[i].msg_id,

                                                        messageText: emoreMsgs[i].message,

                                                        messageStatus: emoreMsgs[i].status,

                                                        messageType: emoreMsgs[i].type,

                                                        messageTime: emoreMsgs[i].timestamp,

                                                        onlyDate: false

                                                    })

                                                }



                                                socket.emit(moreMessageChannel, moreinitialmsg);

                                            } else {

                                                socket.emit(moreMessageChannel, false);

                                            }

                                        });





                                    } else {

                                        socket.emit(moreMessageChannel, false);

                                    }



                                } //chprefer length end

                            }) // ch prefer end

                    }) ///More Message End





                //Media Message Channel

                var mediaMessageChannel = "mediaMessage";

                socket.on(mediaMessageChannel, function(moreMsgs) {

                        db.query('SELECT * FROM chatroom_preference WHERE user_id = ? LIMIT 0,1', [userId], function(err, chprefer) {

                                if (chprefer.length) {

                                    var roomNo = chprefer[0].last_active_chatroom,

                                        havePages = chprefer[0].media_total_page,

                                        countPage = chprefer[0].media_current_page;



                                    if (havePages >= countPage) {

                                        db.query('UPDATE chatroom_preference SET media_current_page = media_current_page+1 WHERE user_id = ?', [userId], function(err, uresults) {

                                            if (!err) {

                                                db.query('SELECT a.user_id,CONCAT (a.first_name, " ",a.last_name) AS user_name,a.image,a.msg_id,a.message,a.msg_status AS status,a.type,a.timestamp FROM (SELECT * FROM (SELECT id AS msg_id,room_id,user_id,message,status AS msg_status,type,timestamp FROM chatroom_messages WHERE room_id = ? AND type = 1 ORDER BY ID DESC LIMIT 0,?) AS nsg INNER JOIN join_user ON nsg.user_id = join_user.id) AS a ORDER BY a.msg_id ASC', [roomNo, countPage * 8], function(err, emoreMsgs) {

                                                    if (emoreMsgs.length) {

                                                        var moreinitialmsg = [];

                                                        for (var i = 0; i < emoreMsgs.length; i++) {

                                                            if ((i > 0) && (moment(emoreMsgs[i - 1].timestamp).format('D') < moment(emoreMsgs[i].timestamp).format('D'))) {

                                                                moreinitialmsg.push({

                                                                    onlyDate: moment(emoreMsgs[i].timestamp).format('ll')

                                                                })

                                                            }





                                                            moreinitialmsg.push({

                                                                userId: emoreMsgs[i].user_id,

                                                                userName: emoreMsgs[i].user_name,

                                                                userPhoto: emoreMsgs[i].image,

                                                                messageId: emoreMsgs[i].msg_id,

                                                                messageText: emoreMsgs[i].message,

                                                                messageStatus: emoreMsgs[i].status,

                                                                messageType: emoreMsgs[i].type,

                                                                messageTime: emoreMsgs[i].timestamp,

                                                                onlyDate: false

                                                            })

                                                        }



                                                        socket.emit(mediaMessageChannel, moreinitialmsg);

                                                    } else {

                                                        socket.emit(mediaMessageChannel, false);

                                                    }

                                                });

                                            }

                                        });



                                    }



                                } //chprefer length end

                            }) // ch prefer end

                    }) ///Media Message End





                ////Settings Data

                var settingsChannel = "settingsData";

                socket.on(settingsChannel, function(data) {

                    var settingsUpdate = [],

                        settingSQL = 'UPDATE chatroom_preference SET ',

                        sarrayValue = data.out_office ? [data.out_office, userId] : [userId];

                    data.notification ? settingsUpdate.push(`desktop_notification = ${data.notification}`) : ``;

                    data.unread_msg ? settingsUpdate.push(`send_msg_to_mail = ${data.unread_msg}`) : ``;

                    data.interval ? settingsUpdate.push(`send_msg_interval = ${data.interval}`) : ``;

                    data.onpress_enter ? settingsUpdate.push(`onpress_enter = ${data.onpress_enter}`) : ``;

                    data.out_office ? settingsUpdate.push(`out_of_office_msg = ?`) : ``;

                    if (settingsUpdate.length) {

                        for (var i = 0; i < settingsUpdate.length; i++) {

                            settingSQL += i == settingsUpdate.length - 1 ? `${settingsUpdate[i]} WHERE user_id = ?` : `${settingsUpdate[i]},`;

                        }

                        db.query(settingSQL, sarrayValue, function(err, results) {

                            if (!err) {

                                socket.emit('settingSuccess', true);

                                settingsDataSending(socket, userId);

                            } else {

                                socket.emit('settingSuccess', false);

                            }

                        });



                    }



                });







                socket.on('exitGroup', d => {

                    db.query('DELETE FROM chatroom_member WHERE room_id = (SELECT last_active_chatroom FROM chatroom_preference WHERE user_id = ?) AND user_id = ?', [userId, userId], function(err, results) {

                        socket.emit('exitGroup', err ? false : true);

                    });

                });



                socket.on('groupContactRemove', d => {

                    db.query('DELETE FROM chatroom_member WHERE room_id = (SELECT last_active_chatroom FROM chatroom_preference WHERE user_id = ?) AND user_id = ?', [userId, d], function(err, results) {

                        socket.emit('groupContactRemove', err ? false : true);

                    });

                });





//// Add To People To Group
socket.on("addToGroup",d => {
let sql1 = `SELECT a.*,GROUP_CONCAT(CONCAT(b.first_name," ",b.last_name)) AS users FROM (SELECT id AS group_id,title FROM chatroom_room WHERE type = 2 AND id IN (SELECT room_id FROM chatroom_member WHERE user_id = ?)) a LEFT JOIN join_user b ON (b.id IN (SELECT user_id FROM chatroom_member WHERE room_id = a.group_id) AND b.id <> ?) GROUP BY a.group_id`,
    sql2 = `SELECT a.*,b.title AS job_title FROM(SELECT id,CONCAT(first_name," ",last_name) AS name,image FROM join_user WHERE id IN (SELECT user_id FROM chatroom_member WHERE room_id IN (SELECT room_id FROM chatroom_member WHERE user_id = ?) AND user_id <> ?)) a LEFT JOIN job b ON b.id = (SELECT MAX(job_id) FROM chatroom_room WHERE (creator_id = ? AND create_for = a.id) OR (creator_id = a.id AND create_for = ?) )`,
    sql = d == 1 ? sql1 : d == 2 ? sql2 : false,
    value = d == 1 ? [userId,userId] : d == 2 ? [userId,userId,userId,userId] : false;
if(sql && value){
db.query(sql,value, (err,res) => {
 socket.emit('addToGroup',!err && res.length ? res : false);
});
}else{
	 socket.emit('addToGroup',false);
}
});


socket.on("sendAddToGroup",d => {
let type = d.room_type,
    items = d.items,
    checkSQL = `SELECT a.*,b.create_for FROM(SELECT last_active_chatroom FROM chatroom_preference WHERE user_id = ?) a LEFT JOIN chatroom_room b ON b.id = a.last_active_chatroom`,
    checkSQLv = [userId];
if(checkSQL && checkSQLv){
db.query(checkSQL,checkSQLv,(err,res) => {
    if(!err && res.length){
let create_for = res[0].create_for,
    lastRoom = res[0].last_active_chatroom;

items.forEach( e => { 
	insertMemberToGroup(type == 1 ? create_for : type == 2 ? e : false,type == 1 ? e : type == 2 ? lastRoom : false)
})
    	socket.emit("sendAddToGroup",true)


    }else{
    	socket.emit("sendAddToGroup",false)
    }
})
}

})



socket.on('isSomeThingChange',d => {

db.query("SELECT a.*,chatroom_member.token AS my_token FROM (SELECT  * FROM chatroom_preference WHERE user_id = ? LIMIT 0,1) AS a LEFT JOIN chatroom_member ON chatroom_member.room_id = a.last_active_chatroom AND chatroom_member.user_id = a.user_id",[userId],(err,res) =>{

if(!err && res.length){
    let last_active_chatroom = res[0].last_active_chatroom,
        token = res[0].my_token;
roomlistfunc(socket,userId,res[0].room_page_number,res[0].sortby);

if(d.type == 1){
contactlistupdate(socket,userId,res[0].contact_page_number);
newgroupdata(socket,userId,res[0].creategroup_page);
}

if(d.room && d.type == 1){
    db.query("SELECT * FROM chatroom_member WHERE room_id = ? AND user_id = ?",[last_active_chatroom,d.userId],(err, res) => {
        if(!err && res.length){
                realTimeHeader(socket,last_active_chatroom,token);
        }
    });
}


}
});

});




                socket.on('disconnect', function() {
  
                    isSomeThingChange(socket,userId);
                    db.query('UPDATE chatroom_preference SET socket = ?,list_total_page = ?, room_page_number = ?, contact_page_number = ?,last_active_chatroom = ?, chatroom_last_msgid = ?,chatroom_page = ?, page_number = ?, is_active = ?, active_update_time = ?,sortby = ? WHERE user_id = ?', [, , , , , , , , , moment().format("YYYY-MM-DD HH:mm:ss"), , userId])

                    clearTimeout(socketTimer);
                })





            } // Userinfo length

        }); // User Info Result








    }, 0);

}); //Main Socket Connection End