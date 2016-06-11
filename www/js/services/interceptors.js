'use strict';
angular.module('starter').factory('TodoApiInterceptor', function($injector, $q) {
  var hideLoadingModalIfNessary;
  hideLoadingModalIfNessary = function() {
    var $http;
    $http = $http || $injector.get('$http');
    if ($http.pendingRequests.length === 0) {
      return $injector.get('$ionicLoading').hide();
    }
  };
  return {
    request: function(config) {
      var TodoApiService;
      $injector.get('$ionicLoading').show();
      TodoApiService = $injector.get('TodoApiService');
      if (TodoApiService.isLoggedIn() && config.url.indexOf(TodoApiService.getEndpoint()) === 0) {
        config.params = config.params || {};
        config.params.access_token = TodoApiService.getAccessToken();
      }
      return config;
    },
    requestError: function(rejection) {
      hideLoadingModalIfNessary();
      return $q.reject(rejection);
    },
    response: function(response) {
      hideLoadingModalIfNessary();
      return response;
    },
    responseError: function(rejection) {
      hideLoadingModalIfNessary();
      if (rejection.status === 400 && rejection.data.meta.error_type === 'OAuthParameterException') {
        rejection.status = 401;
      }
      return $q.reject(rejection);
    }
  };
});
