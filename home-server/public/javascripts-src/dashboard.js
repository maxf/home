$(function() {
  'use strict';

  var TimeBox = React.createClass({
    render: function() {
      return (
        <div className="timeBox">
          Hello world! I am a timebox
        </div>
      );
    }
  });

  React.render(
    <TimeBox/>,
    document.getElementById('content')
  );


  $.get('/media',
    function(data) {
      console.log(data);
    }
  );
});
