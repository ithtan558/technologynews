angular.module('homeCtrl',[])
.controller('homeController',['$scope','$http', 'Article', function($scope, $http, Article) {
	$scope.home=true;
}]);