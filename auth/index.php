<?php

require_once 'lib/SocialAuther/autoload.php';
require_once 'config.inc.php';

function linkss($prov){
switch ($prov){
	case "vk":
		echo '<script type="text/javascript" src="http://vk.com/js/api/share.js?85" charset="windows-1251"></script>
		<script type="text/javascript"><!--
		document.write(VK.Share.button(false,{type: "link_noicon", text: "Рассказать друзьям"}));
		--></script>';
	break;
	case "mailru":
		echo '<a class="btn-share-link" href="http://connect.mail.ru/share?share_url">Рассказать друзьям</a>';
	break;
	case "yandex":
		echo '<a class="btn-share-link" target=”_blank” rel=”nofollow” href="http://my.ya.ru/posts_add_link.xml?title=Выбери ТОП 3 команд TI 3&URL='.$_SERVER['HTTP_HOST'].'">поделиться</a>';
	break;
	case "facebook":
		echo '<a class="btn-share-link" rel=”nofollow” target=”blank” href="http://www.facebook.com/sharer.php?u='.$_SERVER['HTTP_HOST'].'">поделиться</a>';
	break;
}}

$adapterConfigs = array(
    'vk' => array(
        'client_id'     => '3719561',
        'client_secret' => '73dknderV6TYXHRKLUkA',
        'redirect_uri'  => 'http://ti3top.ru/auth/?provider=vk'
    ),
   /* 'odnoklassniki' => array(
        'client_id'     => '',
        'client_secret' => '',
        'redirect_uri'  => 'http://localhost/auth?provider=odnoklassniki',
        'public_key'    => 'CBADCBMKABABABABA'
    ),*/
    'mailru' => array(
        'client_id'     => '706578',
        'client_secret' => 'ce2acdf36b515ce64e71f30d1d2b6d52',
        'redirect_uri'  => 'http://ti3top.ru/auth?provider=mailru'
    ),
    'yandex' => array(
        'client_id'     => '56462c1004744843a978f0d1cf5bf633',
        'client_secret' => '634cd0e2642b4d88b84055b83f7b0189',
        'redirect_uri'  => 'http://ti3top.ru/auth?provider=yandex'
    ),
    'google' => array(
        'client_id'     => '932885368040.apps.googleusercontent.com',
        'client_secret' => 'bL09OTjggvYZnpPNWTqI5XzM',
        'redirect_uri'  => 'http://ti3top.ru/auth?provider=google'
    ),
    'facebook' => array(
        'client_id'     => '468660439888779',
        'client_secret' => '0b2a5b4d2d13211bf48d70e7014c33c1',
        'redirect_uri'  => 'http://ti3top.ru/auth?provider=facebook'
    )
);

$adapters = array();
foreach ($adapterConfigs as $adapter => $settings) {
    $class = 'SocialAuther\Adapter\\' . ucfirst($adapter);
    $adapters[$adapter] = new $class($settings);
}

if (isset($_GET['provider']) && array_key_exists($_GET['provider'], $adapters) && !isset($_SESSION['user'])) {
    $auther = new SocialAuther\SocialAuther($adapters[$_GET['provider']]);

    if ($auther->authenticate()) {

        $result = mysql_query(
            "SELECT *  FROM `users` WHERE `provider` = '{$auther->getProvider()}' AND `social_id` = '{$auther->getSocialId()}' LIMIT 1"
        );

        $record = mysql_fetch_array($result);
		$user = new stdClass();
		
        if (!$record) {
            $values = array(
                $auther->getProvider(),
                $auther->getSocialId(),
                $auther->getName(),
                $auther->getEmail(),
                $auther->getSocialPage(),
                $auther->getSex(),
                date('Y-m-d', strtotime($auther->getBirthday())),
                $auther->getAvatar()
            );

            $query = "INSERT INTO `users` (`provider`, `social_id`, `name`, `email`, `social_page`, `sex`, `birthday`, `avatar`) VALUES ('";
            $query .= implode("', '", $values) . "')";
            $result = mysql_query($query);
			
			$user->ID     			= mysql_insert_id();
        } else {
            $userFromDb = new stdClass();
            $userFromDb->provider   = $record['provider'];
            $userFromDb->socialId   = $record['social_id'];
            $userFromDb->name       = $record['name'];
            $userFromDb->email      = $record['email'];
            $userFromDb->socialPage = $record['social_page'];
            $userFromDb->sex        = $record['sex'];
            $userFromDb->birthday   = date('m.d.Y', strtotime($record['birthday']));
            $userFromDb->avatar     = $record['avatar'];
			$userFromDb->ID     	= $record['id'];
			
			$user->ID     			= $record['id'];
			$user->time_beg     	= $record['time_beg'];
			$user->time_end     	= $record['time_end'];
			$user->vtime_beg     	= $record['vtime_beg'];
			$user->vtime_end     	= $record['vtime_end'];
			$user->skill     		= $record['skill'];
			$user->search_1    		= $record['search_1'];
			$user->search_2    		= $record['search_2'];
			$user->role    			= $record['role'];
        }

       
        $user->provider   = $auther->getProvider();
        $user->socialId   = $auther->getSocialId();
        $user->name       = $auther->getName();
        $user->email      = $auther->getEmail();
        $user->socialPage = $auther->getSocialPage();
        $user->sex        = $auther->getSex();
        $user->birthday   = $auther->getBirthday();
        $user->avatar     = $auther->getAvatar();
		
		$query = "SELECT *  FROM `polls` WHERE oprosnik = 1 and id_user = ".$user->ID." LIMIT 1";//(select id from users where provider = '".$user->provider."' and social_id = ".$user->socialId." limit 1 )
		$result = mysql_query($query);
		$user->poll1=(mysql_num_rows($result)<1);
		
        if (isset($userFromDb) && $userFromDb != $user) {
            $idToUpdate = $record['id'];
            $birthday = date('Y-m-d', strtotime($user->birthday));

            mysql_query(
                "UPDATE `users` SET " .
                "`social_id` = '{$user->socialId}', `name` = '{$user->name}', `email` = '{$user->email}', " .
                "`social_page` = '{$user->socialPage}', `sex` = '{$user->sex}', " .
                "`birthday` = '{$birthday}', `avatar` = '$user->avatar' " .
                "WHERE `id`='{$idToUpdate}'"
            );
        }

        $_SESSION['user'] = $user;
		
		$lists = new stdClass();
		
		if(!isset($_SESSION['lists'])){
			$result = mysql_query("SELECT * from roles");

			while($row = mysql_fetch_assoc($result)) {
				$rol[$row['id_role']]=$row['role'];
			}		
			$lists->roles = $rol;
			}
			
		if(!isset($_SESSION['lists'])){
			$result = mysql_query("SELECT * from skills");

			while($row = mysql_fetch_assoc($result)) {
				$rol[$row['id_skill']]=$row['skill'];
			}		
			$lists->skills = $rol;
			}
			
		$_SESSION['lists'] = $lists;
    }

    header("location:/index.html");
}
?>

<?php
/*
if (isset($_SESSION['user'])) {
    echo '<p><a href="auth/info.php">Скрытый контент</a></p>';
} else if (!isset($_GET['code']) && !isset($_SESSION['user'])) {
    foreach ($adapters as $title => $adapter) {
        echo '<p><a href="' . $adapter->getAuthUrl() . '">Аутентификация через ' . ucfirst($title) . '</a></p>';
    }
}*/
?>

