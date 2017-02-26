const helpers = require('./helpers');

function run(height, width, response) {
  helpers.setupTerminal(response);
  matrix(height, width, response);
}

function matrix(height, width, response) {
  response.write('hello neo\n');
}

module.exports = run;
