'use strict';
var BaseService, TodoApiService,
  slice = [].slice,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseService = (function() {
  BaseService.inject = function() {
    var args;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return this.$inject = args;
  };

  function BaseService() {
    var args, index, j, key, len, ref, ref1;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    ref = this.constructor.$inject;
    for (index = j = 0, len = ref.length; j < len; index = ++j) {
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

  return BaseService;

})();

TodoApiService = (function(superClass) {
  var loginWindow;

  extend(TodoApiService, superClass);

  function TodoApiService() {
    return TodoApiService.__super__.constructor.apply(this, arguments);
  }

  TodoApiService.inject('$http', '$interval', '$httpParamSerializer', '$q', 'localStorageService', 'authService');

  loginWindow = null;

  TodoApiService.prototype.initialize = function() {
    this.API_ENDPOINT = ionic.Platform.isWebView() ? 'http://todo.yoophi.com/api/v1.0' : '/todo/api';
    this.CLIENT_ID = 'ionic';
    this.AUTH_URL = 'http://todo.yoophi.com/api/v1.0/oauth/token';
    this.AUTH_REDIRECT_URL = 'http://localhost:8100/callback.html';
    return this.LOGOUT_URL = 'https://instagram.com/accounts/logout';
  };

  TodoApiService.prototype.getEndpoint = function() {
    return this.API_ENDPOINT;
  };

  TodoApiService.prototype.getVariableFromHash = function(url, variable) {
    var i, pair, query, vars;
    query = url.split('#')[1];
    vars = query.split('&');
    i = 0;
    while (i < vars.length) {
      pair = vars[i].split('=');
      if (decodeURIComponent(pair[0]) === variable) {
        return decodeURIComponent(pair[1]);
      }
      i++;
    }
  };

  TodoApiService.prototype.login = function(username, password) {
    var LOGIN_URL, params, promise, req;
    LOGIN_URL = this.API_ENDPOINT + '/oauth/token';
    params = {
      grant_type: 'password',
      client_id: 'ionic',
      client_secret: 'secret',
      scope: 'email',
      username: username,
      password: password
    };
    req = {
      method: 'POST',
      url: LOGIN_URL,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: this.$httpParamSerializer(params)
    };
    promise = this.$http(req).success((function(_this) {
      return function(response) {
        var configUpdater, deferred;
        deferred = _this.$q.defer();
        if (response.access_token != null) {
          configUpdater = function(config) {
            config.params = config.params || {};
            config.params.access_token = response.access_token;
            return config;
          };
          _this.localStorageService.set('accessToken', response.access_token);
          _this.authService.loginConfirmed(null, configUpdater);
          deferred.resolve(true);
        }
        return {
          "else": deferred.reject('login failed')
        };
      };
    })(this)).error(function(data, status) {
      console.log('add returned status:' + status);
    });
    return promise;
  };

  TodoApiService.prototype.logout = function() {
    return this.localStorageService.remove('accessToken');
  };

  TodoApiService.prototype.getAccessToken = function() {
    return this.localStorageService.get('accessToken');
  };

  TodoApiService.prototype.isLoggedIn = function() {
    return !!this.getAccessToken();
  };

  TodoApiService.prototype.findTodos = function() {
    var promise;
    console.log('TodoApiService.findTodos');
    promise = this.$http.get(this.API_ENDPOINT + '/todos', {}).error(function(data, status) {
      console.log('findTodos returned status:' + status);
    });
    return promise;
  };

  TodoApiService.prototype.findTodo = function(todo_id) {
    var promise;
    promise = this.$http.get(this.API_ENDPOINT + ("/todo/" + todo_id), {}).error(function(data, status) {
      console.log('findTodo returned status:' + status);
    });
    return promise;
  };

  TodoApiService.prototype.findCurrentUser = function() {
    var promise;
    promise = this.$http.get(this.API_ENDPOINT + "/users/self", {}).error(function(data, status) {
      console.log('findCurrentUser returned status:' + status);
    });
    return promise;
  };

  TodoApiService.prototype.add = function(todo) {
    var promise;
    promise = this.$http.post(this.API_ENDPOINT + "/todos", todo).error(function(data, status) {
      console.log('add returned status:' + status);
    });
    return promise;
  };

  TodoApiService.prototype.done = function(todo_id) {
    var promise;
    promise = this.$http.put(this.API_ENDPOINT + ("/todo/" + todo_id), {
      is_completed: true
    }).error(function(data, status) {
      console.log('done returned status:' + status);
    });
    return promise;
  };

  TodoApiService.prototype.remove = function(todo_id) {
    var promise;
    promise = this.$http["delete"](this.API_ENDPOINT + ("/todo/" + todo_id), {}).error(function(data, status) {
      console.log('done returned status:' + status);
    });
    return promise;
  };

  return TodoApiService;

})(BaseService);

angular.module('starter').service('TodoApiService', TodoApiService);
