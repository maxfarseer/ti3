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
function getComand($inout){
	$inout=($inout)? "comand_in = 1":"comand_out = 1";
	$otvet='SELECT name, skill.skill, social_page, avatar, time_beg, time_end, vtime_beg, vtime_end, user_role, search_1_role, search_2_role FROM 
		(select  users.role as "id_role", roles.role as "user_role", users.* from users, roles where users.role=roles.id_role)role
		join (select users.search_1 as "id_role_search_1", roles.role as "search_1_role", users.id from users, roles where users.search_1=roles.id_role)search_1 on role.id=search_1.id
		join (select users.search_2 as "id_role_search_2", roles.role as "search_2_role", users.id from users, roles where users.search_2=roles.id_role)search_2 on role.id=search_2.id
		join (select users.skill as "id_skill", skills.skill, users.id from users, skills where users.skill=skills.id_skill)skill on role.id=skill.id
		where '.$inout.' ORDER BY RAND() LIMIT 5';
	$otvet= mysql_query($otvet) or die("</br>ERROR: ".mysql_error());
	return $otvet;
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
		$upd="UPDATE users SET `skill` = ".$obj['skill'].", `role`= ".$obj['role'].", `search_1`= ".$obj['search1'].", `search_2`= ".$obj['search2'].", `time_beg`= '".$obj['time_beg']."', `time_end`= '".$obj['time_end']."', `vtime_beg`= '".$obj['vtime_beg']."', `vtime_end`= '".$obj['vtime_end']."', `comand_in`= ".$obj['comand_in'].", `comand_out`=".$obj['comand_out']." where `id`= ".$_SESSION['user']->ID;
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
			
			$otvet= getComand(1);
			
			while($row = mysql_fetch_assoc($otvet)) {
			$arr.='	<div class="team__user__wrapper">
                    <div class="team__user__ava"><img src="'.$row['avatar'].'" alt="Pro"></div>
                    <div class="team__user">
                        <div class="team__user__item"><i class="icon-star"></i><span class="t__user t__user-skill">'.$row['skill'].'</span></div>
                        <div class="team__user__item"><i class="icon-tag"></i><span class="t__user t__user-spec">'.$row['user_role'].'</span></div>
                        <div class="team__user__item"><i class="icon-time"></i>Будни: <span class="t__user t__user-wd">'.substr($row['time_beg'],0,5).'-'.substr($row['time_end'],0,5).'</span></div>
                        <div class="team__user__item"><i class="icon-time"></i>Выхи*: <span class="t__user t__user-vd">'.substr($row['vtime_beg'],0,5).'-'.substr($row['vtime_end'],0,5).'</span>
                        </div>
                        <div class="team__user__item team__user__item-bottom"><i class="icon-envelope"></i><a href="'.$row['social_page'].'" class="t__user t__user-link">Связаться</a></div>
                    </div>
                </div>';
			}
			print_r($arr);
	break;

				
	case "getComandIn":
		$otvet= getComand(1);
		while($row = mysql_fetch_assoc($otvet)) {
		$arr.='	<div class="team__user__wrapper">
				<div class="team__user__ava"><img src="'.$row['avatar'].'" alt="Pro"></div>
				<div class="team__user">
					<div class="team__user__item"><i class="icon-star"></i><span class="t__user t__user-skill">'.$row['skill'].'</span></div>
					<div class="team__user__item"><i class="icon-tag"></i><span class="t__user t__user-spec">'.$row['user_role'].'</span></div>
					<div class="team__user__item"><i class="icon-time"></i>Будни: <span class="t__user t__user-wd">'.substr($row['time_beg'],0,2).'-'.substr($row['time_end'],0,2).'</span></div>
					<div class="team__user__item"><i class="icon-time"></i>Выхи*: <span class="t__user t__user-vd">'.substr($row['vtime_beg'],0,2).'-'.substr($row['vtime_end'],0,2).'</span>
					</div>
					<div class="team__user__item team__user__item-bottom"><i class="icon-envelope"></i><a href="'.$row['social_page'].'" class="t__user t__user-link">Связаться</a></div>
				</div>
			</div>';
		}
		//$arr=json_encode($arr,JSON_FORCE_OBJECT);
		//$arr=json_encode($arr);
		print_r($arr);
	break;
	
	case "getComandOut":
		$otvet= getComand(0);
		while($row = mysql_fetch_assoc($otvet)) {
		
		$arr.='	<div class="team__user__wrapper">
                    <div class="team__user__ava"><img src="'.$row['avatar'].'" alt="Pro"></div>
                    <div class="team__user">
                        <div class="team__user__item"><i class="icon-star"></i><span class="t__user t__user-skill">'.$row['skill'].'</span></div>
                        <div class="team__user__item"><i class="icon-plus-sign"></i><span class="t__user t__user-spec">'.$row['search_1_role'].'</span></div>
                        <div class="team__user__item"><i class="icon-plus-sign"></i><span class="t__user t__user-spec">'.$row['search_2_role'].'</span></div>
                        <div class="team__user__item"><i class="icon-time"></i>Будни: <span class="t__user t__user-wd">'.substr($row['time_beg'],0,2).'-'.substr($row['time_end'],0,2).'</span></div>
                        <div class="team__user__item"><i class="icon-time"></i>Выхи*: <span class="t__user t__user-vd">'.substr($row['vtime_beg'],0,2).'-'.substr($row['vtime_end'],0,2).'</span>
                        </div>
                        <div class="team__user__item team__user__item-bottom"><i class="icon-envelope"></i><a href="'.$row['social_page'].'" class="t__user t__user-link">Связаться</a></div>
                    </div>
                </div>';
		}
		print_r($arr);
	break;
}