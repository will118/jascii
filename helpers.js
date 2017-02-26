function setupTerminal(response) {
  response.write('\033[2J'); // clear screen but don't reset cursor to top
  response.write('\033[200B'); // move down 200 lines
  response.write('\033[2H'); // reset cursor to top
  response.write('\033[?25l'); // hide cursor (drawing perf)
}

module.exports = {
  setupTerminal: setupTerminal
}
