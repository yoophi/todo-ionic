var AboutCtrl, AppCtrl, BaseController, TodoCtrl, TodolistCtrl,
  slice = [].slice,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseController = (function() {
  BaseController.inject = function() {
    var args;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return this.$inject = args;
  };

  function BaseController() {
    var args, i, index, key, len, ref, ref1;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    ref = this.constructor.$inject;
    for (index = i = 0, len = ref.length; i < len; index = ++i) {
      key = ref[index];
      this[key] = args[index];
    }
    if (this.$scope != null) {
      this.scope = this.$scope;
    }
    if ((ref1 = this.initialize) != null) {
      ref1.call(this);
    }
  }

  return BaseController;

})();

AppCtrl = (function(superClass) {
  extend(AppCtrl, superClass);

  function AppCtrl() {
    return AppCtrl.__super__.constructor.apply(this, arguments);
  }

  AppCtrl.inject('$scope', '$ionicModal', '$timeout');

  AppCtrl.prototype.initialize = function() {
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
  };

  return AppCtrl;

})(BaseController);

TodoCtrl = (function(superClass) {
  extend(TodoCtrl, superClass);

  function TodoCtrl() {
    return TodoCtrl.__super__.constructor.apply(this, arguments);
  }

  TodoCtrl.inject('$scope');

  TodoCtrl.prototype.initialize = function() {
    this.todo = {
      title: 'hello world',
      id: 1
    };
  };

  return TodoCtrl;

})(BaseController);

TodolistCtrl = (function(superClass) {
  extend(TodolistCtrl, superClass);

  function TodolistCtrl() {
    return TodolistCtrl.__super__.constructor.apply(this, arguments);
  }

  TodolistCtrl.inject('$scope');

  TodolistCtrl.prototype.initialize = function() {
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
  };

  return TodolistCtrl;

})(BaseController);

AboutCtrl = (function(superClass) {
  extend(AboutCtrl, superClass);

  function AboutCtrl() {
    return AboutCtrl.__super__.constructor.apply(this, arguments);
  }

  AboutCtrl.inject('$scope', '$stateParams');

  return AboutCtrl;

})(BaseController);

angular.module('starter.controllers', []).controller('AppCtrl', AppCtrl).controller('TodolistCtrl', TodolistCtrl).controller('TodoCtrl', TodoCtrl).controller('AboutCtrl', AboutCtrl);
