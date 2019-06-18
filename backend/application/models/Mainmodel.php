<?php


class Mainmodel extends CI_Model{


    public function register($data){

        $user = $this->db->where(['name'=>$data['name'], 'email'=>$data['email']])->get('users');
        if($user->num_rows() > 0){
            return true;
        }else{
            return $this->db->insert('users', $data);
        }

    }


    public function get_subject(){

        $this->db->select('name');
        $this->db->from('subjects');
        $subjects = $this->db->get();

        if($subjects->num_rows() > 0){
            return $subjects->result();
        }

    }


    public function get_question($sub){

        $subject = rawurldecode($sub);
        $question = $this->db->where(['subject'=>$subject])->get('questions');
        if($question->num_rows() > 0){
        return $question->result();
        }

    }


}


?>