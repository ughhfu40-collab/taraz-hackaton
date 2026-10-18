const {test} = require('node:test');
const assert = require('node:assert/strict');
const {predict, evaluate, demo} = require('../dist/model.js');
const {parseCSV, validate} = require('../dist/data.js');
test('constant demand forecasts correctly without future observations', () => {
  const rows = demo().filter(r => r.product === 'Самса с говядиной').map(r => ({...r, sold: 40}));
  assert.equal(predict(rows, '2026-10-19'), 40);
  assert.equal(evaluate(rows).wape, 0);
  assert.equal(evaluate(rows).n, 28);
});
test('CSV round trip accepts complete history and rejects corrupt records', () => {
  const data = demo();
  const csv = 'date,product,sold,prepared,price,cost\n' + data.map(r => [r.date, '"'+r.product+'"',r.sold,r.prepared,r.price,r.cost].join(',')).join('\n');
  assert.equal(validate(parseCSV(csv)).length, 224);
  assert.throws(() => validate([...data, data[0]]), /Повтор/);
  assert.throws(() => validate([{...data[0],date:'2026-02-30'}]), /дата/);
});
