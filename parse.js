var _ = require('lodash');
var xlsx = require('node-xlsx');

function parseSpreadSheet (buffer) {
  var ret = {};
  var spreadsheet = xlsx.parse(buffer);

  if (!(spreadsheet instanceof Array) || spreadsheet.length < 1) {
    return ret;
  }

  _.each(spreadsheet, function (sheet) {
    var data = {};
    _.each(sheet.data, function (row, y) {
      _.each(row, function (seat, x) {
        if (seat && seat.indexOf(',') > -1) {
          var n = seat.split(',');
          if (n.length === 3) {
            data[+n[0]] = data[+n[0]] || [];
            data[+n[0]].push([x, y, +n[1], +n[2]]);
          }
        }
      });
    });
    if (Object.keys(data).length > 0) {
      ret[sheet.name] = data;
    }
  });

  return ret;
}

module.exports = parseSpreadSheet;
