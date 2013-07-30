<?
/*
$vk, $facebook, $google, $yandex, $mailru - кол-во по соцсетям
$ComIn, $ComOut - кол-во вступят/возьмут 
$golosov - всего челов проголосовало
$all  - всего зарегано
$male - мужиков
$female - женщин
$ono - неопределен пол
*/
?>

<div class="admin__stats">
	<div class="stats__item">
		<div class="stats__header">*** РЕЖИМ БОГА ***</div>
	</div>
	
	<div class="stats__separator"></div>
	<div class="stats__item">
		<i class="icon-user"></i> <?=$all?> (из них проголосовало <span class="stats__pollcount"><?=$golosov?>)<br/>
		<i class="icon-cog"></i> VK: <?=$vk?><br/>
		<i class="icon-cog"></i> FB: <?=$facebook?><br/>
		<i class="icon-cog"></i> Yandex: <?=$yandex?><br/>
		<i class="icon-cog"></i> Google: <?=$google?><br/>
		<i class="icon-cog"></i> Mail.ru: <?=$mailru?><br/>
	</div>
	<div class="stats__separator"></div>
	<div class="stats__item">
		<i class="icon-globe"></i> Мужики: <?=$male?><br/>
		<i class="icon-globe"></i> Тетки: <?=$female?><br/>
		<i class="icon-globe"></i> Чудо: <?=$ono?><br/>
	</div>
	<div class="stats__separator"></div>
	<div class="stats__item">
		<i class="icon-search"></i> Вступят: <?=$ComIn?><br/>
		<i class="icon-search"></i> Возьмут <?=$ComOut?><br/>
	</div>
</div>
