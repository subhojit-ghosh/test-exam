<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Exam extends CI_Controller {

	
	public function index()
	{
        session_start();
        $subject = array();
        if($_SESSION['id'] == $_POST['id']){
            $this->load->model('mainmodel');
			$subject_array = $this->mainmodel->get_subject();

			for($i=0;$i<count($subject_array);$i++){
				array_push($subject, $subject_array[$i]->name);
			}
			echo json_encode($subject);
        }else{
            echo 'CSRF';
        }

    }
    

    public function total_question(){

        session_start();
        if($_SESSION['id'] == $_POST['id']){
			$this->load->model('mainmodel');
			$questions = $this->mainmodel->get_question($_POST['sub']);
			echo count($questions);
        }else{
            echo 'CSRF';
        }

    }

    public function get_question(){

        session_start();
        if($_SESSION['id'] == $_POST['id']){
			$question = array();
			$this->load->model('mainmodel');
			$questions = $this->mainmodel->get_question($_POST['sub']);

			$question['question'] = $questions[$_POST['num']]->question;
			$question['op1'] = $questions[$_POST['num']]->op1;
			$question['op2'] = $questions[$_POST['num']]->op2;
			$question['op3'] = $questions[$_POST['num']]->op3;
			$question['op4'] = $questions[$_POST['num']]->op4;
			$question['ans'] = $questions[$_POST['num']]->ans;

			echo json_encode($question);
        }else{
            echo 'CSRF';
        }

    }
}
