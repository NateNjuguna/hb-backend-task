function HTTPError(code) {
  this.status = code;
}

HTTPError.prototype = Object.create(Error.prototype);
HTTPError.prototype.constructor = HTTPError;

module.exports = HTTPError;
