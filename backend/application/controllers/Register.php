<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Register extends CI_Controller {

	
	public function index()
	{
		session_start();
		$response = array();
		$this->load->model('mainmodel');
		if($this->mainmodel->register($_POST)){
			$response['name'] = $_POST['name'];
			$response['email'] = $_POST['email'];
			$response['id'] = md5(uniqid().date("h:i a"));
			$_SESSION['id'] = $response['id'];
			$response['status'] = "success";
		}else{
			$response['status'] = "faild";
		}

		echo json_encode($response);
	}
}
