$(function() {

  $('.socket input[name=timerMode]').on('change', timerModeChange);


  function timerModeChange(event) {
    var $socket = $(event.target).parents('.socket');
    var $timerCtrl = $socket.find('.timer');
    var $onOffCtrl = $socket.find('.switchedOn');
    var socketId = $socket.find('form input[name=id]').val();

    if (event.target.value === 'on') {
      $.ajax({
	url: '/socket/' + socketId,
	type: 'PUT',
	contentType: 'application/json',
	data: '{ "timerMode": true }'
      }).success(function() {
        $timerCtrl.show();
        $onOffCtrl.hide();
      });
    } else {
      $.ajax({
	url: '/socket/' + socketId,
	type: 'PUT',
	contentType: 'application/json',
	data: '{ "timerMode": false }'
      }).success(function() {
        $timerCtrl.hide();
        $onOffCtrl.show();
      });
    }
  };


});
