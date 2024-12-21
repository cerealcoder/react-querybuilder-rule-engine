/**
 * Verifies exceptions are invoked under various conditions.
 */

const test = require('tape');
const ruleEngine = require('../ruleEngine');

test(
  'Constructor not invoked',
  t => {
    const businessObject = {foo: 'bar'};
    const query = {combinator: 'and', rules: []};
    const expectedErrorMessage = 'The business object field types are null or undefined.';
    let errorMessage;

    try {
      const evaluation = ruleEngine.execute(businessObject, query);
    } catch (error) {
      errorMessage = error.message;
    }
    t.ok(errorMessage === expectedErrorMessage);
    t.end();
  }
);

test(
  'Business object is null',
  t => {
    const businessObjectPropertyTypes = {
      foo:   ruleEngine.propertyTypes.INT,
      bar:   ruleEngine.propertyTypes.STRING,
      snafu: ruleEngine.propertyTypes.FLOAT,
    };
    const businessObject = undefined;
    const query = {combinator: 'and', rules: []};
    const expectedErrorMessage = 'Argument businessObject is null or undefined.';
    let errorMessage;

    try {
      ruleEngine.constructor(businessObjectPropertyTypes);
      const evaluation = ruleEngine.execute(businessObject, query);
    } catch (error) {
      errorMessage = error.message;
    }
    t.ok(errorMessage === expectedErrorMessage);
    t.end();
  }
);

test(
  'Query object is null',
  t => {
    const businessObjectPropertyTypes = {
      foo:   ruleEngine.propertyTypes.INT,
      bar:   ruleEngine.propertyTypes.STRING,
      snafu: ruleEngine.propertyTypes.FLOAT,
    };
    const businessObject = {
      foo:   1,
      bar:   "ruh roh",
      snafu: 3.14,
    };
    const query = undefined;
    const expectedErrorMessage = 'Argument query is null or undefined.';
    let errorMessage;

    try {
      ruleEngine.constructor(businessObjectPropertyTypes);
      const evaluation = ruleEngine.execute(businessObject, query);
    } catch (error) {
      errorMessage = error.message;
    }
    t.ok(errorMessage === expectedErrorMessage);
    t.end();
  }
);
