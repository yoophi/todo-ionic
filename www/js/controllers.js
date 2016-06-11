var AboutCtrl, AppCtrl, TodoCtrl, TodolistCtrl;

AppCtrl = (function() {
  AppCtrl.$inject = ['$scope', '$ionicModal', '$timeout'];

  function AppCtrl($scope1, $ionicModal, $timeout) {
    this.$scope = $scope1;
    this.$ionicModal = $ionicModal;
    this.$timeout = $timeout;
    this.$scope.loginData = {};
    this.$ionicModal.fromTemplateUrl('templates/login.html', {
      scope: this.$scope
    }).then((function(_this) {
      return function(modal) {
        _this.$scope.modal = modal;
      };
    })(this));
    this.$scope.closeLogin = (function(_this) {
      return function() {
        _this.$scope.modal.hide();
      };
    })(this);
    this.$scope.login = (function(_this) {
      return function() {
        _this.$scope.modal.show();
      };
    })(this);
    this.$scope.doLogin = (function(_this) {
      return function() {
        console.log('Doing login', _this.$scope.loginData);
        _this.$timeout((function() {
          _this.$scope.closeLogin();
        }), 1000);
      };
    })(this);
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
