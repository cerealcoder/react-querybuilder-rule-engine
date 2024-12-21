//***********
//* Modules *
//***********

const log = require('./log');


//*********************
//* Private Variables *
//*********************

/**
 * In order to associate the correct operators with a particular business object property, we must know the type of
 * the business object property. Each key in this object is the name of a business object property, and the value is
 * a String from property propertyTypes that identifies the business object property type. This object is defined by
 * the constructor method exported by this module.
 */
let businessObjectPropertyTypes;

/**
 * Each operator accepts two arguments: lho (left-hand operand) and rho (right-hand operand). The lho is the value
 * provided by the business object, and the rho is the value provided by the rule (which will always be a string).
 */

/**
 * The operators for integer data types.
 */
const intOperators = {
  '=':  (lho, rho) => {return lho === parseInt(rho);},
  '!=': (lho, rho) => {return lho !== parseInt(rho);},
  '<=': (lho, rho) => {return lho <= parseInt(rho);},
  '>=': (lho, rho) => {return lho >= parseInt(rho);},
  'between': (lho, rho) => {
      const limits = rho.split(',', 2).map(item => {return parseInt(item);});
      return (lho >= limits[0]) && (lho <= limits[1]);
    },
  'in': (lho, rho) => {
      const limits = rho.split(',').map(item => {return parseInt(item);});
      return limits.includes(lho);
    },
  'notIn': (lho, rho) => {
      const limits = rho.split(',').map(item => {return parseInt(item);});
      return !limits.includes(lho);
    },
};

/**
 * The operators for floating-point data types.
 */
const floatOperators = {
  '=':  (lho, rho) => {return lho === parseFloat(rho);},
  '!=': (lho, rho) => {return lho !== parseFloat(rho);},
  '<=': (lho, rho) => {return lho <= parseFloat(rho);},
  '>=': (lho, rho) => {return lho >= parseFloat(rho);},
  'between': (lho, rho) => {
    const limits = rho.split(',', 2).map(item => {return parseFloat(item);});
    return (lho >= limits[0]) && (lho <= limits[1]);
  },
  'in': (lho, rho) => {
    const values = rho.split(',').map(item => {return parseFloat(item);});
    return values.includes(lho);
  },
  'notIn': (lho, rho) => {
    const values = rho.split(',').map(item => {return parseFloat(item);});
    return !values.includes(lho);
  },
};

/**
 * The operators for select data types.
 */
const selectOperators = {
  '=':  (lho, rho) => {return lho.toLowerCase() === rho.toLowerCase();},
  '!=': (lho, rho) => {return lho.toLowerCase() !== rho.toLowerCase();},
  'in': (lho, rho) => {
    const values = rho.toLowerCase().split(',');
    return values.includes(lho.toLowerCase());
  },
  'notIn': (lho, rho) => {
    const values = rho.toLowerCase().split(',');
    return !values.includes(lho.toLowerCase());
  },
};

/**
 * The operators for string data types.
 */
const stringOperators = {
  '=': (lho, rho) => {return lho.toLowerCase() === rho.toLowerCase();},
  '!=': (lho, rho) => {return lho.toLowerCase() !== rho.toLowerCase();},
  'contains': (lho, rho) => {
    const regex = new RegExp(rho, 'i');
    return regex.test(lho);
  },
  'doesNotContain': (lho, rho) => {
    const regex = new RegExp(rho, 'i');
    return !regex.test(lho);
  },
  'beginsWith': (lho, rho) => {
    const regex = new RegExp(`^${rho}`, 'i');
    return regex.test(lho);
  },
  'doesNotBeginWith': (lho, rho) => {
    const regex = new RegExp(`^${rho}`, 'i');
    return !regex.test(lho);
  },
  'endsWith': (lho, rho) => {
    const regex = new RegExp(`${rho}$`, 'i');
    return regex.test(lho);
  },
  'doesNotEndWith': (lho, rho) => {
    const regex = new RegExp(`${rho}$`, 'i');
    return !regex.test(lho);
  },
  'in': (lho, rho) => {
    const values = rho.toLowerCase().split(',');
    return values.includes(lho.toLowerCase());
  },
  'notIn': (lho, rho) => {
    const values = rho.toLowerCase().split(',');
    return values.includes(lho.toLowerCase());
  },
  'isNull': (lho, rho) => {
    return !!!lho;
  },
  'isNotNull': (lho, rho) => {
    return !!lho;
  },
};


//******************
//* Public Objects *
//******************

const propertyTypes = {
  INT:    'int',
  FLOAT:  'float',
  SELECT: 'select',
  STRING: 'string',
};


//********************
//* Public Functions *
//********************

/**
 * Constructs the rule engine.
 *
 * @param propertyTypes
 * An object that describes the data type for each property of the business object for which this rule engine will
 * operate. Each key represents the property name, and each value is one of the following strings: "int", "float",
 * "select", or "string". Note that these string values are contained within exported symbol propertyTypes.
 */
function constructor(propertyTypes) {
  log.log.info({propertyTypes: propertyTypes});
  businessObjectPropertyTypes = propertyTypes;
}

/**
 * Uses a query object to execute one or more rules and rule groups.
 *
 * @param businessObject
 * The business object that contains properties that are evaluated by the query rules.
 *
 * @param query
 * The business object that contains 0 or more query rules.
 *
 * @returns A Boolean value that indicates the evaluation of the rules against the properties of the business object.
 *
 * @throws an Error if the input arguments are malformed in some manner.
 */
function execute(businessObject, query) {
  log.log.info({businessObject: businessObject, query: query});

  // Basic input argument sanity checking.
  if (!businessObjectPropertyTypes) {
    throw new Error('The business object field types are null or undefined.');
  }
  if (!businessObject) {
    throw new Error('Argument businessObject is null or undefined.');
  }
  if (!query) {
    throw new Error('Argument query is null or undefined.');
  }

  return evaluateRules(businessObject, query.rules, query.combinator, 0);
}


//*********************
//* Private Functions *
//*********************

function evaluateRule(businessObject, rule) {
  log.log.info({businessObject: businessObject, rule: rule});
  const lho = businessObject[rule.field];
  const rho = rule[rule.valueSource];
  const propertyType = businessObjectPropertyTypes[rule.field];
  let comparisonOperator;
  switch(propertyType) {
    case propertyTypes.INT: {
      comparisonOperator = intOperators[rule.operator];
      break;
    }
    case propertyTypes.FLOAT: {
      comparisonOperator = floatOperators[rule.operator];
      break;
    }
    case propertyTypes.SELECT: {
      comparisonOperator = selectOperators[rule.operator];
      break;
    }
    case propertyTypes.STRING: {
      comparisonOperator = stringOperators[rule.operator];
      break;
    }
  }
  if (comparisonOperator) {
    return comparisonOperator(lho, rho);
  } else {
    throw new Error(`Rule could not be evaluated because no comparison operator for field ${rule.field} is defined.`);
  }
}

function evaluateRules(businessObject, rules, combinator, recursionLevel) {
  log.log.info({businessObject: businessObject, rules: rules, recursionLevel: recursionLevel});

  const simpleRules = rules.filter(item => {return item.hasOwnProperty('field')});
  const ruleGroups  = rules.filter(item => {return item.hasOwnProperty('rules')});
  const simpleRuleEvaluations = simpleRules.map(rule => {return evaluateRule(businessObject, rule);});
  const ruleGroupEvaluations  = ruleGroups.map(ruleGroup => {return evaluateRules(businessObject, ruleGroup.rules, ruleGroup.combinator, recursionLevel + 1)});
  const allEvaluations = simpleRuleEvaluations.concat(ruleGroupEvaluations);

  if (combinator === 'and') {
    let returnValue = true;
    allEvaluations.forEach(evaluation => {returnValue &&= evaluation;});
    return returnValue;
  } else if (combinator === 'or') {
    let returnValue = false;
    allEvaluations.forEach(evaluation => {returnValue ||= evaluation;});
    return returnValue;
  } else {
    throw new Error(`Invalid combinator: ${combinator}`);
  }
}


//*********************
//* Module Public API *
//*********************

module.exports = {propertyTypes, constructor, execute};
