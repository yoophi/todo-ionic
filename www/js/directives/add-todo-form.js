'use strict';
var addTodoForm;

addTodoForm = function() {
  var directive, link;
  link = function($scope, $element, $attr) {
    return $scope.submit = function() {
      $scope.formAddTodo.$attempt = true;
      if ($scope.formAddTodo.$valid) {
        $scope.onSubmit({
          todo: $scope.todo
        });
      }
      return $scope.$on('modal.hidden', function() {
        $scope.todo = null;
        $scope.formAddTodo.$attempt = false;
        return $scope.formAddTodo.$setPristine(true);
      });
    };
  };
  directive = {
    restrict: 'E',
    scope: {
      onSubmit: '&'
    },
    link: link,
    templateUrl: 'templates/directives/add-todo-form.html'
  };
  return directive;
};

angular.module('starter').directive('addTodoForm', addTodoForm);
