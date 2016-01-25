$(function() {

  var $advancedTrigger = $('.advanced-trigger');

  $('.advanced').hide();

  $('.advanced-trigger').on('click', function() {
    $(this).next('.advanced').toggle();
  });

  $("[name='timerMode']").bootstrapSwitch({onSwitchChange: timerModeChange});

  $("[name='switchedOn']").bootstrapSwitch({onSwitchChange: switchChange});

  function switchChange(event, state) {
    $(event.target).parents('form').submit()
  }

  function timerModeChange(event, state) {
    var $socket = $(event.target).parents('.socket');
    var $timerCtrl = $socket.find('.timer');
    var $onOffCtrl = $socket.find('.switchedOn');
    var socketId = $socket.find('form input[name=id]').val();

    if (state) {
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
