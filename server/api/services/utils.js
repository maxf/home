module.exports.Utils = {
  pad: function(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  },

  formatTime: function(h, m) {
    return pad(h, 2) + ':' + pad(m, 2);
  }

};
