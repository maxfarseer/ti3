<?php

require_once 'lib/SocialAuther/autoload.php';
require_once 'config.inc.php';

$adapterConfigs = array(
    'vk' => array(
        'client_id'     => '3720076',
        'client_secret' => 'hNuKZ5QOwD8l6gSc2pmb',
        'redirect_uri'  => 'http://ti3.mozgi43.ru/auth/?provider=vk'
    ),
    'odnoklassniki' => array(
        'client_id'     => '',
        'client_secret' => '',
        'redirect_uri'  => 'http://localhost/auth?provider=odnoklassniki',
        'public_key'    => 'CBADCBMKABABABABA'
    ),
    'mailru' => array(
        'client_id'     => '706578',
        'client_secret' => 'ce2acdf36b515ce64e71f30d1d2b6d52',
        'redirect_uri'  => 'http://ti3.mozgi43.ru/auth?provider=mailru'
    ),
    'yandex' => array(
        'client_id'     => '56462c1004744843a978f0d1cf5bf633',
        'client_secret' => '634cd0e2642b4d88b84055b83f7b0189',
        'redirect_uri'  => 'http://ti3.mozgi43.ru/auth?provider=yandex'
    ),
    'google' => array(
        'client_id'     => '932885368040.apps.googleusercontent.com',
        'client_secret' => 'bL09OTjggvYZnpPNWTqI5XzM',
        'redirect_uri'  => 'http://ti3.mozgi43.ru/auth?provider=google'
    ),
    'facebook' => array(
        'client_id'     => '468660439888779',
        'client_secret' => '6d596bc89932f5d76fc49f933daf6ded',
        'redirect_uri'  => 'http://ti3.mozgi43.ru/auth?provider=facebook'
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
        }

        $user = new stdClass();
        $user->provider   = $auther->getProvider();
        $user->socialId   = $auther->getSocialId();
        $user->name       = $auther->getName();
        $user->email      = $auther->getEmail();
        $user->socialPage = $auther->getSocialPage();
        $user->sex        = $auther->getSex();
        $user->birthday   = $auther->getBirthday();
        $user->avatar     = $auther->getAvatar();

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
    }

    header("location:/index2.html");
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

