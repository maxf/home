/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

var fs = require('fs');

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'homepage'
  },

  '/media': function(req, res) {
    var fileNameRe = new RegExp("^[0-9]+-([0-9]{14})-[0-9]+\.jpg$");
    var dirContents = fs
      .readdirSync('assets/media')
      .filter(function(fileName) { return fileNameRe.test(fileName); })
      .map(function(fileName) {
        var matches = fileName.match(fileNameRe);
        console.log(matches);
        return {'src': '/media/'+matches[0],
                'date': matches[1]};
      });
    res.json(dirContents);
  },


// router.get('/:date', function(req, res, next) {
//   var date = req.params.date;
//   var dirContents = fs
//     .readdirSync('public/images/media')
//     .filter(function(fileName) {
//       var re=new RegExp('^'+date+'.*\.jpg$');
//       return re.test(fileName); }) ;
//   res.json(dirContents);
// });

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

  '/sockets/': 'SocketController.socketsPage'
};
