    /*
    -- Chat Service Done By Abdul Alim Jewel 
    */
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
listen('change', aSelector('#upload input[name=uploadImage]'),fileSendToServer);