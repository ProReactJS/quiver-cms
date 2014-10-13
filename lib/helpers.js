module.exports = function (options) {
  var moment = require('moment'),
    expressHandlebars = require('express-handlebars'),
    handlebars = expressHandlebars.create(),
    Showdown = require('showdown'),
    mdConverter = new Showdown.converter();

  return {
    active: function (href, url) {
      return href === url ? 'active' : '';
    },

    s3: function (key) {
      return 'https://s3.amazonaws.com/' + options.bucket + '/' + key;
    },

    deSlug: function (name) {
      var name = name.split('.')[0],
        parts = name.split('-'),
        i = parts.length;

      while (i--) {
        parts[i] = parts[i].charAt(0).toUpperCase() + parts[i].slice(1);
      }

      return parts.join(' ');
    },

    calendar: function (date) {
      return moment(date).calendar();
    },

    markdown: function (md) {
      return new handlebars.handlebars.SafeString(mdConverter.makeHtml(md));
    }

  };
};