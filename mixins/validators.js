
const isEmpty = require('lodash/isEmpty');
const has = require('lodash/has');
const get = require('lodash/get');
const set = require('lodash/set');
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
          isInvalid: value => value && !cpf.isValid(cpf.strip(value)),
          message: () => 'Invalid CPF',
        },
        cnpj: {
          isInvalid: value => value && !cnpj.isValid(cnpj.strip(value)),
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
          } else if (['length', 'is', 'min', 'max'].includes(validator)) {
            const options = get(validators, validator);
            const opt = {allowBlank: true, allowNull: true};
            switch(validator) {
              case 'length':
              case 'is':
                set(opt, 'is', options);
                break;
              case 'min':
                set(opt, 'min', options);
                break;
              case 'max':
                set(opt, 'max', options);
                break;
            }
            Model.validatesLengthOf(property, opt);
          } else if (validator === 'pattern') {
            const options = get(validators, validator);
            let pattern = get(options, 'exp');
            if (!pattern) throw new Error(
              'The "exp" option is required for "filters.pattern"'
            );
            const flags = get(options, 'flags');
            pattern = new RegExp(pattern, flags);
            Model.validatesFormatOf(property, {
              with: pattern, allowBlank: true, allowNull: true
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
