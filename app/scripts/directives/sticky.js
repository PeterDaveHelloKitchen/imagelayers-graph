'use strict';

/**
 * @ngdoc directive
 * @name iLayers.directive:sticky
 * @description
 * # sticky
 */
angular.module('iLayers')
  .directive('sticky', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var main = element.parent('main'),
            offset = (attrs.offset) ? attrs.offset : 0;

        main.bind('scroll', function() {
          var top = main.scrollTop();
          if (main.scrollTop() >= offset) {
            element.addClass('sticky');
          } else {
            element.removeClass('sticky');
          }
        });
      }
    };
  });