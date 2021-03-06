/* global malarkey:false, moment:false 
http://lapptienda-api-dev-auth.azurewebsites.net/
*/

(function() {
    'use strict';

    angular
        .module('lappweb')
        .constant('moment', moment)
        .constant('RESOURCE_API', 'http://lapptienda-api-pdn.azurewebsites.net/')
        .constant('RESOURCE_API_TEMP', 'http://lapptienda-api-pdn.azurewebsites.net/api/')
        .constant('RESOURCE_API_TOKEN', 'http://lapptienda-api-pdn.azurewebsites.net/token')
        .constant('GRAPH_API_URL', 'https://graph.facebook.com/v2.7/me?fields=id,name,email,gender')
        .constant("MED_CODE", "71e60b8aab914e8e8ae2d532ca73cb83");
})();