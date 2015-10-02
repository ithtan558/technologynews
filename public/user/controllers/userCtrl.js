angular.module('userCtrl',[])
	.controller('userController',['$scope', '$state', '$rootScope','$cookieStore','$window', '$http','$location','$stateParams','flash', 'User','AuthenticationService',
		function($scope, $state, $rootScope,$cookieStore,$window, $http,$location,$stateParams,flash, User,AuthenticationService) {
		/*Biến lưu trữ dữ liệu form*/
			$scope.userData = {};
			$scope.userDataRegister = {};
			$scope.userDataLogin = {};
			//register user
			$scope.register = function() {
				$scope.Proccess=true;
				/*Kiểm tra dữ liệu rỗng*/
				if (!$.isEmptyObject($scope.userDataRegister)) {
					User.register($scope.userDataRegister)
					.success(function(data){
						flash.success="Đăng ký thành công. Hãy kiểm tra email của bạn để kích hoạt tài khoản!";
						$state.go("home");
					})
					.error(function(){
						flash.error = 'Email này đã được sử dụng, hãy chọn email khác.';
						$scope.Proccess = false;
						$state.go("register_login");
					});
				}
			};
			//logout user
			$scope.logout = function(){
                User.logout()
                .success(function(){
                    $rootScope.currentUser=null;
                    $cookieStore.remove('currentUser');
                    if (AuthenticationService.isLogged) {
                        AuthenticationService.isLogged = false;
                        delete $window.sessionStorage.token;
                      }
                    flash.success="Đăng xuất thành công!";
                    $state.go("home");
                });
        	};
        	//login user
			$scope.login = function() {
				$scope.Proccess=true;
				/*Kiểm tra dữ liệu rỗng*/
				if (!$.isEmptyObject($scope.userDataLogin)) {
					$rootScope.successMsg='';

					User.getUserbyEmail($scope.userDataLogin)
					.success(function(u){
						if(u.length>0){
							if(u[0].status===0){
								flash.error = 'Tài khoản chưa được kích hoạt, vui lòng kiểm tra email và kích hoạt tài khoản!';
								$scope.Proccess = false;
								$state.go("register_login");
							}
							else{
								User.login($scope.userDataLogin)
								.success(function(data){
									$cookieStore.put('currentUser',data);
									$rootScope.currentUser=$cookieStore.get('currentUser');
									AuthenticationService.isLogged = true;
									$window.sessionStorage.token = data.token;
									flash.success="Chào mừng bạn quay lại!";
									if($rootScope.oldState!==''&& $rootScope.oldState!=='active_account'){
										if($rootScope.oldParam.id!==null){
											$state.go($rootScope.oldState,{id: $rootScope.oldParam.id });
										}
										else{
											$state.go($rootScope.oldState);
										}
	                                }
								})
								.error(function(){
									flash.error = 'Email hoặc mật khẩu không chính xác.';
									$scope.Proccess = false;
									$state.go("login");
								});
							}
						}
						else
						{
							flash.error = 'Email hoặc mật khẩu không chính xác.';
							$scope.Proccess = false;
							$state.go("login");
						}

					});
				}
			}
		}
	])
	.controller('userProfileController',['$scope', '$state', '$rootScope','$cookieStore','$window', '$http','$location','$stateParams','flash', 'User','AuthenticationService',
		function($scope, $state, $rootScope,$cookieStore,$window, $http,$location,$stateParams,flash, User,AuthenticationService) {
			//profile
			$scope.userInfo = [];
			User.getUserDetail()
			    .success(function(data) {
			        $scope.userInfo = data;
			        $scope.skills = data.skills;
			    })
			    .error(function() {
			        console.log('error');
			    });
		}
	])
	.controller('editUserController',['$scope', '$modal', '$state', '$rootScope','$cookieStore','$window', '$http','$location','$stateParams','flash', 'User','AuthenticationService',
		function($scope, $modal, $state, $rootScope,$cookieStore,$window, $http,$location,$stateParams,flash, User,AuthenticationService) {
	        User.getUserDetail()
	            .success(function(data) {
	                $scope.userAvatar = data.avatar;
	                $scope.formData = data;
	            })
	            .error(function() {
	                console.log('error');
	            });
	        $scope.uploadImage = function() {
	            //begin modal
	            var modalInstance = $modal.open({
	                templateUrl: 'modal/upload_image',
	                controller: 'modal.uploadImage',
	                resolve: {
	                    /*Không đưa vào modal dữ liệu gì hết nên trong controller chi có 2 service
	                    items: function () {
	                     return $scope.items;
	                    }*/
	                }
	            });
	            modalInstance.result.then(function(dataFromOkModal) {
	                $scope.newAvatar = dataFromOkModal;
	                $http.get('api/user/edit/avatar/' + dataFromOkModal)
	                    .success(function(data) {
	                        $scope.userAvatar = data.avatar;
	                    })
	                    .error(function() {
	                        console.log('error');
	                    });
	                console.log(dataFromOkModal);
	            },
	            function(dataFromDissmissModal) {
	                console.log(dataFromDissmissModal);
	            });
	            /*end modal*/
	        }
	        $scope.updateUser= function(){
	        	// check to make sure the form is completely valid
			    $scope.Proccess=true;
			    /*Kiểm tra dữ liệu rỗng*/
			    if (!$.isEmptyObject($scope.formData)) {
			      User.edit($scope.formData)
			        .success(function(data){
			            $scope.formData=data;
			            flash.success="Cập nhật thông tin thành công!";
			            $scope.Proccess = false;
			        })
			       .error(function(){
			          flash.error = 'Có lỗi trong quá trình thay đổi thông tin.';
			          $scope.Proccess = false;
			        });
			    }
			  };
			  $scope.changePassword = function(){
			    $scope.Proccess=true;
			    if(!$.isEmptyObject($scope.formData)){
			      User.changePassword($scope.formData)
			        .success(function(data){
			          $scope.formData={};
			          /*$scope.form.$setPristine();*/
			          flash.success="Đổi mật khẩu thành công!";
			          $scope.Proccess = false;
			        })
			        .error(function(){
			          flash.error="Mật khẩu hiện tại không chính xác, vui lòng kiểm tra lại!";
			          $scope.Proccess = false;
			        });
			    }
			  };
			  $scope.updatePermission = function(){
			    $scope.Proccess=true;
			    if(!$.isEmptyObject($scope.formData)){
			      User.updatePermission($scope.formData)
			      .success(function(data){
			          $scope.formData={};
			          /*$scope.form.$setPristine();*/
			          flash.success="Cập nhật quyền hạn cho thành viên thành công!";
			          $scope.Proccess = false;
			          $state.go("system-user");
			        })
			        .error(function(){
			          flash.error="Có lỗi trong quá trình xử lý. Vui lòng thử lại sau!";
			          $scope.Proccess = false;
			        });
			    }
			  };
	    }
	]);