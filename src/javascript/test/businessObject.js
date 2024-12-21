const ruleEngine = require('../ruleEngine');

const businessObject = {
  make:               'Ford Motor Company',
  model:              'Mustang',
  bodyStyle:          'Coup',
  year:               1969,
  engineDisplacement: 351,
  transmission:       'Manual',
  turningDiameter:    37.6,
  curbWeight:         2835,
  vin:                null,
  colorCode:          undefined,
};

const businessObjectPropertyTypes = {
  make:               ruleEngine.propertyTypes.STRING,
  model:              ruleEngine.propertyTypes.STRING,
  bodyStyle:          ruleEngine.propertyTypes.SELECT,
  year:               ruleEngine.propertyTypes.INT,
  engineDisplacement: ruleEngine.propertyTypes.INT,
  transmission:       ruleEngine.propertyTypes.SELECT,
  turningDiameter:    ruleEngine.propertyTypes.FLOAT,
  curbWeight:         ruleEngine.propertyTypes.INT,
  vin:                ruleEngine.propertyTypes.STRING,
  colorCode:          ruleEngine.propertyTypes.STRING,
};

module.exports = {businessObject, businessObjectPropertyTypes};
