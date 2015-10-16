angular.module('homeCtrl',[])
.controller('homeController',['$scope','$http', 'Article', 'filterFilter', function($scope, $http, Article, filterFilter) {
	$scope.home=true;
	$scope.$watch('search', function(term) {
	        Article.get()
				.success(function(data){
					$scope.listArticleAll=data;
                    $scope.listArticle = filterFilter(data, term);
                    console.log($scope.listArticle);
					$scope.currentPage = 1;
			        $scope.maxSize = 5;
			        $scope.entryLimit = 10;
				})
			    .error(function() {
			        console.log('error');
			    });
	    });
}]);