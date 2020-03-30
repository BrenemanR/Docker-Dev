/*
 * Copyright 2016-2018 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */

/*global require, openidm, exports */

(function () {
    exports.setDefaultFields = function (object) {
       
       if(context.parent.parent.parent.parent.matchedUri == "selfservice/registration"){
  logger.info("context.parent:"+context.parent.parent.parent.parent.parent.parent.parent.authorization.roles);
}

else {
for(var i=0; i<context.parent.parent.parent.parent.authorization.roles.length;i++){
  if(context.parent.parent.parent.parent.authorization.roles[i] == "internal/role/d90bbd6e-94ee-41b8-9aa6-7a163a33d0d7"){
  object.organizationName = "CLM";
  break;
}
}
}
        
        if (!object.accountStatus) {
            object.accountStatus = 'active';
        }

        if (!object.authzRoles) {
            object.authzRoles = [
                {
                    "_ref": "internal/role/openidm-authorized"
                }
            ];
        }
        
        if (!object.roles){
        if(object.organizationName == "beepPortal"){
           object.roles = [
                {
                    "_ref" : "managed/role/beepPortalUnverified"
                }
               ];
        }
        else if(object.organizationName == "EA"){
           object.roles = [
                {
                    "_ref" : "managed/role/eaToolTemp"
                }
                ];
        } 
        else if(object.organizationName == "CLM"){
           object.roles = [
                {
                    "_ref" : "managed/role/clmPortalClmuser"
                }
                ];
        } 
        }

        // uncomment to randomly generate passwords for new users
         if (!object.password) {

         // generate random password that aligns with policy requirements
         object.password = require("crypto").generateRandomString([
         { "rule": "UPPERCASE", "minimum": 1 },
         { "rule": "LOWERCASE", "minimum": 1 },
         { "rule": "INTEGERS", "minimum": 1 },
         { "rule": "SPECIAL", "minimum": 1 }
         ], 16);

         }
         
    };

    /**
     * Sends an email to the passed object's provided `mail` address via idm system email (if configured).
     *
     * @param object -- managed user
     */
    exports.emailUser = function (object) {
        // if there is a configuration found, assume that it has been properly configured
        var emailConfig = openidm.read("config/external.email"), Handlebars = require('lib/handlebars'),
            emailTemplate = openidm.read("config/emailTemplate/welcome");

        if (emailConfig && emailConfig.host && emailTemplate && emailTemplate.enabled) {
            // Since email service is configured, check that 'mail' property is present on object before attempting send
            if (object.mail) {
                var email,
                    template,
                    locale = emailTemplate.defaultLocale;

                email =  {
                    "from": emailTemplate.from || emailConfig.from,
                    "to": object.mail,
                    "subject": emailTemplate.subject[locale],
                    "type": "text/html"
                };

                template = Handlebars.compile(emailTemplate.message[locale]);

                email.body = template({
                    "object": object
                 });

                // do NOT wait for completion, so that this call will succeed even if email fails to send
                return openidm.action("external/email", "send", email, { waitForCompletion: false });
            } else {
                logger.info("Mail property not set for the user object; "
                    + "the user was created but was not notified. Username: {}", object.userName);
            }
        }
    };
}());
