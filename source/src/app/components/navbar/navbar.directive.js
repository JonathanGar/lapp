(function() {
    'use strict';

    angular
        .module('lappweb')
        .directive('lappNavbar', lappNavbar);

    lappNavbar.$inject = ['MainService', '$rootScope', 'ProductService', '$state'];
    /** @ngInject */
    function lappNavbar(MainService, $rootScope, ProductService, $state) {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/navbar/navbar.html',
            scope: {
                creationDate: '=',
                cartPrice: '=?cartPrice'
            },
            controller: NavbarController,
            controllerAs: 'nav',
            bindToController: true
        };

        return directive;

        /** @ngInject */
        function NavbarController(MainService, $rootScope, ProductService, $state) {
            var vm = this;

            vm.showCatgories = false;
            vm.productSelected = "";
            // vm.cartPrice = 0;
            // $rootScope.$on('productAdded', function(event) {
            // });

            /*MainService.obtainAccessToken().then(function(resp) {
                //Categorias menu
                MainService.catalogs(resp.access_token).then(function(data) {
                    debugger;
                    vm.categories = data;
                }).catch(function(err) {
                    debugger;
                });

                ProductService.get().then(function(data) {
                    vm.products = resp;
                });

                vm.onSelect = function($item, $model, $label) {
                    $state.go('products', { id: $item.id });
                };
            }).catch(function(err) {
                debugger;
            });*/


            var winW, winH, winScr, _isresponsive, _ismobile = navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i);

            /*========================*/
            /* 02 - page calculations */
            /*========================*/
            function pageCalculations() {
                winW = window.innerWidth;
                winH = window.innerHeight;
                if (angular.element(document.querySelector('.menu-button')).is(':visible')) _isresponsive = true;
                else _isresponsive = false;


            }

            /*=================================*/
            /* 03 - function on document ready */
            /*=================================*/
            pageCalculations();
            var $searchDropDownOverflow = angular.element(document.querySelector('.search-drop-down .overflow'));
            var $searchDropDown = angular.element(document.querySelector('.search-drop-down'));

            if ($searchDropDownOverflow.length && !_ismobile) {
                $searchDropDown.addClass('active');
                $searchDropDownOverflow.jScrollPane();
                $searchDropDown.removeClass('active');
            }
            if (_ismobile) $('body').addClass('mobile');

            /*============================*/
            /* 04 - function on page load */
            /*============================*/
            pageCalculations();
            angular.element(document.querySelector('#loader-wrapper')).fadeOut();
            angular.element(document.querySelector('body')).addClass('loaded');

            /*==============================*/
            /* 05 - function on page resize */
            /*==============================*/
            function resizeCall() {
                pageCalculations();

                $('.navigation:not(.disable-animation)').addClass('disable-animation');
            }
            if (!_ismobile) {
                $(window).resize(function() {
                    resizeCall();
                });
            } else {
                window.addEventListener("orientationchange", function() {
                    resizeCall();
                }, false);
            }

            //desktop menu
            $('nav>ul>li').on('mouseover', function() {
                if (!_isresponsive) {
                    $(this).find('.submenu').stop().fadeIn(300);
                }
            });

            $('nav>ul>li').on('mouseleave', function() {
                if (!_isresponsive) {
                    $(this).find('.submenu').stop().fadeOut(300);
                }
            });

            //responsive menu
            $('nav li .fa').on('click', function() {
                if (_isresponsive) {
                    $(this).next('.submenu').slideToggle();
                    $(this).parent().toggleClass('opened');
                }
            });

            angular.element(document.querySelector('.submenu-list-title .toggle-list-button')).on('click', function() {
                if (_isresponsive) {
                    $(this).parent().next('.toggle-list-container').slideToggle();
                    $(this).parent().toggleClass('opened');
                }
            });

            angular.element(document.querySelector('.menu-button')).on('click', function() {
                $('.navigation.disable-animation').removeClass('disable-animation');
                $('body').addClass('opened-menu');
                $(this).closest('header').addClass('opened');
                $('.opened .close-header-layer').fadeIn(300);
                closePopups();
                return false;
            });

            angular.element(document.querySelector('.close-menu')).on('click', function() {
                $('.navigation.disable-animation').removeClass('disable-animation');
                $('body').removeClass('opened-menu');
                $('header.opened').removeClass('opened');
                $('.close-header-layer:visible').fadeOut(300);
            });

            //toggle menu block for "everything" template
            angular.element(document.querySelector('.toggle-desktop-menu')).on('click', function() {
                $('.navigation').toggleClass('active');
                $('nav').removeClass('disable-animation');
                $('.search-drop-down').removeClass('active');
            });

            /*sidebar menu*/
            angular.element(document.querySelector('.sidebar-navigation .title')).on('click', function() {
                if ($('.sidebar-navigation .title .fa').is(':visible')) {
                    $(this).parent().find('.list').slideToggle(300);
                    $(this).parent().toggleClass('active');
                }
            });

            /*search drop down*/
            angular.element(document.querySelector('.search-drop-down .title')).on('click', function() {
                $(this).parent().toggleClass('active');
            });

            angular.element(document.querySelector('.search-drop-down .category-entry')).on('click', function() {
                var thisDropDown = $(this).closest('.search-drop-down');
                thisDropDown.removeClass('active');
                thisDropDown.find('.title span').text($(this).text());
            });



            angular.element(document.querySelector('.departmets-drop-down .title')).on('click', function() {
                $(this).parent().find('.list').slideToggle(300);
                $(this).toggleClass('active');
            });

            angular.element(document.querySelector('.departmets-drop-down')).on('mouseleave', function() {
                $(this).find('.list').slideUp(300);
                $(this).find('.title').removeClass('active');
            });


        }
    }

})();