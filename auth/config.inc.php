<?php
$db = mysql_connect('localhost','ti3','trusisutra');
mysql_select_db('ti3')or die("ERROR: ".mysql_error());
mysql_query("SET NAMES utf8");

session_start();