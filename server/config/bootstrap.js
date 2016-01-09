/* global Socket, SocketService, sails */

/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {
  setTimeout(function() {
    if (sails.config.globals.socketsApiUrl) {
      sails.log('Starting scheduler. Sockets URL is ',
                sails.config.globals.socketsApiUrl);
      SchedulerService.updateAll(function() {
        setInterval(SchedulerService.tick, 60000);
      });
    } else {
      sails.log('Warning: SOCKETS_API_URL environment variable not defined. Not starting the scheduler');
    }
  }, 3000);

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
