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
}).run([
  '$rootScope', '$state', 'TodoApiService', function($rootScope, $state, TodoApiService) {
    return $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
      if (toState.authenticate && !TodoApiService.isLoggedIn()) {
        event.preventDefault();
        return TodoApiService.login();
      }
    });
  }
]).config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl',
    controllerAs: 'app'
  }).state('app.todos', {
    url: '/todos',
    authenticate: true,
    views: {
      'menuContent': {
        templateUrl: 'templates/todos.html',
        controller: 'TodolistCtrl',
        controllerAs: 'todos'
      }
    }
  }).state('app.account', {
    url: '/account',
    authenticate: true,
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
    authenticate: true,
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
