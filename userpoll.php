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
}
?>