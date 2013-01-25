/*
 * @package   flashify
 * @description: Middleware for setting flashes in Express 3 via req
 * @version   0.1.0
 * @author    Brendan Scarvell <bscarvell@gmail.com>
 *
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

 var flashify;

 flashify = function(req, res, next) {
   var f, flash, _i, _len, _ref;
   flash = [];

   // Make sure we have session support
   if(req.session == undefined ) throw Error('Sessions must be enabled for Flashify to work.');

   /**
    * Set request flash for user
    *
    * If only 1 argument is passed, flashify will use that value
    * as the message. If the same type is used, it will queue the messages
    * into a convenient array.
    *
    * Examples:
    *   req.flash('hello world!');
    *   req.flash('error', 'Invalid username')
    *   req.flash('error', 'here is another error')
    *   // => [ message: [ 'hello world!' ], error: [ 'Invalid username', 'here is another error' ],
    *
    * @param {String} type
    * @param {String} message (optional)
    * @return {void}
    * @api private
    */

   req.flash = function(type, message) {
     if (!(req.session.flash != null)) {
       req.session.flash = [];
     }

     // Set the default type if only 1 argument passed
     if (arguments.length === 1) {
       message = type;
       type = 'message';
     }
     return req.session.flash.push({
       type: type,
       message: message
     });
   };

    res.flash = function(type, message) {
      res.locals.flash = res.locals.flash || [];
      res.locals.flash[type] = res.locals.flash[type] || [];
      res.locals.flash[type].push(message);
    };

    res.oldRedirect = res.redirect;
    res.redirect = function() {
      for (var type in res.locals.flash) {
        res.locals.flash[type].forEach(function(message) {
          req.flash(type, message);
        });
      }
      res.oldRedirect.apply(this, arguments);
    };

   // If we have any flash messages, stack them up
   if (req.session.flash != null) {
     _ref = req.session.flash;
     for (_i = 0, _len = _ref.length; _i < _len; _i++) {
       f = _ref[_i];
       if (flash[f.type] != null) {
         flash[f.type].push(f.message);
       } else {
         flash[f.type] = [];
         flash[f.type].push(f.message);
       }
     }
   }

   res.locals.flash = flash;
   delete req.session.flash;

   // Continue on with application
   return next();
 };

 module.exports = flashify;
