angular.module('articleCtrl',[])
	.controller('articleController',['$scope', '$state', '$rootScope','$window', '$http','$location','$stateParams','flash', 'Article', 'Upload',
		function($scope, $state, $rootScope,$window, $http,$location,$stateParams,flash, Article, Upload) {
			/*Biến lưu trữ dữ liệu form*/
    		$rootScope.showUpload=true;
    		$rootScope.showImgUpload=true;
			$rootScope.articleData = {};
			//register user
			$scope.create = function() {
				$scope.Proccess=true;
				/*Kiểm tra dữ liệu rỗng*/
				if (!$.isEmptyObject($rootScope.articleData)) {
					Article.create($rootScope.articleData)
					.success(function(data){
						flash.success="Tạo bài viết thành công";
						$state.go("listArticle");
					})
					.error(function(){
						flash.error = 'Có lỗi trong quá trình thêm bài viết';
						$scope.Proccess = false;
						$state.go("createArticle");
					});
				}
			};
			// get all article
			Article.getOfUser()
				.success(function(data){
					$scope.listArticle=data;
					$scope.currentPage = 1;
			        $scope.maxSize = 5;
			        $scope.entryLimit = 10;
				})
			    .error(function() {
			        console.log('error');
			    });
		}
	])
	.controller('editArticleController',['$scope', '$state', '$rootScope','$window', '$http','$location','$stateParams','flash', 'Article', 'Upload',
		function($scope, $state, $rootScope,$window, $http,$location,$stateParams,flash, Article, Upload) {
			/*Biến lưu trữ dữ liệu form*/
    		$rootScope.showUpload=true;
    		$rootScope.showImgUpload=false;
			$rootScope.articleData = {};
			Article.getArticleDetail()
			    .success(function(data) {
			        $rootScope.articleData = data;
			        var arrayThumbnail = data.thumbnail.split('/');
			        $rootScope.imgUrl = arrayThumbnail[arrayThumbnail.length - 1];
			        $rootScope.articleData.thumbnail = $rootScope.imgUrl;
			    })
			    .error(function() {
			        console.log('error');
			    });
		    $scope.edit= function(){
	        	// check to make sure the form is completely valid
			    $scope.Proccess=true;
			    /*Kiểm tra dữ liệu rỗng*/
			    if (!$.isEmptyObject($scope.articleData)) {
			      Article.edit($scope.articleData)
			        .success(function(data){
			            $scope.articleData=data;
			            flash.success="Cập nhật thông tin thành công!";
			            $scope.Proccess = false;
			        })
			       .error(function(){
			          flash.error = 'Có lỗi trong quá trình thay đổi thông tin.';
			          $scope.Proccess = false;
			        });
			    }
			}
		}
	])
	.controller('detailArticleController',['$scope', '$state', '$rootScope','$window', '$http','$location','$stateParams','flash', 'Article', 'Upload', 'Comment',
		function($scope, $state, $rootScope,$window, $http,$location,$stateParams,flash, Article, Upload, Comment) {
			/*Biến lưu trữ dữ liệu form*/
			$scope.articleData = {};
			Article.getArticleDetail()
			    .success(function(data) {
			        $scope.articleData = data;
            		$scope.commentData.articleId=data._id;
			    })
			    .error(function() {
			        console.log('error');
			    });
			/*Biến lưu trữ dữ liệu form*/
			$rootScope.commentData = {};
			$scope.create = function() {
				$http.get('/loggedin').success(function(data){
					if(data==='0'){
	                    flash.error='Bạn cần đăng nhập để thực hiện hành động này !';
	                    $state.go('home.register_login');
	                }
	                else{
	                	$scope.Proccess=true;
						/*Kiểm tra dữ liệu rỗng*/
						if (!$.isEmptyObject($rootScope.commentData)) {
							Comment.create($rootScope.commentData)
								.success(function(data){
									flash.success="Comment thành công";
									$http.get('/api/getCommentArticle/list/:article_id')
										.success(function(data))
								})
								.error(function(){
									flash.error = 'Có lỗi trong quá trình comment';
									$scope.Proccess = false;
									$state.go("createComment");
								});
						}
	                }
				})
				
			};
			// get all comment of article
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
	.controller('articleCategoryController',['$scope', '$state', '$rootScope','$window', '$http','$location','$stateParams','flash', 'Article', 'Upload',
		function($scope, $state, $rootScope,$window, $http,$location,$stateParams,flash, Article, Upload) {
			// get all article of category
			Article.getArticleCategory()
				.success(function(data){
					$scope.listArticle=data;
					$scope.category_id=$stateParams.id
					$scope.currentPage = 1;
			        $scope.maxSize = 5;
			        $scope.entryLimit = 10;
				})
			    .error(function() {
			        console.log('error');
			    });
		}
	])
	.controller('articleTagController',['$scope', '$state', '$rootScope','$window', '$http','$location','$stateParams','flash', 'Article', 'Upload',
		function($scope, $state, $rootScope,$window, $http,$location,$stateParams,flash, Article, Upload) {
			// get all article of category
			$http.get('/api/skill/'+ $stateParams.id).success(function(data){
                Article.getArticleTag(data.name)
					.success(function(data){
						$scope.listArticle=data;
						$scope.skill_id=$stateParams.id
						$scope.currentPage = 1;
				        $scope.maxSize = 5;
				        $scope.entryLimit = 10;
					})
				    .error(function() {
				        console.log('error');
				    });
            });
			
		}
	])