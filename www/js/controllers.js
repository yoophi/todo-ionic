var AboutCtrl, AppCtrl, TodoCtrl, TodolistCtrl;

AppCtrl = (function() {
  AppCtrl.$inject = ['$scope', '$ionicModal', '$timeout'];

  function AppCtrl($scope, $ionicModal, $timeout) {
    $scope.loginData = {};
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.closeLogin = function() {
      $scope.modal.hide();
    };
    $scope.login = function() {
      $scope.modal.show();
    };
    $scope.doLogin = function() {
      console.log('Doing login', $scope.loginData);
      $timeout((function() {
        $scope.closeLogin();
      }), 1000);
    };
    return;
  }

  return AppCtrl;

})();

TodoCtrl = (function() {
  TodoCtrl.$inject = ['$scope'];

  function TodoCtrl($scope1) {
    this.$scope = $scope1;
    this.todo = {
      title: 'hello world',
      id: 1
    };
    return;
  }

  return TodoCtrl;

})();

TodolistCtrl = (function() {
  TodolistCtrl.$inject = ['$scope'];

  function TodolistCtrl($scope1) {
    this.$scope = $scope1;
    this.todos = [
      {
        title: 'Reggae',
        id: 1
      }, {
        title: 'Chill',
        id: 2
      }, {
        title: 'Dubstep',
        id: 3
      }, {
        title: 'Indie',
        id: 4
      }, {
        title: 'Rap',
        id: 5
      }, {
        title: 'Cowbell',
        id: 6
      }
    ];
    return;
  }

  return TodolistCtrl;

})();

AboutCtrl = (function() {
  AboutCtrl.$inject = ['$scope', '$stateParams'];

  function AboutCtrl($scope, $stateParams) {
    return;
  }

  return AboutCtrl;

})();

angular.module('starter.controllers', []).controller('AppCtrl', AppCtrl).controller('TodolistCtrl', TodolistCtrl).controller('TodoCtrl', TodoCtrl).controller('AboutCtrl', AboutCtrl);
