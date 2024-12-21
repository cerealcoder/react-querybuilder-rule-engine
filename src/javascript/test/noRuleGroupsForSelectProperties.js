/**
 * Verifies that "simple" rule sets can be evaluated for business object properties of type "select".
 * A simple rule set has no rule groups.
 */

const test = require('tape');
const ruleEngine = require('../ruleEngine');
const businessObject = require('./businessObject').businessObject;
const businessObjectPropertyTypes = require('./businessObject').businessObjectPropertyTypes;

test(
  'One rule, "in" operator evaluates as true',
  t => {
    const query = {
      combinator: 'and',
      rules: [
        {
          field:       'bodyStyle',
          operator:    'in',
          valueSource: 'value',
          value:       'coup, fastback, convertible'
        },
      ]
    };

    ruleEngine.constructor(businessObjectPropertyTypes);
    const evaluation = ruleEngine.execute(businessObject, query);
    t.ok(evaluation === true);
    t.end();
  }
);

test(
  'One rule, "in" operator evaluates as false',
  t => {
    const query = {
      combinator: 'and',
      rules: [
        {
          field:       'bodyStyle',
          operator:    'in',
          valueSource: 'value',
          value:       'black, white, yellow'
        },
      ]
    };

    ruleEngine.constructor(businessObjectPropertyTypes);
    const evaluation = ruleEngine.execute(businessObject, query);
    t.ok(evaluation === false);
    t.end();
  }
);

test(
  'One rule, "notIn" operator evaluates as true',
  t => {
    const query = {
      combinator: 'and',
      rules: [
        {
          field:       'bodyStyle',
          operator:    'notIn',
          valueSource: 'value',
          value:       'a, b, c'
        },
      ]
    };

    ruleEngine.constructor(businessObjectPropertyTypes);
    const evaluation = ruleEngine.execute(businessObject, query);
    t.ok(evaluation === true);
    t.end();
  }
);
