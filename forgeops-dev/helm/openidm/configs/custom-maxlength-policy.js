/*
* Copyright 2012-2018 ForgeRock AS. All Rights Reserved
*
* Use of this code requires a commercial software license with ForgeRock AS.
* or with one of its affiliates. All use shall be exclusively subject
* to such license between the licensee and ForgeRock AS.
*/

/*global additionalPolicies,resources, require */
var policy1 = {
"policyId" : "maximum-length",
"policyExec" : "maxLength",
"clientValidation" : true,
"validateOnlyIfPresent" : true,
"policyRequirements" : ["MAX_LENGTH"]
}


addPolicy(policy1);


function maxLength(fullObject, value, params, property) {
var maxLength = params.maxLength;
var val = "";


if (value != null) {
val = value;
}


if (val.length > max.length) {
return [ { "policyRequirement" : " No more than " + maxLength + "characters", "params" : {"maxLength":maxLength} } ];
}
return []
};
