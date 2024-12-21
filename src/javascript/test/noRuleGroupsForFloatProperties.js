/**
 * Verifies that "simple" rule sets can be evaluated for business object properties of type "float".
 * A simple rule set has no rule groups.
 */

const test = require('tape');
const ruleEngine = require('../ruleEngine');
const businessObject = require('./businessObject').businessObject;
const businessObjectPropertyTypes = require('./businessObject').businessObjectPropertyTypes;

test(
  'One rule, "=" operator evaluates as true',
  t => {
    const query = {
      combinator: 'and',
      rules: [
        {
          field:       'turningDiameter',
          operator:    '=',
          valueSource: 'value',
          value:       '37.6',
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
  'One rule, "=" operator evaluates as false',
  t => {
    const query = {
      combinator: 'and',
      rules: [
        {
          field:       'turningDiameter',
          operator:    '=',
          valueSource: 'value',
          value:       '37.7',
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
  'One rule, "!=" operator evaluates as true',
  t => {
    const query = {
      combinator: 'and',
      rules: [
        {
          field:       'turningDiameter',
          operator:    '!=',
          valueSource: 'value',
          value:       '37.7',
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
  'One rule, "!=" operator evaluates as false',
  t => {
    const query = {
      combinator: 'and',
      rules: [
        {
          field:       'turningDiameter',
          operator:    '!=',
          valueSource: 'value',
          value:       '37.6',
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
  'One rule, "<=" operator evaluates as true',
  t => {
    const query = {
      combinator: 'and',
      rules: [
        {
          field:       'turningDiameter',
          operator:    '<=',
          valueSource: 'value',
          value:       '40',
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
  'One rule, "<=" operator evaluates as false',
  t => {
    const query = {
      combinator: 'and',
      rules: [
        {
          field:       'turningDiameter',
          operator:    '<=',
          valueSource: 'value',
          value:       '37',
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
  'One rule, ">=" operator evaluates as true',
  t => {
    const query = {
      combinator: 'and',
      rules: [
        {
          field:       'turningDiameter',
          operator:    '>=',
          valueSource: 'value',
          value:       '3.14',
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
  'One rule, ">=" operator evaluates as false',
  t => {
    const query = {
      combinator: 'and',
      rules: [
        {
          field:       'turningDiameter',
          operator:    '>=',
          valueSource: 'value',
          value:       '38.17',
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
  'One rule, "between" operator evaluates as true',
  t => {
    const query = {
      combinator: 'and',
      rules: [
        {
          field:       'turningDiameter',
          operator:    'between',
          valueSource: 'value',
          value:       '37, 38',
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
  'One rule, "between" operator evaluates as false',
  t => {
    const query = {
      combinator: 'and',
      rules: [
        {
          field:       'turningDiameter',
          operator:    'between',
          valueSource: 'value',
          value:       '37.0, 37.5',
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
  'One rule, "in" operator evaluates as true',
  t => {
    const query = {
      combinator: 'and',
      rules: [
        {
          field:       'turningDiameter',
          operator:    'in',
          valueSource: 'value',
          value:       '37.6, 43.2, 3.14',
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
          field:       'turningDiameter',
          operator:    'in',
          valueSource: 'value',
          value:       '1, 2.3, 3.4',
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
          field:       'turningDiameter',
          operator:    'notIn',
          valueSource: 'value',
          value:       '33.1, 34.1, 35.4328',
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
  'One rule, "notIn" operator evaluates as false',
  t => {
    const query = {
      combinator: 'and',
      rules: [
        {
          field:       'turningDiameter',
          operator:    'notIn',
          valueSource: 'value',
          value:       '37.1, 37.6, 37.8',
        },
      ]
    };

    ruleEngine.constructor(businessObjectPropertyTypes);
    const evaluation = ruleEngine.execute(businessObject, query);
    t.ok(evaluation === false);
    t.end();
  }
);
