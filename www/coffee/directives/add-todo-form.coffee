'use strict';

addTodoForm = () ->
  link = ($scope, $element, $attr) ->
    $scope.submit = ->
      $scope.formAddTodo.$attempt = true

      if  $scope.formAddTodo.$valid
        $scope.onSubmit todo: $scope.todo

      $scope.$on 'modal.hidden', ->
        $scope.todo = null
        $scope.formAddTodo.$attempt = false
        $scope.formAddTodo.$setPristine true

  directive = {
    restrict: 'E'
    scope:
      onSubmit: '&'
    link: link
    templateUrl: 'templates/directives/add-todo-form.html'
  }

  return directive


angular.module('starter').directive('addTodoForm', addTodoForm)

