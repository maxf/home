module.exports = {
  pad: function(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  },

  formatTime: function(h, m) {
    return this.pad(h, 2) + ':' + this.pad(m, 2);
  }

};
