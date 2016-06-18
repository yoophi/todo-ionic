# Ionic Starter App
# angular.module is a global place for creating, registering and retrieving Angular modules
# 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
# the 2nd parameter is an array of 'requires'
# 'starter.controllers' is found in controllers.js
angular.module('starter', [
  'ionic'
  'starter.controllers'
  'LocalStorageModule'
  'http-auth-interceptor'
]).run(($ionicPlatform) ->
  $ionicPlatform.ready ->
    # Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    # for form inputs)
    if window.cordova and window.cordova.plugins.Keyboard
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar true
      cordova.plugins.Keyboard.disableScroll true
    if window.StatusBar
      # org.apache.cordova.statusbar required
      StatusBar.styleDefault()
    return
  return
).run(['$rootScope', '$state', 'TodoApiService',
  ($rootScope, $state, TodoApiService) ->
    $rootScope.$on '$stateChangeStart', (event, toState, toParams) ->
      if toState.authenticate and !TodoApiService.isLoggedIn()
        event.preventDefault()
        $rootScope.$broadcast('showLoginModal')
]
).config(($stateProvider, $urlRouterProvider) ->
  $stateProvider
  .state('app',
    url: '/app'
    abstract: true
    templateUrl: 'templates/menu.html'
    controller: 'AppCtrl'
    controllerAs: 'app'
  )
  .state('app.todos',
    url: '/todos'
    authenticate: true
    views: 'menuContent':
      templateUrl: 'templates/todos.html'
      controller: 'TodolistCtrl'
      controllerAs: 'todos'
  )
  .state('app.account',
    url: '/account'
    authenticate: true
    views: 'menuContent':
      templateUrl: 'templates/account.html'
      controller: 'AccountCtrl'
      controllerAs: 'account'
  )
  .state('app.about',
    url: '/about'
    views: 'menuContent':
      templateUrl: 'templates/about.html'
      controller: 'AboutCtrl'
  )
  .state('app.todo',
    url: '/todo/:todoId'
    authenticate: true
    views: 'menuContent':
      templateUrl: 'templates/todo.html'
      controller: 'TodoCtrl'
      controllerAs: 'todo'
  )

  # if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise '/app/about'
  return
)
.config(($httpProvider) ->
  $httpProvider.interceptors.push 'TodoApiInterceptor'
)

