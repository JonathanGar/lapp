(function() {
    'use strict';

    angular
        .module('lappweb')
        .config(config);

    /** @ngInject */
    function config($logProvider, toastrConfig, vcRecaptchaServiceProvider) {
        // Enable log
        $logProvider.debugEnabled(true);
        // Set options third-party lib
        toastrConfig.allowHtml = true;
        toastrConfig.timeOut = 3000;
        toastrConfig.positionClass = 'toast-top-right';
        toastrConfig.preventDuplicates = false;
        toastrConfig.progressBar = true;
        toastrConfig.autoDismiss = true;
        toastrConfig.newestOnTop = true;

        vcRecaptchaServiceProvider.setDefaults({
            key: '6Lcj7BYUAAAAAJw9MiOE_OhNf5xp0SU4irXwDP61',
            theme: 'dark',
            //stoken: '--- YOUR GENERATED SECURE TOKEN ---',
            size: 'compact',
            type: 'image',
            lang: 'es'
        });
    }

})();