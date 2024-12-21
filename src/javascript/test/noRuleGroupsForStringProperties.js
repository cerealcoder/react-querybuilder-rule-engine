/**
 * Verifies that "simple" rule sets can be evaluated for business object properties of type "string".
 * A simple rule set has no rule groups.
 */

const test = require('tape');
const ruleEngine = require('../ruleEngine');
const businessObject = require('./businessObject').businessObject;
const businessObjectPropertyTypes = require('./businessObject').businessObjectPropertyTypes;

test(
  'One rule, "=" operator evaluates as false',
  t => {
    const query = {
      combinator: 'and',
      rules: [
        {
          field:       'make',
          operator:    '=',
          valueSource: 'value',
          value:       'Chevrolet'
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
  'One rule, "=" operator evaluates as true',
  t => {
    const query = {
      combinator: 'and',
      rules: [
        {
          field:       'make',
          operator:    '=',
          valueSource: 'value',
          value:       'Ford Motor Company'
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
  'One rule, "contains" operator evaluates as true',
  t => {
    const query = {
      combinator: 'and',
      rules: [
        {
          field:       'make',
          operator:    'contains',
          valueSource: 'value',
          value:       'motor'
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
  'One rule, "beginsWith" operator evaluates as true',
  t => {
    const query = {
      combinator: 'and',
      rules: [
        {
          field:       'make',
          operator:    'beginsWith',
          valueSource: 'value',
          value:       'Ford '
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
  'One rule, "beginsWith" operator evaluates as false',
  t => {
    const query = {
      combinator: 'and',
      rules: [
        {
          field:       'make',
          operator:    'beginsWith',
          valueSource: 'value',
          value:       'Dodge'
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
  'One rule, "doesNotContain" operator evaluates as true',
  t => {
    const query = {
      combinator: 'or',
      rules: [
        {
          field:       'make',
          operator:    'doesNotContain',
          valueSource: 'value',
          value:       'brothers'
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
  'One rule, "doesNotContain" operator evaluates as false',
  t => {
    const query = {
      combinator: 'or',
      rules: [
        {
          field:       'make',
          operator:    'doesNotContain',
          valueSource: 'value',
          value:       'company'
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
  'One rule, "doesNotBeginWith" operator evaluates as true',
  t => {
    const query = {
      combinator: 'or',
      rules: [
        {
          field:       'make',
          operator:    'doesNotBeginWith',
          valueSource: 'value',
          value:       'Dodge'
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
  'One rule, "doesNotBeginWith" operator evaluates as false',
  t => {
    const query = {
      combinator: 'or',
      rules: [
        {
          field:       'make',
          operator:    'doesNotBeginWith',
          valueSource: 'value',
          value:       'Ford'
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
  'One rule, "endsWith" operator evaluates as true',
  t => {
    const query = {
      combinator: 'and',
      rules: [
        {
          field:       'make',
          operator:    'endsWith',
          valueSource: 'value',
          value:       'company'
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
  'One rule, "endsWith" operator evaluates as false',
  t => {
    const query = {
      combinator: 'and',
      rules: [
        {
          field:       'make',
          operator:    'endsWith',
          valueSource: 'value',
          value:       'brothers'
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
  'One rule, "doesNotEndWith" operator evaluates as true',
  t => {
    const query = {
      combinator: 'and',
      rules: [
        {
          field:       'make',
          operator:    'doesNotEndWith',
          valueSource: 'value',
          value:       'brothers'
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
  'One rule, "isNull" operator evaluates as true',
  t => {
    const query = {
      combinator: 'and',
      rules: [
        {
          field:       'vin',
          operator:    'isNull',
          valueSource: 'value',
          value:       undefined, // The isNull operator is a unary operator, hence the rho is of no relevance.
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
  'One rule, "isNull" operator evaluates as false',
  t => {
    const query = {
      combinator: 'and',
      rules: [
        {
          field:       'make',
          operator:    'isNull',
          valueSource: 'value',
          value:       undefined, // The isNull operator is a unary operator, hence the rho is of no relevance.
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
  'One rule, "isNotNull" operator evaluates as true',
  t => {
    const query = {
      combinator: 'and',
      rules: [
        {
          field:       'model',
          operator:    'isNotNull',
          valueSource: 'value',
          value:       undefined, // The isNotNull operator is a unary operator, hence the rho is of no relevance.
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
  'One rule, "isNotNull" operator evaluates as false',
  t => {
    const query = {
      combinator: 'and',
      rules: [
        {
          field:       'colorCode',
          operator:    'isNotNull',
          valueSource: 'value',
          value:       undefined, // The isNotNull operator is a unary operator, hence the rho is of no relevance.
        },
      ]
    };

    ruleEngine.constructor(businessObjectPropertyTypes);
    const evaluation = ruleEngine.execute(businessObject, query);
    t.ok(evaluation === false);
    t.end();
  }
);
