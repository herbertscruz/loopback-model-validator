
const isEmpty = require('lodash/isEmpty');
const has = require('lodash/has');
const get = require('lodash/get');
const first = require('lodash/first');
const upperFirst = require('lodash/upperFirst');
const {isEmail, isURL, isIP} = require('validator');
const cpf = require('@fnando/cpf/dist/node');
const cnpj = require('@fnando/cnpj/dist/node');
const util = require('util');

module.exports = function(Model) {
  if (Model && Model.sharedClass) {
    const properties = Model.definition.properties;
    Object.keys(properties).forEach(property => {
      const validatorList = {
        length: {
          isInvalid: (value, length) => value && value.length !== length,
          message: length => util.format('Must be %s characters', length),
        },
        is: {
          isInvalid: (value, is) => value && value.length !== is,
          message: is => util.format('Must be %s characters', is),
        },
        min: {
          isInvalid: (value, min) => value && value.length < min,
          message: min => util.format('Must be at least %s characters', min),
        },
        max: {
          isInvalid: (value, max) => value && value.length > max,
          message: max => util.format('Must be at most %s characters', max),
        },
        pattern: {
          isInvalid: (value, options) => {
            let pattern = get(options, 'exp');
            if (!pattern) throw new Error(
              'The "exp" option is required for "filters.pattern"'
            );
            const flags = get(options, 'flags');
            pattern = new RegExp(pattern, flags);
            return !pattern.test(value);
          },
          message: () => 'Invalid pattern',
        },
        email: {
          isInvalid: value => value && !isEmail(value),
          message: () => 'Invalid email',
        },
        urlIp: {
          isInvalid: value => value && !(isURL(value) || isIP(value)),
          message: () => 'Invalid URL or IP',
        },
        // Brazil validations
        cpf: {
          isInvalid: value => value && !cpf.isInvalid(cpf.strip(value)),
          message: () => 'Invalid CPF',
        },
        cnpj: {
          isInvalid: value => value && !cnpj.isInvalid(cnpj.strip(value)),
          message: () => 'Invalid CNPJ',
        },
      };
      const validators = get(properties, `${property}.validators`, {});
      if (!isEmpty(validators)) {
        Object.keys(validators).forEach(validator => {
          const obj = get(validatorList, validator);
          if (obj) {
            ((property, validator, obj) => {
              const options = get(validators, validator);
              Model.validate(property, function(err) {
                const value = get(this, property);
                if (obj.isInvalid(value, options)) err();
              }, {message: obj.message(options)});
            })(property, validator, obj);
          } else if (validator === 'unique') {
            Model.observe('before save', async function(ctx) {
              const path = ctx.instance ? 'instance' : 'data';
              if (ctx.isNewInstance) {
                Model.validatesUniquenessOf(property, {
                  message: util.format('%s must be unique', property),
                });
              } else {
                const value = get(ctx, `${path}.${property}`);
                const propertyId = first(Object.keys(properties).filter(
                  property => !!get(properties, `${property}.id`)
                ));
                const id = get(ctx, `${path}.${propertyId}`);
                const result = await Model.findById(id);
                if (get(result, property) !== value) {
                  Model.validatesUniquenessOf(property, {
                    message: util.format('%s must be unique', property),
                  });
                }
              }
            });
          } else {
            const method = `validates${upperFirst(validator)}`;
            if (has(Model, method)) {
              const options = get(validators, validator);
              Model[method](property, options);
            }
          }
        });
      }
    });
  }
};
