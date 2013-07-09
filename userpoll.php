<?php 
require_once 'auth/config.inc.php';

function getPoll(){
			$otvet="SELECT name,SUM(val)as 'summa' FROM polls JOIN comands USING(id_com) group by(id_com) order by(summa) DESC";
			$otvet= mysql_query($otvet) or die("</br>ERROR: ".mysql_error());
			while($row = mysql_fetch_assoc($otvet)) {
			$arr[$row['name']]=$row['summa'];
			}
			return json_encode($arr);
}

switch ($_POST['data']){
	case "poll":
	if (isset($_SESSION['user'])){
		$query = "SELECT *  FROM `polls` WHERE oprosnik = 1 and id_user = ".$_SESSION['user']->ID." LIMIT 1";//(select id from users where provider = '".$user->provider."' and social_id = ".$user->socialId." limit 1 )
		$result = mysql_query($query);
		
		if(mysql_num_rows($result)<1){ 
			$obj = json_decode($_POST['myData'],true);
			print_r($obj);
			foreach ($obj as $key=>$val) {
				$golos="INSERT into polls (id_user,id_com,oprosnik,val) values ('".$_SESSION['user']->ID."', '".$key."', '1', '".$val."')";
				mysql_query($golos) or die("</br>ERROR: ".mysql_error());
				}
				echo getPoll();
		}
		else
			echo '{"error":"Вы уже проголосовали!"}';
	} break;
	
	case "refresh":
		echo getPoll();
	break;
	
	case "user_prof":
		$obj = json_decode($_POST['prof'],true);
		$upd="UPDATE users SET `skill` = ".$obj['skill'].", `role`= ".$obj['role'].", `search_1`= ".$obj['search1'].", `search_2`= ".$obj['search2'].", `time_beg`= '".$obj['time_beg']."', `time_end`= '".$obj['time_end']."', `vtime_beg`= '".$obj['vtime_beg']."', `vtime_end`= '".$obj['vtime_end']."', `comand_in`= ".$obj['comand_in'].", `command_out`=".$obj['comand_out']." where `id`= ".$_SESSION['user']->ID;
		if(mysql_query($upd)){
			$_SESSION['user']->time_beg     	= $obj['time_beg'];
			$_SESSION['user']->time_end     	= $obj['time_end'];
			$_SESSION['user']->vtime_beg     	= $obj['vtime_beg'];
			$_SESSION['user']->vtime_end     	= $obj['vtime_end'];
			$_SESSION['user']->skill     		= $obj['skill'];
			$_SESSION['user']->search_1    		= $obj['search_1'];
			$_SESSION['user']->search_2    		= $obj['search_2'];
			$_SESSION['user']->role    			= $obj['role'];
		}
		else
			die("</br>ERROR: ".mysql_error());
	break;
	
	case "getComandIn":
			$otvet="SELECT * FROM users JOIN skills ON users.skill=skills.id_skill where comand_in = 1 ORDER BY RAND() LIMIT 5";
			$otvet= mysql_query($otvet) or die("</br>ERROR: ".mysql_error());
			
			while($row = mysql_fetch_assoc($otvet)) {
			//$arr[$row['name']]=$row['summa']; !!!!!!
			echo $row['name']." ";
			}
	break;
}