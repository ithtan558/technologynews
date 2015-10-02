angular.module('commentCtrl',[])
	.controller('commentArticleController',['$scope', '$state', '$rootScope','$window', '$http','$location','$stateParams','flash', 'Comment', 'Upload',
		function($scope, $state, $rootScope,$window, $http,$location,$stateParams,flash, Comment, Upload) {
			// get all comment
			Comment.getCommentArticle()
				.success(function(data){
					$scope.listComment=data;
					$scope.currentPage = 1;
			        $scope.maxSize = 5;
			        $scope.entryLimit = 10;
				})
			    .error(function() {
			        console.log('error');
			    });
		}
	])