#!/usr/bin/env bash

# Currently, AM config exported through Amster doesn't retain commons parameters.  
# This script can be used to update the exported config with the commons parameters currently available in forgeops.
# Use the variables below to provide the current amsterVersion and fqdn values used in the exported config.  
# This is mandatory for the script to work correctly. 
# - fqdn can be found in site1.json.
# - amsterVersion is available in every config file.
# There is an additional fix at the bottom to resolve a bug in the current export job.


# Variables to be replaced
CURRENT_VERSION="6.5.1" # amsterVersion in config
DOMAIN_NAME="ameren.com"
TARGET_NS="eiam-qa"
QA_FQDN="login.eiam-qa.${DOMAIN_NAME}" # current fqdn in config
DEV_FQDN="login.ciam-dev.${DOMAIN_NAME}" # current fqdn in config
PUBLIC_FQDN="login.eiam-qa.ece.${DOMAIN_NAME}" #current public FQDN


if [ ! -d "global" ]; then
    echo "No global config directory.  Please cd into the relevant config directory. There should be a global/ and realm/ sub directory only"
    exit 9999
fi

# Add version parameter
find . -name "*.json" -exec sed -i "s/${CURRENT_VERSION}/\&{version}/g" {} \;


# Add fqdn parameter
find . -name "*.json" -exec sed -i "s/${QA_FQDN}/\&{fqdn}/g" {} \;
find . -name "*.json" -exec sed -i "s/${DEV_FQDN}/\&{fqdn}/g" {} \;

#replace namespace
find . -name "*.json" -exec sed -i "s/eiam-qa/\&{namespace}/g" {} \;
find . -name "*.json" -exec sed -i "s/ciam-dev/\&{namespace}/g" {} \;

# # replace public fqdn parameter
# find . -name "*.json" -exec sed -i "s/${PUBLIC_FQDN}/login.${TARGET_NS}.ece.${DOMAIN_NAME}/g" {} \;

# # replace QA environment domain name parameter
# find . -name "*.json" -exec sed -i "s/eiam-qa.${DOMAIN_NAME}/${TARGET_NS}.ece.${DOMAIN_NAME}/g" {} \;
# find . -name "*.json" -exec sed -i "s/eiam-qa.${DOMAIN_NAME}/${TARGET_NS}.${DOMAIN_NAME}/g" {} \;

# # replace DEV environment domain name parameter
# find . -name "*.json" -exec sed -i "s/ciam-dev.${DOMAIN_NAME}/${TARGET_NS}.ece.${DOMAIN_NAME}/g" {} \;
# find . -name "*.json" -exec sed -i "s/ciam-dev.${DOMAIN_NAME}/${TARGET_NS}.${DOMAIN_NAME}/g" {} \;



# Add global ctsstores parameter
sed -i 's/"org.forgerock.services.cts.store.directory.name" : "[^"][^"]*"/"org.forgerock.services.cts.store.directory.name" : "\&{CTS_STORES|ctsstore-0.ctsstore:1389}"/g' global/DefaultCtsDataStoreProperties.json

# Add global cts password parameter
sed -i  's/"org.forgerock.services.cts.store.password" : null/"org.forgerock.services.cts.store.password" : "\&{CTS_PASSWORD|password}"/g' global/DefaultCtsDataStoreProperties.json

# remove id field for site1.json as this is a bug and import will fail otherwise.
sed -i  '/"id"/d' global/Sites/site1.json

