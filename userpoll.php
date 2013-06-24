<?php 
/*echo json_encode(array(
    'ok' => true,
    'x' => 41,
    'y' => 2
));
echo $_POST['myData'];*/

$obj = json_decode($_POST['myData'],true);
foreach ($obj as $key=>$val) {
echo '<br>'.$key.'  '.$val;
}

?>