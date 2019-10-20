const assert = require('chai').assert;
const server = require('./loopback/server/server');
const request = require('supertest')(server);

describe('mixins/validators.js', () => {
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
      "unique": "zv",
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
      });
  });
});
