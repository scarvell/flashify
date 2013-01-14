flashify = require('../lib/flashify');
expect = require('expect.js');

var req, res, next;

describe("flashify", function() {

  beforeEach(function() {
    req = {
      session: {}
    };
    res = {
      locals: {},
    };
    next = function() { };
  });

  it("should throw error when no session", function() {
    expect(function() {
      flashify({}, res, next);
    }).to.throwError(/Sessions must be enable/);
  });

  it("should call next function afterward", function(done) {
    flashify(req, res, done);
  });

  describe("#req.flash", function() {
    beforeEach(function() {
      flashify(req, res, next);
    });

    it("should set flash message to session", function() {

      req.flash("test");
      expect(req.session.flash[0].type).to.be("message");
      expect(req.session.flash[0].message).to.be("test");

    });

    it("should set named message to session", function() {
      req.flash("info", "hello flash");
      expect(req.session.flash[0].type).to.be("info");
      expect(req.session.flash[0].message).to.be("hello flash");
    });

    it("should set multiple messages", function() {
      req.flash("test");
      req.flash("info", "hello flash");
      expect(req.session.flash[0].message).to.be("test");
      expect(req.session.flash[1].message).to.be("hello flash");
    });
  });

  describe("#res.locals.flash", function() {
    beforeEach(function() {
      flashify(req, res, next);
    });

    it("should return flash message", function() {
      req.flash("hello flash");
      expect(res.locals.flash.message[0]).to.be("hello flash");
    });

    it("should remove session.flash after load", function() {
      req.flash("test");
      expect(req.session.flash[0].message).to.be("test");
      res.locals.flash
      expect(req.session.flash).to.be(undefined);
      expect(res.locals.flash.message[0]).to.be("test");
    });

    it("should return multiple messages", function() {
      req.flash("test");
      req.flash("error", "error");
      req.flash("info", "info");
      req.flash("test2");

      expect(res.locals.flash.message[0]).to.be("test");
      expect(res.locals.flash.message[1]).to.be("test2");
      expect(res.locals.flash.error[0]).to.be("error");
      expect(res.locals.flash.info[0]).to.be("info");
    });
  });
});
