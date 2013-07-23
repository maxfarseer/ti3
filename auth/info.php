<?php require_once 'config.inc.php'; ?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ru">
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
    <title></title>
</head>
<body>

<?php if (isset($_SESSION['user'])) {
    $user = $_SESSION['user'];
    if (!is_null($user->socialId))
    echo "Социальный ID пользователя: " . $user->socialId . '<br />';

    if (!is_null($user->name))
    echo "Имя пользователя: " . $user->name . '<br />';

    if (!is_null($user->email))
    echo "Email: пользователя: " . $user->email . '<br />';

    if (!is_null($user->socialPage))
    echo "Ссылка на профиль пользователя: " . $user->socialPage . '<br />';

    if (!is_null($user->sex))
    echo "Пол пользователя: " . $user->sex . '<br />';

    if (!is_null($user->birthday))
    echo "День Рождения: " . $user->birthday . '<br />';

    // аватар пользователя
    if (!is_null($user->avatar))
    echo '<img src="' . $user->avatar . '" />'; echo "<br />";
    echo '<p><a href="auth/logout.php">Выйти из системы</a></p>';
} else {
    echo '<p><a href="index.html">Войдите в систему</a> для того, чтобы увидеть данный материал.</p>';
} ?>

</body>
</html>