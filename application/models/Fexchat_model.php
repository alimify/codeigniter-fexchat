<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*************
** FexJob Chat Service
** Version : 1.0
** Developer : Abdul Alim Jewel
*************/


class Fexchat_model extends CI_Model {
public function __construct() {
 		parent::__construct();
 		$this->load->database();
 	}


public function userInfo($id) {
	   $query = $this->db->get_where('chatroom_preference',array( 'user_id' => $id));
	   $count = $query->num_rows();
	   if(!$count){$this->db->insert('chatroom_preference', array('user_id' => $id));}
		$sql = "SELECT id,CONCAT(first_name,' ',last_name) AS name,image,role_id,chat_token FROM join_user WHERE id = $id";
    	$data = $this->db->query($sql)->row_array();
    	return $data;
	}



public function haveChat($id)
{
	$this->db->select_min('room_id');
    return $this->db->get_where('chatroom_member',array('user_id' => $id))->row_array()['room_id'];
}

public function getHistoryChat($id)
{
$this->db->select("history_chatroom");
$ghcdata = $this->db->get_where("chatroom_preference",array('user_id' => $id));
return $ghcdata->num_rows() ? $ghcdata->row_array()['history_chatroom'] : false;
}

public function chatInfo($id){
$history_chatroom = $this->getHistoryChat($id);
if($history_chatroom){
	$room_id = $history_chatroom;
}elseif ($this->haveChat($id)) {
 $room_id = $this->haveChat($id);
}else{
	$room_id = 0;
}
return $this->db->query("SELECT job_id, room_id, token FROM (SELECT room_id,token FROM chatroom_member WHERE user_id = $id AND room_id = $room_id ) AS a LEFT JOIN chatroom_room ON chatroom_room.id = a.room_id")->row_array();
}


public function getJobInfo($job)
{
$job_info = $this->db->get_where('job',array('id' => $job));
return $job_info->num_rows() ? $job_info->row_array() : false;
}

public function isGroupCreated($job,$owner,$freelancer)
{
$isinserted = $this->db->get_where('chatroom_room',array('job_id' => $job,'creator_id' => $owner, 'create_for' => $freelancer));
return $isinserted->num_rows() ? $isinserted->row_array()['id'] : false;
}


public function createGroup($job,$freelancer,$con_int = 2)
{
$jobinfo = $this->getJobInfo($job);
$isinserted = $this->isGroupCreated($job,$jobinfo['join_user_id'],$freelancer);
if($isinserted){
	$return = $isinserted;
}elseif($this->db->insert('chatroom_room', array('job_id' => $job, 'creator_id' => $jobinfo['join_user_id'],'create_for' => $freelancer, 'title' => $jobinfo['title'], 'type' => 1,'con_int' => $con_int))){
$return = $this->db->insert_id();
}else{
	$return = false;
}

return $return;

//return $isinserted ? $isinserted :  ? $this->db->insert_id() : false;
}


public function isGroupMember($group,$user)
{
$is_member = $this->db->get_where('chatroom_member',array('room_id' => $group, 'user_id' => $user));
return $is_member->num_rows() ? $is_member->row_array() : false;
}

public function lastMsg($group,$user)
{
return $this->db->query("SELECT message FROM chatroom_messages WHERE room_id = $group AND user_id = $user ORDER BY id DESC LIMIT 0,1")->row_array();
}


public function isMessageOwner($id,$who)
{
$res = $this->db->get_where("chatroom_messages",array("id" => $id,"user_id" => $who))->row_array();
return $res['message'] ? $res['message'] : false;
}


public function getGroupToken($group,$user)
{
return $this->db->get_where('chatroom_member',array('room_id' => $group, 'user_id' => $user))->row_array()['token'];
}


public function getJobIdFromGroupid($group)
{
$is = $this->db->get_where("chatroom_room",array("id" => $group));
return $is->num_rows() ? $is->row_array()['job_id'] : false;
}



public function insertMessage($group,$user,$message,$type = 0)
{
$is_msg_enter = $this->lastMsg($group,$user);
return $is_msg_enter['message'] != $message ? $this->db->insert('chatroom_messages',array('user_id' => $user, 'room_id' => $group, 'message' => $message, 'type' => $type)) : true;
}

public function insertMember($group,$user)
{

return $this->isGroupMember($group,$user) ? true : $this->db->insert('chatroom_member',array('user_id' => $user, 'room_id' => $group , 'token' =>  uniqid().'ro'.$group.'ub'.$user.'ji'));
}

public function updateContOrInt($group,$con_int)
{
$this->db->where("id", $group);
$its = $this->db->update('chatroom_room', array('con_int' => $con_int));
return $its ? $group : false;
}




public function createChat($job,$con_int,$freelancer,$who,$message)
{
$jobinfo = $this->getJobInfo($job);
if($jobinfo){
$insertedall_id = $this->isGroupCreated($job,$jobinfo['join_user_id'],$freelancer);

$insert_id = false;
if($insertedall_id && $con_int){
	$insert_id = $this->updateContOrInt($insertedall_id,$con_int);
}elseif ($insertedall_id) {
$insert_id = $insertedall_id;
}else if($job && $con_int && $freelancer && $who && $message){
	$insert_id = $this->createGroup($job,$freelancer,$con_int);
}

//$insert_id = $insertedall_id && $con_int ? $this->updateContOrInt($insertedall_id,$con_int) : $insertedall_id ? $insertedall_id : $this->createGroup($job,$freelancer,$con_int);
if($insert_id){
$ownerins = $this->insertMember($insert_id,$jobinfo['join_user_id']);
$freelancerins = $this->insertMember($insert_id,$freelancer);
if($message) {$msg_entry = $this->insertMessage($insert_id,$who,$message);}

if($ownerins && $freelancerins){
	$returndata['room_id'] = $insert_id;
	$returndata['job_id'] = $job;
	$returndata['room_token'] = $this->getGroupToken($insert_id,$who);
	$return = $returndata;
}

	}
}
	return isset($return) ? $return : false;

}


public function LastChatProf($client,$freelancer)
{
$sql = "SELECT MAX(id),room_id FROM chatroom_messages WHERE room_id IN (SELECT id FROM chatroom_room WHERE creator_id = $client AND create_for = $freelancer )";
$query = $this->db->query($sql);
return $query->num_rows() ? $query->row_array()['room_id'] : false;
}


public function profileChat($currentUser,$userRole,$profile,$job)
{
$client = $userRole == 5 ? $currentUser : $profile;
$freelancer = $userRole == 4 ? $currentUser : $profile;

$ifalready = $this->isGroupCreated($job,$client,$freelancer);
$LastChatProf = $this->LastChatProf($client,$freelancer);

$groupid = false;
$jobid = false;
$token = false;
if($job){$groupid = $ifalready;}elseif($LastChatProf){$groupid = $LastChatProf;}
if($groupid && $job){$jobid = $job;}elseif($groupid){$jobid = $this->getJobIdFromGroupid($groupid);}

//$groupid = $job ? $ifalready : $LastChatProf ? $LastChatProf : false;
//$jobid = $groupid && $job ? $job : $groupid ? $this->getJobIdFromGroupid($groupid) : false;
$token = $groupid ? $this->getGroupToken($groupid,$currentUser) : false;

$returndata['room_id'] = $groupid;
$returndata['job_id'] = $jobid;
$returndata['room_token'] = $token;

return $returndata;
}



public function deleteMessage($mid,$who,$text,$status = 2,$type = 0)
{
$return = $this->isMessageOwner($mid,$who);
if($return){
$data = array("message" => $text , "type" => $type,"status" => $status);
$res = $this->db->update('chatroom_messages', $data, array('id' => $mid));
$messageD = $this->db->get_where("chatroom_messages",array("id" =>$mid))->row_array();
}
return isset($res) && isset($messageD) && $messageD['status'] == 2 ? $return : false;
}


public function getActiveMemberList($room_id)
{
$sql = "SELECT a.*,b.is_active FROM (SELECT id,email FROM join_user WHERE id IN (SELECT user_id FROM chatroom_member WHERE room_id = $room_id)) a INNER JOIN chatroom_preference b ON b.user_id = a.id AND b.is_active != 1 AND (b.send_msg_to_mail = 1 || b.send_msg_to_mail = 2 )";
return $this->db->query($sql)->result();
}



////End Of Class
}