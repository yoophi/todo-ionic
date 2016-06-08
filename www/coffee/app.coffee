# Ionic Starter App
# angular.module is a global place for creating, registering and retrieving Angular modules
# 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
# the 2nd parameter is an array of 'requires'
# 'starter.controllers' is found in controllers.js
angular.module('starter', [
  'ionic'
  'starter.controllers'
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
).config ($stateProvider, $urlRouterProvider) ->
  $stateProvider
  .state('app',
    url: '/app'
    abstract: true
    templateUrl: 'templates/menu.html'
    controller: 'AppCtrl')
  .state('app.todos',
    url: '/todos'
    views: 'menuContent':
      templateUrl: 'templates/todos.html'
      controller: 'TodolistCtrl'
      controllerAs: 'todos')
  .state('app.account',
    url: '/account'
    views: 'menuContent': 
      templateUrl: 'templates/account.html')
  .state('app.about',
    url: '/about'
    views: 'menuContent':
      templateUrl: 'templates/about.html'
      controller: 'AboutCtrl')
  .state 'app.todo',
    url: '/todo/:todoId'
    views: 'menuContent':
      templateUrl: 'templates/todo.html'
      controller: 'TodoCtrl'
      controllerAs: 'todo'
  # if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise '/app/about'
  return