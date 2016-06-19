class BaseController
  @inject: (args...) ->
    @$inject = args

  constructor: (args...) ->
    for key, index in @constructor.$inject
      this[key] = args[index]
    @scope = @$scope if @$scope?

    for key, fn of @constructor.prototype
      console.log key
      continue if key in ['constructor', 'initialize'] or key[0] is '_'
      do (key) =>
        fn = fn.bind?(this) || _.bind(fn, this) if typeof fn is 'function'
        Object.defineProperty this, key,
          get: -> @scope[key]
          set: (v) -> @scope[key] = v
        @scope[key] = fn

    @initialize?.call(this)


class AppCtrl extends BaseController
  @inject '$scope', '$rootScope', '$ionicHistory', '$state', '$ionicModal', '$timeout', 'TodoApiService'

  initialize: ->
    # With the new view caching in Ionic, Controllers are only called
    # when they are recreated or on app start, instead of every page change.
    # To listen for when this page is active (for example, to refresh data),
    # listen for the $ionicView.enter event:
    #$scope.$on('$ionicView.enter', function(e) {
    #});

    # Form data for the login modal
    @$scope.loginData = {}

    # Create the login modal that we will use later
    @$ionicModal.fromTemplateUrl('templates/login.html', scope: @$scope).then (modal) =>
      @$scope.modal = modal
      return

    @$rootScope.$on('showLoginModal', =>
      @login()
    )
    @$rootScope.$on('event:auth-loginRequired', =>
      console.log 'callback for ', 'event:auth-loginRequired'
      success_cb = ->
        console.log 'success'

      error_cb = =>
        console.log 'error'
        @login()

      @TodoApiService.getAccessTokenWithRefreshToken(success_cb, error_cb)
    )

    return

  closeLogin: ->
    @$scope.modal.hide()
    return

  login: ->
    @$scope.modal.show()
    return

  doLogin: ->
    username = @$scope.loginData.username
    password = @$scope.loginData.password

    @TodoApiService.login(username, password)
      .success((response) =>
        console.log 'callback', response
        @$timeout (=>
          @$scope.closeLogin()
          return
        ), 1000
      )
      .error((result) ->
        alert result
      )
    return

  isLoggedIn: ->
    @TodoApiService.isLoggedIn()

  logout: ->
    @TodoApiService.logout()


class TodoCtrl extends BaseController
  @inject '$scope', '$stateParams', 'TodoApiService'

  initialize: ->
    todo_id = @$stateParams.todoId

    @TodoApiService.findTodo(todo_id).success((response) =>
      @todo = response
    )

#    @todo =
#      title: 'hello world'
#      id: 1
    return


class TodolistCtrl extends BaseController
  @inject '$scope', '$q', '$ionicModal', 'TodoApiService'

  initialize: ->
    @getTodos()

    @$ionicModal.fromTemplateUrl('templates/modals/add-todo.html', scope: @$scope).then (modal) =>
      @$scope.modalAddTodo = modal
      @$scope.hideModalAddTodo = @hideModalAddTodo
      return

    @$scope.addTodo = (todo) =>
      @TodoApiService.add(todo).then(=>
        @$scope.modalAddTodo.hide()
        @getTodos()
      )

  getTodos: ->
    deferred = @$q.defer()
    @TodoApiService.findTodos().success((response) =>
      @todos = response.todos
      deferred.resolve response.todos
    )

    return deferred.promise

  showModalAddTodo: ->
    @$scope.modalAddTodo.show()

  hideModalAddTodo: =>
    @$scope.modalAddTodo.hide()

  done: (todo_id) =>
    @TodoApiService.done(todo_id).then(=>
      console.log "TodoApiService callback"
      @getTodos()
    )

  remove: (todo_id) ->
    @TodoApiService.remove(todo_id).then(=>
      console.log "TodoApiService callback"
      @getTodos()
    )


class AccountCtrl extends BaseController
  @inject '$scope', 'TodoApiService'

  initialize: ->
    @TodoApiService.findCurrentUser().success((response) =>
      @user = response
    )


class AboutCtrl extends BaseController
  @inject '$scope', '$stateParams'


angular.module('starter.controllers', [])
.controller 'AppCtrl', AppCtrl
.controller 'TodolistCtrl', TodolistCtrl
.controller 'TodoCtrl', TodoCtrl
.controller 'AccountCtrl', AccountCtrl
.controller 'AboutCtrl', AboutCtrl
