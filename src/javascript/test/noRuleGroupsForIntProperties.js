/**
 * Verifies that "simple" rule sets can be evaluated for business object properties of type "int".
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
          field:       'year',
          operator:    '=',
          valueSource: 'value',
          value:       '1969',
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
          field:       'year',
          operator:    '=',
          valueSource: 'value',
          value:       '1973',
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
          field:       'year',
          operator:    '!=',
          valueSource: 'value',
          value:       '1965',
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
          field:       'year',
          operator:    '!=',
          valueSource: 'value',
          value:       '1969',
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
          field:       'year',
          operator:    '<=',
          valueSource: 'value',
          value:       '1970',
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
          field:       'year',
          operator:    '<=',
          valueSource: 'value',
          value:       '1965',
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
          field:       'year',
          operator:    '>=',
          valueSource: 'value',
          value:       '1965',
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
          field:       'year',
          operator:    '>=',
          valueSource: 'value',
          value:       '1980',
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
          field:       'year',
          operator:    'between',
          valueSource: 'value',
          value:       '1965, 1969',
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
          field:       'year',
          operator:    'between',
          valueSource: 'value',
          value:       '1970, 1980',
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
          field:       'year',
          operator:    'in',
          valueSource: 'value',
          value:       '1965, 1969',
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
          field:       'year',
          operator:    'in',
          valueSource: 'value',
          value:       '1973, 1980',
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
          field:       'year',
          operator:    'notIn',
          valueSource: 'value',
          value:       '2000, 2001, 2002',
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
          field:       'year',
          operator:    'notIn',
          valueSource: 'value',
          value:       '1969',
        },
      ]
    };

    ruleEngine.constructor(businessObjectPropertyTypes);
    const evaluation = ruleEngine.execute(businessObject, query);
    t.ok(evaluation === false);
    t.end();
  }
);
