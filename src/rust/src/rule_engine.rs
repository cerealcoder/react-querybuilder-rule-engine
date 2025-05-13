#![allow(dead_code)]
use std::collections::HashMap;
use serde::Deserialize;
use serde_json::Value;

// Define property types
#[derive(Debug, PartialEq, Deserialize)]
pub enum PropertyType {
    Int,
    Float,
    Select,
    String,
}

// Define a rule
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Rule {
    pub field: String,
    pub operator: String,
    pub value_source: String,
    pub value: String,
}

// Define a rule group
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RuleGroup {
    pub rules: Vec<RuleOrGroup>,
    pub combinator: String,
    pub not: bool,
}

// Enum for Rule or RuleGroup
#[derive(Debug, Deserialize)]
#[serde(untagged)]
pub enum RuleOrGroup {
    pub Rule(Rule),
    pub Group(RuleGroup),
}

// Define the query
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Query {
    pub combinator: String,
    pub rules: Vec<RuleOrGroup>,
}

// Business object and property types
pub struct BusinessObject {
    pub properties: HashMap<String, String>,
}

pub struct BusinessObjectPropertyTypes {
    pub types: HashMap<String, PropertyType>,
}

// Evaluate a single rule
pub fn evaluate_rule(
    business_object: &BusinessObject,
    rule: &Rule,
    property_types: &BusinessObjectPropertyTypes,
) -> Result<bool, String> {
    let lho = business_object
        .properties
        .get(&rule.field)
        .ok_or_else(|| format!("Field {} not found in business object", rule.field))?;
    let property_type = property_types
        .types
        .get(&rule.field)
        .ok_or_else(|| format!("Property type for field {} not found", rule.field))?;

    match property_type {
        PropertyType::Int => {
            let lho: i32 = lho.parse().map_err(|_| "Invalid integer value".to_string())?;
            let rho: i32 = rule.value.parse().map_err(|_| "Invalid integer value".to_string())?;
            match rule.operator.as_str() {
                "=" => Ok(lho == rho),
                "!=" => Ok(lho != rho),
                "<=" => Ok(lho <= rho),
                ">=" => Ok(lho >= rho),
                _ => Err(format!("Unsupported operator: {}", rule.operator)),
            }
        }
        PropertyType::Float => {
            let lho: f64 = lho.parse().map_err(|_| "Invalid float value".to_string())?;
            let rho: f64 = rule.value.parse().map_err(|_| "Invalid float value".to_string())?;
            match rule.operator.as_str() {
                "=" => Ok(lho == rho),
                "!=" => Ok(lho != rho),
                "<=" => Ok(lho <= rho),
                ">=" => Ok(lho >= rho),
                _ => Err(format!("Unsupported operator: {}", rule.operator)),
            }
        }
        PropertyType::String => match rule.operator.as_str() {
            "=" => Ok(lho.eq_ignore_ascii_case(&rule.value)),
            "!=" => Ok(!lho.eq_ignore_ascii_case(&rule.value)),
            _ => Err(format!("Unsupported operator: {}", rule.operator)),
        },
        PropertyType::Select => match rule.operator.as_str() {
            "=" => Ok(lho.eq_ignore_ascii_case(&rule.value)),
            "!=" => Ok(!lho.eq_ignore_ascii_case(&rule.value)),
            _ => Err(format!("Unsupported operator: {}", rule.operator)),
        },
    }
}

// Evaluate a group of rules
pub fn evaluate_rules(
    business_object: &BusinessObject,
    rules: &[RuleOrGroup],
    combinator: &str,
    property_types: &BusinessObjectPropertyTypes,
) -> Result<bool, String> {
    let mut evaluations = Vec::new();

    for rule_or_group in rules {
        match rule_or_group {
            RuleOrGroup::Rule(rule) => {
                evaluations.push(evaluate_rule(business_object, rule, property_types)?);
            }
            RuleOrGroup::Group(group) => {
                evaluations.push(evaluate_rules(
                    business_object,
                    &group.rules,
                    &group.combinator,
                    property_types,
                )?);
            }
        }
    }

    match combinator {
        "and" => Ok(evaluations.iter().all(|&eval| eval)),
        "or" => Ok(evaluations.iter().any(|&eval| eval)),
        _ => Err(format!("Invalid combinator: {}", combinator)),
    }
}



// Deserialize Property Types
pub fn deserialize_property_types(
    property_types_json: Value,
) -> Result<BusinessObjectPropertyTypes, String> {
    let types = serde_json::from_value::<HashMap<String, String>>(property_types_json)
        .map_err(|e| format!("Failed to deserialize PropertyTypes: {}", e))?
        .into_iter()
        .map(|(k, v)| {
            let property_type = match v.as_str() {
                "Int" => PropertyType::Int,
                "Float" => PropertyType::Float,
                "Select" => PropertyType::Select,
                "String" => PropertyType::String,
                _ => return Err(format!("Unknown property type: {}", v)),
            };
            Ok((k, property_type))
        })
        .collect::<Result<HashMap<_, _>, _>>()?;
    Ok(BusinessObjectPropertyTypes { types })
}

// Deserialize Query
pub fn deserialize_query(query_json: Value) -> Result<Query, String> {
    serde_json::from_value(query_json).map_err(|e| format!("Failed to deserialize Query: {}", e))
}


#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn test_one_field_one_rule_group_one_recursion_level() {
        let business_object = BusinessObject {
            properties: HashMap::from([
                ("model".to_string(), "mustang".to_string()),
                ("bodyStyle".to_string(), "convertible".to_string()),
                ("engineDisplacement".to_string(), "351".to_string()),
            ]),
        };

        let property_types = BusinessObjectPropertyTypes {
            types: HashMap::from([
                ("model".to_string(), PropertyType::String),
                ("bodyStyle".to_string(), PropertyType::String),
                ("engineDisplacement".to_string(), PropertyType::Int),
            ]),
        };

        let query = Query {
            combinator: "and".to_string(),
            rules: vec![
                RuleOrGroup::Rule(Rule {
                    field: "model".to_string(),
                    operator: "=".to_string(),
                    value_source: "value".to_string(),
                    value: "mustang".to_string(),
                }),
                RuleOrGroup::Group(RuleGroup {
                    rules: vec![
                        RuleOrGroup::Rule(Rule {
                            field: "bodyStyle".to_string(),
                            operator: "=".to_string(),
                            value_source: "value".to_string(),
                            value: "convertible".to_string(),
                        }),
                        RuleOrGroup::Rule(Rule {
                            field: "engineDisplacement".to_string(),
                            operator: "=".to_string(),
                            value_source: "value".to_string(),
                            value: "351".to_string(),
                        }),
                    ],
                    combinator: "or".to_string(),
                    not: false,
                }),
            ],
        };

        let result = evaluate_rules(&business_object, &query.rules, &query.combinator, &property_types);
        assert_eq!(result, Ok(true));
    }

    #[test]
    fn test_one_field_two_rule_groups_one_recursion_level() {
        let business_object = BusinessObject {
            properties: HashMap::from([
                ("model".to_string(), "mustang".to_string()),
                ("bodyStyle".to_string(), "convertible".to_string()),
                ("engineDisplacement".to_string(), "351".to_string()),
                ("transmission".to_string(), "manual".to_string()),
                ("curbWeight".to_string(), "2835".to_string()),
            ]),
        };

        let property_types = BusinessObjectPropertyTypes {
            types: HashMap::from([
                ("model".to_string(), PropertyType::String),
                ("bodyStyle".to_string(), PropertyType::String),
                ("engineDisplacement".to_string(), PropertyType::Int),
                ("transmission".to_string(), PropertyType::String),
                ("curbWeight".to_string(), PropertyType::Int),
            ]),
        };

        let query = Query {
            combinator: "and".to_string(),
            rules: vec![
                RuleOrGroup::Rule(Rule {
                    field: "model".to_string(),
                    operator: "=".to_string(),
                    value_source: "value".to_string(),
                    value: "mustang".to_string(),
                }),
                RuleOrGroup::Group(RuleGroup {
                    rules: vec![
                        RuleOrGroup::Rule(Rule {
                            field: "bodyStyle".to_string(),
                            operator: "=".to_string(),
                            value_source: "value".to_string(),
                            value: "convertible".to_string(),
                        }),
                        RuleOrGroup::Rule(Rule {
                            field: "engineDisplacement".to_string(),
                            operator: "=".to_string(),
                            value_source: "value".to_string(),
                            value: "351".to_string(),
                        }),
                    ],
                    combinator: "or".to_string(),
                    not: false,
                }),
                RuleOrGroup::Group(RuleGroup {
                    rules: vec![
                        RuleOrGroup::Rule(Rule {
                            field: "transmission".to_string(),
                            operator: "=".to_string(),
                            value_source: "value".to_string(),
                            value: "manual".to_string(),
                        }),
                        RuleOrGroup::Rule(Rule {
                            field: "curbWeight".to_string(),
                            operator: "=".to_string(),
                            value_source: "value".to_string(),
                            value: "2835".to_string(),
                        }),
                    ],
                    combinator: "and".to_string(),
                    not: false,
                }),
            ],
        };

        let result = evaluate_rules(&business_object, &query.rules, &query.combinator, &property_types);
        assert_eq!(result, Ok(true));
    }

    #[test]
    fn test_one_field_two_rule_groups_two_recursion_levels() {
        let business_object = BusinessObject {
            properties: HashMap::from([
                ("model".to_string(), "mustang".to_string()),
                ("bodyStyle".to_string(), "convertible".to_string()),
                ("engineDisplacement".to_string(), "351".to_string()),
                ("year".to_string(), "1969".to_string()),
                ("turningDiameter".to_string(), "37".to_string()),
            ]),
        };

        let property_types = BusinessObjectPropertyTypes {
            types: HashMap::from([
                ("model".to_string(), PropertyType::String),
                ("bodyStyle".to_string(), PropertyType::String),
                ("engineDisplacement".to_string(), PropertyType::Int),
                ("year".to_string(), PropertyType::Int),
                ("turningDiameter".to_string(), PropertyType::Float),
            ]),
        };

        let query = Query {
            combinator: "and".to_string(),
            rules: vec![
                RuleOrGroup::Rule(Rule {
                    field: "model".to_string(),
                    operator: "=".to_string(),
                    value_source: "value".to_string(),
                    value: "mustang".to_string(),
                }),
                RuleOrGroup::Group(RuleGroup {
                    rules: vec![
                        RuleOrGroup::Rule(Rule {
                            field: "bodyStyle".to_string(),
                            operator: "=".to_string(),
                            value_source: "value".to_string(),
                            value: "convertible".to_string(),
                        }),
                        RuleOrGroup::Rule(Rule {
                            field: "engineDisplacement".to_string(),
                            operator: "=".to_string(),
                            value_source: "value".to_string(),
                            value: "351".to_string(),
                        }),
                        RuleOrGroup::Group(RuleGroup {
                            rules: vec![
                                RuleOrGroup::Rule(Rule {
                                    field: "year".to_string(),
                                    operator: "=".to_string(),
                                    value_source: "value".to_string(),
                                    value: "1969".to_string(),
                                }),
                                RuleOrGroup::Rule(Rule {
                                    field: "turningDiameter".to_string(),
                                    operator: ">=".to_string(),
                                    value_source: "value".to_string(),
                                    value: "37".to_string(),
                                }),
                            ],
                            combinator: "or".to_string(),
                            not: false,
                        }),
                    ],
                    combinator: "or".to_string(),
                    not: false,
                }),
            ],
        };

        let result = evaluate_rules(&business_object, &query.rules, &query.combinator, &property_types);
        assert_eq!(result, Ok(true));
    }

    #[test]
    fn test_evaluate_rules_with_json() {
        // JSON representation of the business object
        let business_object = BusinessObject {
            properties: HashMap::from([
                ("model".to_string(), "mustang".to_string()),
                ("bodyStyle".to_string(), "convertible".to_string()),
                ("engineDisplacement".to_string(), "351".to_string()),
                ("year".to_string(), "1969".to_string()),
                ("turningDiameter".to_string(), "37".to_string()),
            ]),
        };

        // JSON representation of the property types
        let property_types_json = json!({
            "model": "String",
            "bodyStyle": "String",
            "engineDisplacement": "Int"
        });

        // JSON representation of the query
        let query_json = json!({
            "combinator": "and",
            "rules": [
                {
                    "field": "model",
                    "operator": "=",
                    "valueSource": "value",
                    "value": "mustang"
                },
                {
                    "combinator": "or",
                    "not": false,
                    "rules": [
                        {
                            "field": "bodyStyle",
                            "operator": "=",
                            "valueSource": "value",
                            "value": "convertible"
                        },
                        {
                            "field": "engineDisplacement",
                            "operator": "=",
                            "valueSource": "value",
                            "value": "351"
                        }
                    ]
                }
            ]
        });

        let property_types = deserialize_property_types(property_types_json).unwrap();
        let query = deserialize_query(query_json).unwrap();


        // Evaluate the rules
        let result = evaluate_rules(&business_object, &query.rules, &query.combinator, &property_types);
        assert_eq!(result, Ok(true));
    }
}
