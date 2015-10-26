var _ = require('lodash');
var xlsx = require('node-xlsx');

function number2letter (n) {
  var A = 65;
  var Z = 90;
  var ret = '';
  while(n >= 0) {
    ret = String.fromCharCode(n % 26 + A) + ret;
    n = Math.floor(n / 26) - 1;
  }
  return ret;
}

function parseSpreadSheet (buffer) {
  var spreadsheets = xlsx.parse(buffer);
  if (!(spreadsheets instanceof Array)) {
    throw '不是有效的 XSLX SpreadSheet 文件。';
  }
  if (spreadsheets.length < 1) {
    throw '至少要有一个工作表。';
  }
  var ret = {
    warnings: [],
    parsed: {}
  };
  _.each(spreadsheets, function (sheet) {
    var data = {};
    if (/^sheet/i.test(sheet.name)) {
      ret.warnings.push('是不是还没有为工作表「' + sheet.name +
        '」更改名称？');
    }
    _.each(sheet.data, function (row, y) {
      _.each(row, function (seat, x) {
        if (typeof seat !== 'string' ||
          (seat.length > 0 && seat.indexOf(',') === -1)) {
          if (seat !== undefined && seat !== null) {
            ret.warnings.push('已忽略工作表「' + sheet.name + '」第' +
              (y + 1) + '行第' + (x + 1) + '列（' + number2letter(x) +
              '）格式错误的内容:「' + seat + '」');
          }
        } else if (seat.length > 0) {
          var n = seat.split(',');
          if (n.length >= 3) {
            data[n[0]] = data[n[0]] || [];
            var item = [x, y, +n[1], +n[2]];
            if (n.length > 3) {
              item.push(n[3]);
            }
            data[n[0]].push(item);
          }
        }
      });
    });
    if (Object.keys(data).length > 0) {
      ret.parsed[sheet.name] = data;
    }
  });

  return ret;
}

module.exports = parseSpreadSheet;
