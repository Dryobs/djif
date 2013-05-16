<?php
	require_once('classes/media.php');
	$url = $_POST['url'];
	$type = $_POST['component'];

	$media = new Media( $url );
	$media = $media->getMedia($type);
	
	if($media->isValid()) {
		echo $media->render('preview', array('[[width]]' => '', '[[height]]' => ''));
	} else {
		include('templates/errors/invalidresource.php');
	}
?>
