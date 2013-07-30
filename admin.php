<?php 
include_once ("userpoll.php");
 if (isset($_SESSION['user'])&& $_SESSION['user']->admin==1){
	$sex=getSex();
	$all=0;
	foreach($sex as $key=>$value){
		if($key!="") $$key=$value; else $ono=$value;
		$all+=$value;
	}

	$pro=getProv();
	foreach($pro as $key=>$value){
		$$key=$value;
	}
	$ComIn=getComIn();
	$ComOut=getComOut();

	$golosov=getPollCol();
	include_once ("tpl_admin.php");
}