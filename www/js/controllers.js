var AboutCtrl, AccountCtrl, AppCtrl, BaseController, TodoCtrl, TodolistCtrl,
  slice = [].slice,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

BaseController = (function() {
  BaseController.inject = function() {
    var args;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return this.$inject = args;
  };

  function BaseController() {
    var args, fn, fn1, i, index, key, len, ref, ref1, ref2;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    ref = this.constructor.$inject;
    for (index = i = 0, len = ref.length; i < len; index = ++i) {
      key = ref[index];
      this[key] = args[index];
    }
    if (this.$scope != null) {
      this.scope = this.$scope;
    }
    ref1 = this.constructor.prototype;
    fn1 = (function(_this) {
      return function(key) {
        if (typeof fn === 'function') {
          fn = (typeof fn.bind === "function" ? fn.bind(_this) : void 0) || _.bind(fn, _this);
        }
        Object.defineProperty(_this, key, {
          get: function() {
            return this.scope[key];
          },
          set: function(v) {
            return this.scope[key] = v;
          }
        });
        return _this.scope[key] = fn;
      };
    })(this);
    for (key in ref1) {
      fn = ref1[key];
      console.log(key);
      if ((key === 'constructor' || key === 'initialize') || key[0] === '_') {
        continue;
      }
      fn1(key);
    }
    if ((ref2 = this.initialize) != null) {
      ref2.call(this);
    }
  }

  return BaseController;

})();

AppCtrl = (function(superClass) {
  extend(AppCtrl, superClass);

  function AppCtrl() {
    return AppCtrl.__super__.constructor.apply(this, arguments);
  }

  AppCtrl.inject('$scope', '$rootScope', '$ionicHistory', '$state', '$ionicModal', '$timeout', 'TodoApiService');

  AppCtrl.prototype.initialize = function() {
    this.$scope.loginData = {};
    this.$ionicModal.fromTemplateUrl('templates/login.html', {
      scope: this.$scope
    }).then((function(_this) {
      return function(modal) {
        _this.$scope.modal = modal;
      };
    })(this));
    this.$rootScope.$on('showLoginModal', (function(_this) {
      return function() {
        return _this.login();
      };
    })(this));
    this.$rootScope.$on('event:auth-loginRequired', (function(_this) {
      return function() {
        var error_cb, success_cb;
        console.log('callback for ', 'event:auth-loginRequired');
        success_cb = function() {
          return console.log('success');
        };
        error_cb = function() {
          console.log('error');
          return _this.login();
        };
        return _this.TodoApiService.getAccessTokenWithRefreshToken(success_cb, error_cb);
      };
    })(this));
  };

  AppCtrl.prototype.closeLogin = function() {
    this.$scope.modal.hide();
  };

  AppCtrl.prototype.login = function() {
    this.$scope.modal.show();
  };

  AppCtrl.prototype.doLogin = function() {
    var password, username;
    username = this.$scope.loginData.username;
    password = this.$scope.loginData.password;
    this.TodoApiService.login(username, password).success((function(_this) {
      return function(response) {
        console.log('callback', response);
        return _this.$timeout((function() {
          _this.$scope.closeLogin();
        }), 1000);
      };
    })(this)).error(function(result) {
      return alert(result);
    });
  };

  AppCtrl.prototype.isLoggedIn = function() {
    return this.TodoApiService.isLoggedIn();
  };

  AppCtrl.prototype.logout = function() {
    return this.TodoApiService.logout();
  };

  return AppCtrl;

})(BaseController);

TodoCtrl = (function(superClass) {
  extend(TodoCtrl, superClass);

  function TodoCtrl() {
    return TodoCtrl.__super__.constructor.apply(this, arguments);
  }

  TodoCtrl.inject('$scope', '$stateParams', 'TodoApiService');

  TodoCtrl.prototype.initialize = function() {
    var todo_id;
    todo_id = this.$stateParams.todoId;
    this.TodoApiService.findTodo(todo_id).success((function(_this) {
      return function(response) {
        return _this.todo = response;
      };
    })(this));
  };

  return TodoCtrl;

})(BaseController);

TodolistCtrl = (function(superClass) {
  extend(TodolistCtrl, superClass);

  function TodolistCtrl() {
    this.done = bind(this.done, this);
    this.hideModalAddTodo = bind(this.hideModalAddTodo, this);
    return TodolistCtrl.__super__.constructor.apply(this, arguments);
  }

  TodolistCtrl.inject('$scope', '$q', '$ionicModal', 'TodoApiService');

  TodolistCtrl.prototype.initialize = function() {
    this.getTodos();
    this.$ionicModal.fromTemplateUrl('templates/modals/add-todo.html', {
      scope: this.$scope
    }).then((function(_this) {
      return function(modal) {
        _this.$scope.modalAddTodo = modal;
        _this.$scope.hideModalAddTodo = _this.hideModalAddTodo;
      };
    })(this));
    return this.$scope.addTodo = (function(_this) {
      return function(todo) {
        return _this.TodoApiService.add(todo).then(function() {
          _this.$scope.modalAddTodo.hide();
          return _this.getTodos();
        });
      };
    })(this);
  };

  TodolistCtrl.prototype.getTodos = function() {
    var deferred;
    deferred = this.$q.defer();
    this.TodoApiService.findTodos().success((function(_this) {
      return function(response) {
        _this.todos = response.todos;
        return deferred.resolve(response.todos);
      };
    })(this));
    return deferred.promise;
  };

  TodolistCtrl.prototype.showModalAddTodo = function() {
    return this.$scope.modalAddTodo.show();
  };

  TodolistCtrl.prototype.hideModalAddTodo = function() {
    return this.$scope.modalAddTodo.hide();
  };

  TodolistCtrl.prototype.done = function(todo_id) {
    return this.TodoApiService.done(todo_id).then((function(_this) {
      return function() {
        console.log("TodoApiService callback");
        return _this.getTodos();
      };
    })(this));
  };

  TodolistCtrl.prototype.remove = function(todo_id) {
    return this.TodoApiService.remove(todo_id).then((function(_this) {
      return function() {
        console.log("TodoApiService callback");
        return _this.getTodos();
      };
    })(this));
  };

  return TodolistCtrl;

})(BaseController);

AccountCtrl = (function(superClass) {
  extend(AccountCtrl, superClass);

  function AccountCtrl() {
    return AccountCtrl.__super__.constructor.apply(this, arguments);
  }

  AccountCtrl.inject('$scope', 'TodoApiService');

  AccountCtrl.prototype.initialize = function() {
    return this.TodoApiService.findCurrentUser().success((function(_this) {
      return function(response) {
        return _this.user = response;
      };
    })(this));
  };

  return AccountCtrl;

})(BaseController);

AboutCtrl = (function(superClass) {
  extend(AboutCtrl, superClass);

  function AboutCtrl() {
    return AboutCtrl.__super__.constructor.apply(this, arguments);
  }

  AboutCtrl.inject('$scope', '$stateParams');

  return AboutCtrl;

})(BaseController);

angular.module('starter.controllers', []).controller('AppCtrl', AppCtrl).controller('TodolistCtrl', TodolistCtrl).controller('TodoCtrl', TodoCtrl).controller('AccountCtrl', AccountCtrl).controller('AboutCtrl', AboutCtrl);
