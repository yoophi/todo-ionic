'use strict'

angular.module 'starter'
.factory 'TodoApiInterceptor', ($injector, $q) ->
  hideLoadingModalIfNessary = ->
    $http = $http || $injector.get '$http'
    $injector.get('$ionicLoading').hide() if $http.pendingRequests.length == 0

  return {
    request: (config) ->
      $injector.get('$ionicLoading').show()

      TodoApiService = $injector.get 'TodoApiService'
      if (TodoApiService.isLoggedIn() and
          config.url.indexOf(TodoApiService.getEndpoint()) == 0 and
          config.url.indexOf('/oauth/token') == -1
      )
        config.params = config.params || {}
        config.params.access_token = TodoApiService.getAccessToken()

      config

    requestError: (rejection) ->
      hideLoadingModalIfNessary()
      $q.reject rejection

    response: (response) ->
      hideLoadingModalIfNessary()
      response

    responseError: (rejection) ->
      hideLoadingModalIfNessary()
      if (rejection.status == 400 and rejection.data.meta.error_type == 'OAuthParameterException')
        rejection.status = 401

      $q.reject rejection
  }
