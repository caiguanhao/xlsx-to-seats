var fs = require('fs');
var parse = require('../parse');
var expect = require('chai').expect;
var rewire = require('rewire');
var number2letter = rewire('../parse').__get__('number2letter');

describe('Parse XLSX', function () {
  it('should work as expected', function () {
    var xlsx = fs.readFileSync(__dirname + '/fixtures/test.xlsx');
    var data = parse(xlsx);
    expect(data).to.deep.equal({
      warnings: [],
      parsed: {
        "一层": {
          "8250": [
            [2,8,12,45], [3,8,12,39], [1,9,13,47], [2,9,13,45],
            [3,9,13,39], [0,10,17,49], [1,10,17,47], [2,10,17,45],
            [3,10,17,39], [3,11,18,35], [4,11,18,33], [5,11,18,15],
            [3,12,19,35], [4,12,19,33], [5,12,19,15], [3,13,20,35],
            [4,13,20,33], [5,13,20,15], [3,14,21,35], [4,14,21,33],
            [5,14,21,15]
          ],
          "8251": [
            [3,1,2,35], [2,2,3,43], [3,2,3,37], [2,3,4,43],
            [3,3,4,37], [0,4,9,49], [1,4,9,47], [2,4,9,45],
            [3,4,9,39], [0,5,10,49], [1,5,10,47], [2,5,10,45],
            [3,5,10,39], [0,6,11,49], [1,6,11,47], [2,6,11,45],
            [3,6,11,39], [4,8,12,37], [5,8,12,19], [4,9,13,37],
            [5,9,13,19], [4,10,17,37], [5,10,17,19]
          ],
          "8252": [
            [4,0,1,33], [4,1,2,33], [4,2,3,35], [4,3,4,35],
            [4,4,9,37], [5,4,9,19], [4,5,10,37], [5,5,10,19],
            [4,6,11,37], [5,6,11,19]
          ],
          "8253": [
            [5,0,1,15], [5,1,2,15], [5,2,3,17], [5,3,4,17]
          ]
        },
        "二层": {
          "8254": [
            [0,8,12,53], [1,8,12,51], [2,8,12,49], [3,8,12,47],
            [4,8,12,45], [5,8,12,43], [6,8,12,41], [0,9,13,53],
            [1,9,13,51], [2,9,13,49], [3,9,13,47], [4,9,13,45],
            [5,9,13,43], [6,9,13,41]
          ],
          "8255": [
            [3,6,10,41], [4,6,10,39], [5,6,10,37], [6,6,10,35],
            [2,7,11,45], [3,7,11,43], [4,7,11,41], [5,7,11,39],
            [6,7,11,37]
          ],
          "8256": [
            [3,3,4,41], [4,3,4,39], [5,3,4,37], [6,3,4,35],
            [3,4,5,41], [4,4,5,39], [5,4,5,37], [6,4,5,35],
            [3,5,6,41], [4,5,6,39], [5,5,6,37], [6,5,6,35]
          ],
          "8257": [
            [5,0,1,43], [6,0,1,41], [5,1,2,43], [6,1,2,41]
          ]
        }
      }
    });
  });
});

describe('Column number to letter', function () {
  it('should work as expected', function () {
    var map = {
      0: 'A', 1: 'B', 2: 'C', 25: 'Z',
      26: 'AA', 27: 'AB', 28: 'AC', 51: 'AZ',
      52: 'BA', 53: 'BB', 54: 'BC', 77: 'BZ',
      701: 'ZZ',
      730: 'ABC'
    };
    for (var n in map) {
      expect(number2letter(n)).to.equal(map[n]);
    }
  });
});
