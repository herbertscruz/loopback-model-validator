const assert = require('chai').assert;
const server = require('./loopback/server/server');
const request = require('supertest')(server);
const omit = require('lodash/omit');

describe('mixins/validators.js', () => {
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
    const input = this.input();
    return request
      .post('/api/TestLabs')
      .send(input)
      .then(response => {
        assert.isOk(response);
        assert.property(response.body, 'id');
        assert.property(response.body, 'length');
        assert.property(response.body, 'is');
        assert.property(response.body, 'min');
        assert.property(response.body, 'max');
        assert.property(response.body, 'pattern');
        assert.property(response.body, 'email');
        assert.property(response.body, 'urlIp');
        assert.property(response.body, 'cpf');
        assert.property(response.body, 'cnpj');
        assert.property(response.body, 'unique');
        assert.property(response.body, 'inclusionOf');
      });
  });

  it('should return with applied validators', async () => {
    const data = this.input();
    data.length = 'AB';
    data.is = 'AB';
    data.min = 'gh';
    data.max = 'jklmnopqrst';
    data.pattern = 'tuv';
    data.email = 'w@x';
    data.urlIp = 'http://www.y';
    data.cpf = '95466673070';
    data.cnpj = '60525221000100';
    data.unique = data.unique - 1;
    data.inclusionOf = 'C';
    return request
      .post('/api/TestLabs')
      .send(data)
      .then(response => {
        assert.property(response.body.error.details.messages, 'length');
        assert.property(response.body.error.details.messages, 'is');
        assert.property(response.body.error.details.messages, 'min');
        assert.property(response.body.error.details.messages, 'max');
        assert.property(response.body.error.details.messages, 'pattern');
        assert.property(response.body.error.details.messages, 'email');
        assert.property(response.body.error.details.messages, 'urlIp');
        assert.property(response.body.error.details.messages, 'cpf');
        assert.property(response.body.error.details.messages, 'cnpj');
        assert.property(response.body.error.details.messages, 'unique');
        assert.property(response.body.error.details.messages, 'inclusionOf');
      });
  });

  it('should return with applied validators', async () => {
    let data = this.input();
    data = omit(data, [
      'length', 'is', 'min', 'max', 'pattern', 'email',
      'urlIp', 'cpf', 'cnpj', 'unique', 'inclusionOf'
    ]);
    return request
      .post('/api/TestLabs')
      .send(data)
      .then(response => {
        assert.isOk(response);
        assert.property(response.body, 'id');
      });
  });
});
