<?php

class Sequence {

	var $n;
	var $type;
	var $limit;
	var $text;

	function __construct($dao, $type, $infinite=null) {
		if(isset($_POST['n']) && is_numeric($_POST['n'])) {
			$this->n = $_POST['n'];
		} else {
			$this->n = 0;
		}
		$this->type = $type;
		if($type == 'wtf' ) {
			$this->limit = -1;
			switch ($this->n) {
				case 0:
					$this->text = 'Another !';
					break;
				case 1:
					$this->text = 'Another one !';
					break;
				case 2:
					$this->text = 'Yet another !';
					break;
				case 3:
					$this->text = 'Again !';
					break;
				case 4:
				case 5:
					$this->text = 'And again !';
					break;
				case 6:
					$this->text = 'Please another one';
					break;
				case 7:
					$this->text = 'Just one more !';
					break;
				case 8:
					$this->text = 'Or two ?';
					break;
				case 9:
					$this->text = 'Good things come in threes';
					break;
				case 10:
					$this->text = 'Ok last one';
					break;
				case 11:
					$this->text = 'Shouldn\'t I be working ?';
					break;
				case 12:
					$this->text = 'Last one this time';
					break;
				case 13:
					$this->text = 'But this time I mean it';
					break;
				case 14:
					$this->text = 'I promise';
					break;
				case 15:
					$this->text = 'I can quit anytime';
					break;
				case 16:
					$this->text = 'It\'s not like I\'m addicted';
				case 17:
					$this->text = 'I kan haz lil moa ?';
					break;
				default:
					$this->text = 'Ok I\'ll stop last year';
					break;
			}
			if($this->n == $this->limit-1) {
				$this->text = 'Shit ! Only one left';
			}
		} else {
			$this->limit = $dao->countDjif()-1;
		}
	}

	public function getRange() {
		return array($this->n, min(SEQUENCE_SIZE, $this->limit - $this->n));
	}

	public function getMsg() {
		return $this->text;
	}

	public function command($cmd) {
		if($cmd == 'prev' && $this->n > 0) {
			$pholders = array(
				'[[target]]' => $this->type,
				'[[text]]' => '<',
				'[[n]]' => max($this->n - SEQUENCE_SIZE, 0)
			);
			echo replacePlaceHolders(file_get_contents('templates/buttons/command.html'), $pholders);
		} else if ($cmd == 'next' && $this->n + SEQUENCE_SIZE < $this->limit) {
			$pholders = array(
				'[[target]]' => $this->type,
				'[[text]]' => '>',
				'[[n]]' => $this->n + SEQUENCE_SIZE
			);
			echo replacePlaceHolders(file_get_contents('templates/buttons/command.html'), $pholders);
		} else if ($cmd == 'random') {
			$pholders = array(
				'[[target]]' => 'wtf',
				'[[text]]' => $this->text,
				'[[n]]' => $this->n+1
			);
			echo replacePlaceHolders(file_get_contents('templates/buttons/command.html'), $pholders);
		}
	}

}

