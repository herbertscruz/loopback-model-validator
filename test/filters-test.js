const assert = require('chai').assert;
const server = require('./loopback/server/server');
const request = require('supertest')(server);
const cpf = require('@fnando/cpf/dist/node');
const cnpj = require('@fnando/cnpj/dist/node');

describe('mixins/filters.js', () => {
  this.getUnique = () => {
    if (!this.unique) this.unique = 0;
    return ++this.unique;
  };
  this.input = () => {
    return JSON.parse(JSON.stringify({
      "length": "ABC",
      "is": "DEF",
      "min": "ghi",
      "max": "jklmnopqrs",
      "pattern": "Test - tuv",
      "email": "w@x.com",
      "urlIp": "http://www.y.com",
      "cpf": "95466673072",
      "cnpj": "60525221000105",
      "unique": this.getUnique(),
      "inclusionOf": "A"
    }));
  };

  it('should return success', async () => {
    const data = this.input();
    return request
      .post('/api/TestLabs')
      .send(data)
      .then(response => {
        assert.isOk(response);
      });
  });

  it('should return with applied filters', async () => {
    const data = this.input();
    data.length = data.length.toLowerCase();
    data.is = data.is.toLowerCase();
    data.min = ` ${data.min} `;
    data.max = ` ${data.max} `;
    data.email = data.email.toUpperCase();
    data.urlIp = data.urlIp.toUpperCase();
    data.cpf = cpf.format(data.cpf);
    data.cnpj = cnpj.format(data.cnpj);
    return request
      .post('/api/TestLabs')
      .send(data)
      .then(response => {
        const input = this.input();
        assert.isOk(response);
        assert.propertyVal(response.body, 'length', input.length);
        assert.propertyVal(response.body, 'is', input.is);
        assert.propertyVal(response.body, 'min', input.min);
        assert.propertyVal(response.body, 'max', input.max);
        assert.propertyVal(response.body, 'pattern', input.pattern);
        assert.propertyVal(response.body, 'email', input.email);
        assert.propertyVal(response.body, 'cpf', input.cpf);
        assert.propertyVal(response.body, 'cnpj', input.cnpj);
      });
  });
});
