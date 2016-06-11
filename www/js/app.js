angular.module('starter', ['ionic', 'starter.controllers', 'LocalStorageModule', 'http-auth-interceptor']).run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
}).config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl',
    controllerAs: 'app'
  }).state('app.todos', {
    url: '/todos',
    views: {
      'menuContent': {
        templateUrl: 'templates/todos.html',
        controller: 'TodolistCtrl',
        controllerAs: 'todos'
      }
    }
  }).state('app.account', {
    url: '/account',
    views: {
      'menuContent': {
        templateUrl: 'templates/account.html',
        controller: 'AccountCtrl',
        controllerAs: 'account'
      }
    }
  }).state('app.about', {
    url: '/about',
    views: {
      'menuContent': {
        templateUrl: 'templates/about.html',
        controller: 'AboutCtrl'
      }
    }
  }).state('app.todo', {
    url: '/todo/:todoId',
    views: {
      'menuContent': {
        templateUrl: 'templates/todo.html',
        controller: 'TodoCtrl',
        controllerAs: 'todo'
      }
    }
  });
  $urlRouterProvider.otherwise('/app/about');
}).config(function($httpProvider) {
  return $httpProvider.interceptors.push('TodoApiInterceptor');
});
