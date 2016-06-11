class BaseController
  @inject: (args...) ->
    @$inject = args

  constructor: (args...) ->
    for key, index in @constructor.$inject
      this[key] = args[index]
    @scope = @$scope if @$scope?

    @initialize?.call(this)


class AppCtrl extends BaseController
  @inject '$scope', '$ionicModal', '$timeout'

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


class TodoCtrl extends BaseController
  @inject '$scope'

  initialize: ->
    @todo =
      title: 'hello world'
      id: 1
    return


class TodolistCtrl extends BaseController
  @inject '$scope'

  initialize: ->
    @todos = [
      {
        title: 'Reggae'
        id: 1
      }
      {
        title: 'Chill'
        id: 2
      }
      {
        title: 'Dubstep'
        id: 3
      }
      {
        title: 'Indie'
        id: 4
      }
      {
        title: 'Rap'
        id: 5
      }
      {
        title: 'Cowbell'
        id: 6
      }
    ]
    return


class AboutCtrl extends BaseController
  @inject '$scope', '$stateParams'


angular.module('starter.controllers', [])
.controller 'AppCtrl', AppCtrl
.controller 'TodolistCtrl', TodolistCtrl
.controller 'TodoCtrl', TodoCtrl
.controller 'AboutCtrl', AboutCtrl
