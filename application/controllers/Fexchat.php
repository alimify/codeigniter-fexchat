<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Fexchat extends CI_Controller {

/*************
** FexJob Chat Service
** Version : 1.0
** Developer : Abdul Alim Jewel
*************/

public function __construct() {
        parent::__construct();
        $this->load->helper('url');
        $this->load->library('session');
        $currentpage = $this->uri->segment(2);
                $this->load->model('Fexchat_model', 'chat');
                
        $mid = isset($_GET['id']) ? $_GET['id'] : 0; 
        if($mid) {
            $this->session->set_userdata('userId',$mid);
        }

        $user_id = $this->session->userdata('userId');
        
        if(!$user_id){
            exit('Confirm to pass user id..');
        }
        $this->userinfo = $this->chat->userInfo(intval($user_id)); 
        //print_r($this->userinfo);
    }


public function index()
{
//echo $this->chat->createChat( 69, false,  34, 29,false)['room_token'];
//echo "Here I'm working.....";
 $chatinfo = $this->chat->chatInfo($this->userinfo['id']);
 $job_id = $chatinfo['job_id'];
 $room_id = $chatinfo['room_id'];
 $room_key = $chatinfo['token'];

if($room_id && $room_key){
redirect(base_url('fexchat/jobroom/'.intval($job_id).'/'.$room_id.'/'.$room_key)); exit();
}else{
$this->userinfo['job_id'] = 0;
$this->userinfo['room_id'] = 0;
$this->userinfo['room_key'] = 0;
$this->userinfo['load'] = 'default';
$this->load->view('fexchat/templete',$this->userinfo);
}


}


public function default($code = 0)
{
$this->userinfo['job_id'] = 0;
$this->userinfo['room_id'] = 0;
$this->userinfo['room_key'] = 0;
$data = $this->userinfo;
$data['code'] = $code;
$data['load'] = 'default';
$this->load->view('fexchat/templete',$data);
}



public function jobroom($job = 0,$room = 0, $key = 0)
{

$this->userinfo['job_id'] = $job;
$this->userinfo['room_id'] = $room;
$this->userinfo['room_key'] = $key;
$this->userinfo['load'] = $key ? 'chat' : 'default';
$this->load->view('fexchat/templete',$this->userinfo);
}


public function profileChat($profile = 0,$job = 0)
{
$isdata = $this->chat->profileChat($this->userinfo['id'],$this->userinfo['role_id'],$profile,$job);
//print_r($isdata);
$this->userinfo['job_id'] = $isdata['job_id'];
$this->userinfo['room_id'] = $isdata['room_id'];
$this->userinfo['room_key'] = $isdata['room_token'];
$this->load->view("fexchat/profileChat",$this->userinfo);
}



public function file_upload()
{
$filuploaded = false;
$filenames = false;
$this->output->set_content_type('application/json');
if(isset($_FILES['file1']['name']) && $this->session->userdata('userId')){
$config['upload_path']          = './uploads/fexchat/';
$config['allowed_types']        = '*';
$config['remove_spaces'] = TRUE;
$config['file_name']            = $_POST['id'].'_'.$_FILES['file1']['name'];
$this->load->library('upload', $config);
$this->upload->initialize($config);
if($this->upload->do_upload('file1')){
$filuploaded = true;
$filenames = $this->upload->data('file_name');
}

    }
$json = array();
$json['response'] = $filuploaded;
$json['file'] = $filenames;
$this->output->set_output(json_encode($json));
}


public function deleteFile($mid = 0)
{
$this->output->set_content_type('application/json');
$return = $this->chat->deleteMessage($mid,$this->userinfo['id'],'This file have been removed...');
$files = explode(",", $return);
$count = count($files);

$json = array();
$json['response'] = $count>2 ? true : $return ? true : false;
$json['filename'] = $count>2 ? $files[3] : false;
$path = $count>2 ? $_SERVER['DOCUMENT_ROOT'].'/uploads/fexchat/'.$files[3] : '';
if(file_exists($path) && $count>2){
  unlink($path);
}
$this->output->set_output(json_encode($json));
}

public function desktop_notification_enable()
{
$this->load->view('fexchat/desktop_notification_enable');
}




public function sendMailTo($toMail,$name,$toMessage)
{
$fromMail = "no-reply@fexjob.com";
if($toMail && $toMessage && $fromMail){
$message = '
<body>
    <style>
        /* Column Drop Layout Pattern CSS */
        table{
            margin: 0 auto;
        }
        @media only screen and (max-width: 450px) {
            td[class="column"] {
                display: block;
                width: 100%;
                -moz-box-sizing: border-box;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
            }
        }
    
    </style>
    <table cellpadding="0" cellspacing="0">
        <tr>
            <td class="column" width="600" colspan="2" align="left" valign="top" style="padding: 10px 20px 20px 20px; background: #fff; font-family: arial,sans-serif; font-size: 14px; line-height: 18px; color: #000001;">
                <a href="http://fexjob.com" class="item" style="display: flex;justify-content: center;">
                    <img src="http://fexjob.com/assets/images/logo.png" class="">
                </a>
                <div style="padding: 2em 1em;">
                    <h1 style="font-weight:200;text-align:center">'.$name.'</h1>
                    <p style="line-height: 20px;text-align:center">
                       '.$toMessage.'
                    </p>
                    <p style="display:flex;justify-content:center"><a href="http://fexjob.com/Fexchat" style="background-color: #ff4500;color:#fff;text-decoration: none;padding: .5em 1em;border-radius: 3px;display:flex;justify-content:center;text-align:center;">Reply</a></p>
                </div>
                <div class="" style="padding-top:15px;padding-right:0;padding-bottom:0;padding-left:0;margin-top:30px;color:#b3b3b1;font-size:12px;text-align:center;border-top:1px solid #e5e5e5">Sent by
                    <a class=""
                        href="https://fexjob.com" style="color:#ff4500;text-decoration:underline"
                        target="_blank">Fexjob</a>  &nbsp;&nbsp;
                    <a href="h" style="color:#b3b3b1;">Address, Port Harcourt Nigeria.</a>
                    <div>
                        <a class="" href=""
                            style="color:#8e8e8e;text-decoration:underline" target="_blank" >Unsubscribe</a> from this type of email ·
                        <a class=""
                            href="https://fexjob.com/help" style="color:#8e8e8e;text-decoration:underline" target="_blank">Help center</a> ·
                        <a class=""
                            href="" style="color:#8e8e8e;text-decoration:underline"
                            target="_blank">Privacy policy</a>
                    </div>
                </div>
            </td>
        </tr>
        <tr>
            <td align="center" width="100%">
                <table width="auto" align="center" border="0" cellspacing="0" cellpadding="0">
                    <tbody>
                        <tr>
                            <td>
                                <a href="https://www.facebook.com/faxjob" target="_blank" style="color: transparent">
                                    <img src="http://fexjob.com/assets/images/facebook.png"
                                        width="24" alt="Facebook" border="0" class="CToWUd">
                                </a>&nbsp;
                                <a href="https://twitter.com/fexjob" target="_blank" style="color: transparent">
                                    <img src="http://fexjob.com/assets/images/twitter.png"
                                        width="24" alt="Twitter" border="0" class="CToWUd">
                                </a>&nbsp;
                                <a href="https://plus.google.com/" target="_blank" style="color: transparent" >
                                    <img width="24" src="http://fexjob.com/assets/images/gplus.png"
                                        alt="Google+" border="0" class="CToWUd">
                                </a>&nbsp;
                                <a href="https://www.instagram.com/fexjobofficial" target="_blank" style="color: transparent" >
                                    <img width="24" src="http://fexjob.com/assets/images/instagram.png"
                                        alt="Instagram" border="0" class="CToWUd">
                                </a>&nbsp;
                            </td>
                            <td width="16"></td>
                            
                            <td width="4"></td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
       
    </table>
</body>
';


// load mail library
$this->load->library('email');

// Email configuration
$config = Array(
                'protocol' => 'mail',
                'mailtype' => 'html',
                'charset' => 'iso-8859-1',
                'wordwrap' => TRUE,
                'crlf' => '\r',
                'newline' => '\n'
            );


// send email to freelancer
$this->email->initialize($config);
$this->email->from($fromMail, 'FexJob: New Message');
$this->email->to($toMail);
//$this->email->cc('another@another-example.com');
//$this->email->bcc('them@their-example.com');
$this->email->subject('New Message From FexJob');
$this->email->message($message);
//$this->email->set_newline("\r\n");
if($this->email->send()){
    $isMailSend = true;
}

}
return isset($isMailSend) ? true : false;
}

public function sendMsgToOfflineUser()
{
    $rId = intval($_POST['rId']);
    $name = $_POST['name'];
    $message = $_POST['message'];
    echo $rId.$name.$message;
if(!$rId){exit("RidMiss");}
$data = $this->chat->getActiveMemberList($rId);
if(!$data){return;}
foreach ($data as $key => $value) {
    $this->sendMailTo($value->email,$name,$message);
}
}


public function createChat($freelancer,$who,$message){
$res = $this->chat->createChat(1,1,$freelancer,$who,$message);
var_dump($res);
}


///This Is End Of Class 
}
