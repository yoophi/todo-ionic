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
  @inject '$http', '$interval', 'localStorageService', 'authService'

  loginWindow = null

  initialize: ->
    @API_ENDPOINT = if ionic.Platform.isWebView() then 'http://todo.yoophi.com/api/v1.0' else '/todo/api'
    @CLIENT_ID = 'ionic'
    @AUTH_URL = 'http://todo.yoophi.com/api/v1.0/oauth/authorize'
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

  login: ->
    LOGIN_URL = "#{@AUTH_URL}?client_id=#{@CLIENT_ID}&scope=email&response_type=token&redirect_uri=#{encodeURIComponent(@AUTH_REDIRECT_URL)}"
    @loginWindow = window.open LOGIN_URL, '_blank', 'width=400,height=250,location=no,clearsessioncache=yes,clearcache=yes'

    configUpdater = (config) =>
      config.params = config.params or {}
      config.params.access_token = @getAccessToken()
      # jshint ignore:line
      config

    console.log 'ionic.Platform.isWebView()', ionic.Platform.isWebView()

    if ionic.Platform.isWebView()
      # If running in a WebView (i.e. on a mobile device/simulator)
      console.log '>> adding EventListener loadstart'
      @loginWindow.addEventListener 'loadstart', (event) =>
        console.log 'event.url', event.url
        if event.url.indexOf(@AUTH_REDIRECT_URL) == 0
          accessToken = @getVariableFromHash event.url, 'access_token'
          console.log 'accessToken: ' + accessToken
          @localStorageService.set 'accessToken', accessToken
          @loginWindow.close()

          if @isLoggedIn()
            @authService.loginConfirmed null, configUpdater
        return
      console.log '<< adding EventListener loadstart'
    else
      # if running on a desktop browser, use this hack
      intervalCount = 0
      timesToRepeat = 100
      intervalDelay = 3000

      loginPoller = =>
        intervalCount++
        if @isLoggedIn()
          console.log 'user is logged in now'
          @$interval.cancel promise
          @authService.loginConfirmed null, configUpdater
        else
          console.log 'user not logged in yet, we wont wait forever.  Intervals left:', timesToRepeat - intervalCount
          if intervalCount >= timesToRepeat
            @$interval.cancel promise
            console.log 'Since this is a hack for running the app in the browser, we are now giving up on you logging in.'
            @loginWindow.close()
        return

      promise = @$interval loginPoller, intervalDelay, timesToRepeat, false
    return


  logout: ->
    @localStorageService.remove 'accessToken'

  getAccessToken: ->
    @localStorageService.get 'accessToken'

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

angular.module('starter').service 'TodoApiService', TodoApiService
