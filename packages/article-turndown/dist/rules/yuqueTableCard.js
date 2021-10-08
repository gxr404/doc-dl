"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../utils/index");
function default_1(turndownService) {
    turndownService.addRule('yuqueTableCard', {
        filter: function (node) {
            if (!(node instanceof Object)) {
                return false;
            }
            if (node.tagName !== 'TABLE') {
                return false;
            }
            if (node.getAttribute('class') !== 'lake-table') {
                return false;
            }
            return true;
        },
        replacement: function (content, node) {
            if (!(node instanceof Object)) {
                return content;
            }
            var lines = node.querySelectorAll('tr');
            var jsonNodes = [];
            for (var _i = 0, _a = Array.from(lines); _i < _a.length; _i++) {
                var line = _a[_i];
                var nodes = line.querySelectorAll('td');
                var nodesValue = Array.from(nodes).map(function (node) { return ({
                    colSpan: Number(node.getAttribute('colspan')) || 1,
                    rowSpan: Number(node.getAttribute('rowspan')) || 1,
                    content: Array.from(node.querySelectorAll('p'))
                        .map(function (o) { return o.textContent; })
                        .join('<br />'),
                }); });
                jsonNodes.push(nodesValue);
            }
            var result = jsonNodes.map(function () { return []; });
            jsonNodes.forEach(function (row, rowIndex) {
                var foo = [];
                row.forEach(function (o) {
                    var expectIndex = index_1.default.notEmptyIndex(result[rowIndex], 0);
                    for (var i = 0; i < o.colSpan; i++) {
                        for (var j = 0; j < o.rowSpan; j++) {
                            var first = i === 0 && j === 0;
                            result[rowIndex + j][expectIndex + i] = first ? o.content : '';
                        }
                    }
                });
                return foo;
            });
            var divider = result[0].map(function () { return '-'; });
            result.splice(1, 0, divider);
            return result.map(function (row) { return "|" + row.join('|') + "|"; }).join('\n') + "\n\n";
        },
    });
}
exports.default = default_1;
