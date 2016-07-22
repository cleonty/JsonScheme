(function (angular, document, app) {
  function onReady() {
    angular.bootstrap(document, [app.name]);
  }
  
  angular.element(document).ready(onReady);
})(angular, document, angular.module('app', []));