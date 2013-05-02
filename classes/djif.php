<?php

class Djif {
	
	var $gif;
	var $audio;
	var $db;

	function __construct($param1, $param2=NULL ) {
		$this->db =  new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);
		if ($this->db->connect_errno) {
			die ("Could not connect db " . DB_NAME . "\n" . $link->connect_error);
		}
		if (! $param2 && strlen($param1) == 5) { // from hash
			$hash = $this->db->real_escape_string(substr($param1,0,5));
			$result = $this->db->query("SELECT gif, audio FROM urls WHERE hash = '$hash'");
			$row = $result->fetch_assoc();
			$result->free();
			
			$gif = new Media( $row["gif"] );
			$this->gif = $gif->getMedia();
				
			$audio = new Media( $row["audio"] );
			$this->audio = $audio->getMedia();
			
		} else { // from two urls
			
			$gif = new Media( $param1 );
			$this->gif = $gif->getMedia();
			
			$audio = new Media( $param2 );
			$this->audio = $audio->getMedia();
		}
	}


	public function getPlaceholders() {
		return array(
				'keys' => array(
						'[[gif]]',
						'[[audio]]'
				),
				'values' => array(
						$this->gif->render(),
						$this->audio->render()
				)
		);
	}
	
	
	public function getTemplate() {
		$fileName = 'templates/djif.html';
		if( file_exists( $fileName ) ) {
			return file_get_contents( $fileName );
		} else {
			return false;
		}
	}

	public function render() {
		$placeholders = $this->getPlaceholders();
		return str_replace( $placeholders['keys'] , $placeholders['values'] , $this->getTemplate() );
	}

	public function store() {
		$charset = array_merge(range(0,9), range('a','z'), range('A', 'Z'));
		$hash = '';
		for ($i=0; $i < 5; $i++) {
			$hash .= $charset[array_rand($charset)];
		}
		$insert = "INSERT INTO urls(hash, gif, audio, ip) VALUES ('$hash', '";
		$insert .= $this->db->real_escape_string($this->gif->getUrl()) . "', '";
		$insert .= $this->db->real_escape_string(audio->getUrl()) . "', '";
		$insert .= ip2long ($this->db->real_escape_string($_SERVER['REMOTE_ADDR'])) . "')";
		if(! $this->db) {
			die('Lost connection to database !');
		}
		$result = $this->db->query($insert);
		$url = 'http://' . $_SERVER['SERVER_NAME'] . '/' . $hash;
		return str_replace( array('[[url]]'), array($url), file_get_contents ('templates/link.html') );
	}

}
?>
