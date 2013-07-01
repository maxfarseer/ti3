<?php
$db = mysql_connect('mysql.brainshake2.jino.ru','045230160_ti3','JF8h2_198fhz');
mysql_select_db('brainshake2_ti3')or die("ERROR: ".mysql_error());
mysql_query("SET NAMES utf8");

session_start();