/**
 * Verifies that queries with rule groups produce expected values.
 */

const test = require('tape');
const ruleEngine = require('../ruleEngine');
const businessObject = require('./businessObject').businessObject;
const businessObjectPropertyTypes = require('./businessObject').businessObjectPropertyTypes;

test(
  'One field, one rule group, one recursion level, evaluates as true',
  t => {
    const query = {
      combinator: "and",
      rules: [
        {
          field:       "model",
          operator:    "=",
          valueSource: "value",
          value:       "mustang",
        },
        {
          rules: [
            {
              field:       "bodyStyle",
              operator:    "=",
              valueSource: "value",
              value:       "convertible",
            },
            {
              field:       "engineDisplacement",
              operator:    "=",
              valueSource: "value",
              value:       "351",
            }
          ],
          combinator: "or",
          not: false,
        }
      ]
    }

    ruleEngine.constructor(businessObjectPropertyTypes);
    const evaluation = ruleEngine.execute(businessObject, query);
    t.ok(evaluation === true);
    t.end();
  }
);

test(
  'One field, two rule groups, one recursion level, evaluates as true',
  t => {
    const query = {
      combinator: "and",
      rules: [
        {
          field:       "model",
          operator:    "=",
          valueSource: "value",
          value:       "mustang",
        },
        {
          rules: [
            {
              field:       "bodyStyle",
              operator:    "=",
              valueSource: "value",
              value:       "convertible",
            },
            {
              field:       "engineDisplacement",
              operator:    "=",
              valueSource: "value",
              value:       "351",
            }
          ],
          combinator: "or",
          not: false,
        },
        {
          rules: [
            {
              field:       "transmission",
              operator:    "=",
              valueSource: "value",
              value:       "manual",
            },
            {
              field:       "curbWeight",
              operator:    "=",
              valueSource: "value",
              value:       "2835",
            }
          ],
          combinator: "and",
          not: false,
        }
      ]
    }

    ruleEngine.constructor(businessObjectPropertyTypes);
    const evaluation = ruleEngine.execute(businessObject, query);
    t.ok(evaluation === true);
    t.end();
  }
);

test(
  'One field, two rule groups, two recursion levels, evaluates as true',
  t => {
    const query = {
      combinator: "and",
      rules: [
        {
          field:       "model",
          operator:    "=",
          valueSource: "value",
          value:       "mustang",
        },
        {
          rules: [
            {
              field:       "bodyStyle",
              operator:    "=",
              valueSource: "value",
              value:       "convertible",
            },
            {
              field:       "engineDisplacement",
              operator:    "=",
              valueSource: "value",
              value:       "351",
            },
            {
              rules: [
                {
                  field:       "year",
                  operator:    "=",
                  valueSource: "value",
                  value:       "1969",
                },
                {
                  field:       "turningDiameter",
                  operator:    ">=",
                  valueSource: "value",
                  value:       "37",
                }
              ],
              combinator: "or",
              not: false,
            }
          ],
          combinator: "or",
          not: false,
        }
      ]
    }

    ruleEngine.constructor(businessObjectPropertyTypes);
    const evaluation = ruleEngine.execute(businessObject, query);
    t.ok(evaluation === true);
    t.end();
  }
);
