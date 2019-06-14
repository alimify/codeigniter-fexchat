<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Desktop Notification</title>
</head>
<body>
	<button id="notify">Notify me!</button>
	<script>
		
window.addEventListener('load', function () {
 
var notify = document.getElementById('notify');

notify.addEventListener('click', function(e) {
      e.preventDefault();
      if (!window.Notification) {
            alert("Sorry, Notification Not supported in this Browser!");
      } else {
            if (Notification.permission === 'default') {
                  Notification.requestPermission(function(p) {
                        if (p === 'denied')
                              alert('You have denied Notification from FexJob.Com');
                        else {
                              notifying = new Notification('Notification Enabled...', {
                                    body: 'You have successfully enabled notification..."',
                                    icon: 'icon_will_be_here..',
                                    tag: "notificationStatus"
                              });
                        }
                  });
            } else {
                  notifying = new Notification('Notification Already Enabled....', {
                        body: 'Notification is Already enabled..."',
                        icon: 'icon_link_will_be_here..',
                        tag: "notificationStatus"  
                  });
            }
      }
});
});

	</script>
</body>
</html>