
const isEmpty = require('lodash/isEmpty');
const get = require('lodash/get');
const set = require('lodash/set');
const toLower = require('lodash/toLower');
const toUpper = require('lodash/toUpper');
const replace = require('lodash/replace');
const trim = require('lodash/trim');
const util = require('util');

module.exports = function(Model) {
  if (Model && Model.sharedClass) {
    const properties = Model.definition.properties;
    Object.keys(properties).forEach(property => {
      const filterList = {
        lower: value => toLower(value),
        upper: value => toUpper(value),
        replace: (value, options) => {
          const type = get(options, 'pattern.type');
          if (!type) throw new Error(
            'The "pattern.type" option is required for "filters.replace"'
          );
          let pattern = get(options, 'pattern.exp');
          if (!pattern) throw new Error(
            'The "pattern.exp" option is required for "filters.replace"'
          );
          const flags = get(options, 'pattern.flags');
          if (type === 'regex') pattern = new RegExp(pattern, flags);
          const replacement = get(options, 'replacement', '');
          return replace(value, pattern, replacement);
        },
        trim: value => trim(value),
      };
      const filters = get(properties, `${property}.filters`, {});
      if (!isEmpty(filters)) {
        Model.observe('before save', async function(ctx) {
          const path = ctx.instance ? 'instance' : 'data';
          const value = get(ctx, `${path}.${property}`);
          Object.keys(filters).forEach(filter => {
            const fn = get(filterList, filter);
            if (!fn) throw new Error(util.format('Invalid filter %s', filter));
            if (value) {
              const options = get(filters, filter);
              set(ctx, `${path}.${property}`, fn(value, options));
            }
          });
        });
      }
    });
  }
};
