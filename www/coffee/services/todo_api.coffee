'use strict'

class BaseService
  @inject: (args...) ->
    @$inject = args

  constructor: (args...) ->
    for key, index in @constructor.$inject
      this[key] = args[index]
    @scope = @$scope if @$scope?

    @initialize?.call(this)

class TodoApiService extends BaseService
  @inject '$http', '$interval', '$httpParamSerializer', '$q', 'localStorageService', 'authService'

  loginWindow = null

  initialize: ->
    @API_ENDPOINT = if ionic.Platform.isWebView() then 'http://todo.yoophi.com/api/v1.0' else '/todo/api'
    @CLIENT_ID = 'ionic'
    @AUTH_URL = 'http://todo.yoophi.com/api/v1.0/oauth/token'
    @AUTH_REDIRECT_URL = 'http://localhost:8100/callback.html'
    @LOGOUT_URL = 'https://instagram.com/accounts/logout'

  getEndpoint: ->
    @API_ENDPOINT

  getVariableFromHash: (url, variable) ->
    query = url.split('#')[1]
    vars = query.split('&')
    i = 0
    while i < vars.length
      pair = vars[i].split('=')
      if decodeURIComponent(pair[0]) == variable
        return decodeURIComponent(pair[1])
      i++

    return

  login: (username, password) ->
    LOGIN_URL = @API_ENDPOINT + '/oauth/token'
    params =
      grant_type: 'password'
      client_id: 'ionic'
      client_secret: 'secret'
      scope: 'email'
      username: username
      password: password

    req =
      method: 'POST'
      url: LOGIN_URL
      headers: 'Content-Type': 'application/x-www-form-urlencoded'
      data: @$httpParamSerializer(params)

    promise = @$http(req).success((response) =>
      deferred = @$q.defer()
      if response.access_token?
        configUpdater = (config) =>
          config.params = config.params or {}
          config.params.access_token = response.access_token

          config

        @localStorageService.set 'accessToken', response.access_token
        @localStorageService.set 'refreshToken', response.refresh_token
        @authService.loginConfirmed null, configUpdater

        deferred.resolve(true)
      else:
        deferred.reject('login failed')

    ).error((data, status) ->
      console.log 'add returned status:' + status
      return
    )
    promise

  getAccessTokenWithRefreshToken: ->
    console.log 'getAccesTokenWithRefreshToken ...'
    deferred = @$q.defer()

    refreshToken = @getRefreshToken()
    if not refreshToken
      console.log 'no refresh_token'
      deferred.reject()
    else
      if false and @localStorageService.get 'refreshed'
        deferred.reject()
      else
        LOGIN_URL = @API_ENDPOINT + '/oauth/token'
        params =
          grant_type: 'refresh_token'
          client_id: 'ionic'
          client_secret: 'secret'
          refresh_token: refreshToken

        req =
          method: 'POST'
          url: LOGIN_URL
          headers: 'Content-Type': 'application/x-www-form-urlencoded'
          data: @$httpParamSerializer(params)

        promise = @$http(req).success((response) =>
          if response.access_token?
            configUpdater = (config) =>
              config.params = config.params or {}
              config.params.access_token = response.access_token

              config

            @localStorageService.set 'accessToken', response.access_token
            @localStorageService.set 'refreshToken', response.refresh_token
            @localStorageService.set 'refreshed', true
            @authService.loginConfirmed null, configUpdater

            deferred.resolve()
          else:
            deferred.reject('login failed')
        )

    return deferred.promise

  logout: ->
    @localStorageService.remove 'accessToken'

  getAccessToken: ->
    @localStorageService.get 'accessToken'

  getRefreshToken: ->
    @localStorageService.get 'refreshToken'

  isLoggedIn: ->
    !! @getAccessToken()

  findTodos: () ->
    console.log 'TodoApiService.findTodos'
    # jshint ignore:line

    promise = @$http.get(@API_ENDPOINT + '/todos', {}).error((data, status) ->
      console.log 'findTodos returned status:' + status
      return
    )
    promise

  findTodo: (todo_id) ->
    promise = @$http.get(@API_ENDPOINT + "/todo/#{todo_id}", {}).error((data, status) ->
      console.log 'findTodo returned status:' + status
      return
    )
    promise

  findCurrentUser: () ->
    promise = @$http.get(@API_ENDPOINT + "/users/self", {}).error((data, status) ->
      console.log 'findCurrentUser returned status:' + status
      return
    )
    promise

  add: (todo) ->
    promise = @$http.post(@API_ENDPOINT + "/todos", todo).error((data, status) ->
      console.log 'add returned status:' + status
      return
    )
    promise

  done: (todo_id) ->
    promise = @$http.put(@API_ENDPOINT + "/todo/#{todo_id}", {is_completed: true}).error((data, status) ->
      console.log 'done returned status:' + status
      return
    )
    promise

  remove: (todo_id) ->
    promise = @$http.delete(@API_ENDPOINT + "/todo/#{todo_id}", {}).error((data, status) ->
      console.log 'done returned status:' + status
      return
    )
    promise


angular.module('starter').service 'TodoApiService', TodoApiService
