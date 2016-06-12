class BaseController
  @inject: (args...) ->
    @$inject = args

  constructor: (args...) ->
    for key, index in @constructor.$inject
      this[key] = args[index]
    @scope = @$scope if @$scope?

    @initialize?.call(this)


class AppCtrl extends BaseController
  @inject '$scope', '$ionicHistory', '$state', '$ionicModal', '$timeout', 'TodoApiService'

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

    # Triggered in the login modal to close it
    @$scope.closeLogin = =>
      @$scope.modal.hide()
      return

    # Open the login modal
    @$scope.login = =>
      @$scope.modal.show()
      return

    # Perform the login action when the user submits the login form
    @$scope.doLogin = =>
      console.log 'Doing login', @$scope.loginData
      # Simulate a login delay. Remove this and replace with your login
      # code if using a login system
      @$timeout (=>
        @$scope.closeLogin()
        return
      ), 1000
      return

    return

  login: ->
#    alert 'login()'
    @TodoApiService.login()

  logout: ->
    @TodoApiService.logout()
    @$ionicHistory.nextViewOptions disableBack: true
    @$state.go 'app.about'

  isLoggedIn: ->
    @TodoApiService.isLoggedIn()


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
  @inject '$scope', 'TodoApiService'

  initialize: ->
    @TodoApiService.findTodos().success((response) =>
      @todos = response.todos
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
