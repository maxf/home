$(function() {
  'use strict';

  var DayList = React.createClass({
    loadDaysFromServer: function() {
      $.get('/media',
            function(data) {
              this.setState({data: data});
              data.map(function(day) { dayGraph.build(day); });
            }.bind(this)
      );
    },
    getInitialState: function() {
      return {data: []};
    },
    componentDidMount: function() {
      this.loadDaysFromServer();
      setInterval(this.loadDaysFromServer, this.props.pollInterval);
    },
    render: function() {
      var dayBoxes = this.state.data.map(function (day) {
        return (
            <DayBox key={day.date} data={day}/>
        );
      });
      return (
        <div className="dayList">
            {dayBoxes}
        </div>
      );
    }
  });

  var DayBox = React.createClass({
    render: function() {
      var date = this.props.data.date;
      var events = this.props.data.events;
      return (
        <div className="dayBox">
          <h2 className="dayBoxDate">{date}</h2>
          <svg id={'day-'+date}></svg>
        </div>
      );
    }
  });

  var Event = React.createClass({
    render: function() {
      return (
        <div className="event">
           <a href={this.props.data.href+'.mp4'}><img src={this.props.data.href+'.jpg'} width="100px"/></a>
        </div>
      );
    }
  });

  React.render(
    <DayList url="/media" pollInterval={10000000} />,
    document.getElementById('content')
  );


});


//          {this.props.data.events.map(function (event) { return ( <Event key={event.date} data={event}></Event> ); })}
