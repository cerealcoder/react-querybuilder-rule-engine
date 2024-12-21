const bunyan = require('bunyan');
const log = bunyan.createLogger({
  name: "react-querybuilder-rule-engine",
  src: true
});

module.exports = {log};
