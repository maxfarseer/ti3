<head>
<? include_once('connect.php');?>
<script type="text/javascript" src="//vk.com/js/api/openapi.js?96"></script>
<script type="text/javascript">
  VK.init({apiId: 3719561});
</script>

<div id="vk_api_transport"></div>
<script type="text/javascript">
  window.vkAsyncInit = function() {
    VK.init({
      apiId: 3719561
    });
  };

  setTimeout(function() {
    var el = document.createElement("script");
    el.type = "text/javascript";
    el.src = "http://vk.com/js/api/openapi.js";
    el.async = true;
    document.getElementById("vk_api_transport").appendChild(el);
  }, 0);
</script>
<script type="text/javascript">

 VK.Widgets.Auth("vk_auth", {width: "200px", onAuth: function(data) {
 alert('id user: '+data['uid']+'\n Name: '+data['first_name']+'\n Familia: '+data['last_name']+'\n foto: '+data['photo']);
 } });
 
 VK.Api.call('users.get', {fields: 'nickname,bdate,photo_100,online,contacts,counters,activities, interests, movies, tv, books, games, about, quotes'}, function(r) { 
  if(r.response) {
	var line="�� � ����";
	if(r.response[0].online)line="� ����"; debugger;
	document.getElementById('profile').innerHTML = '������,'+ r.response[0].nickname+'<br> ���: ' + r.response[0].first_name+'<br> �������: ' + r.response[0].last_name+
	'<br> ��: ' + r.response[0].bdate+'<br> <img src="' + r.response[0].photo_100+'"> <br> ������: ' +line+'<br>�������: '+r.response[0].home_phone+
	'<br> ������: '+r.response[0].counters.friends+'<br> ������������: '+r.response[0].activities+'<br> ��������: '+r.response[0].interests+
	'<br> ����: '+r.response[0].movies+'<br> ��: '+r.response[0].tv+'<br> �����: '+r.response[0].books+'<br> ����: '+r.response[0].games+
	'<br> � ����: '+r.response[0].about+'<br> ������: '+r.response[0].quotes;
  } 
}); 
 
</script>

</head>
<body>
<!-- Put this div tag to the place, where Auth block will be -->
<div id="vk_auth"></div>
<div id="profile"></div>
</body>

