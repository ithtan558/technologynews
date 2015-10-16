angular.module('mainCtrl',[])
.controller('mainController',['$scope','$cookieStore','$window','$state', '$location','$http','$rootScope','flash','AuthenticationService', 'Upload', 'Article',
	function($scope,$cookieStore,$window,$state, $location,$http,$rootScope,flash,AuthenticationService, Upload, Article) {
		$scope.$on('$viewContentLoaded', function (){
			/*Dùng cho nút ghi nhớ mật khẩu*/
			$("a.your-remember").click(function(event) {
				event.preventDefault();
				if (!$(this).hasClass('clicked')) {
					$(this).addClass('clicked');
					$("input#remember").val(1);
				} else {
					$(this).removeClass('clicked');
					$("input#remember").val(0);
				}
			});
		});

		/*Lấy thông tin đăng nhập nếu đăng nhập success*/
		$http.get('/loggedin').success(function(data){
			if(data!=="0" && data.status==1){
				$cookieStore.put('currentUser',data);
				$rootScope.currentUser=$cookieStore.get('currentUser');
				AuthenticationService.isLogged = true;
				$window.sessionStorage.token = '1';
			}
			else{
				$rootScope.currentUser=null;
			}
		});
		/*Datepicker angularjs*/
		$scope.today = function() {
			$scope.dt = new Date();
		};
		$scope.today();

		$scope.clear = function () {
			$scope.dt = null;
		};

		$scope.open = function($event) {
			$scope.status.opened = true;
		};

		$scope.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};

		$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		$scope.format = $scope.formats[1];

		$scope.status = {
			opened: false
		};
		//ngTagsInput
		$scope.loadCountries = function($query) {
			return $http.get('api/skill/getSkills', {
				cache: true
			}).then(function(response) {
				var countries = response.data;
				return countries.filter(function(country) {
						return country.name.toLowerCase().indexOf($query.toLowerCase()) != -1;
				});
			});
		};
		//list all category
		$http.get('/api/category/list').success(function(data){
			$scope.listCategory=data;
		});
		//list all skills
		$http.get('/api/skill/getSkills').success(function(data){
			$scope.listSkills=data;
		});
		// get all article
		//upload images article
		$scope.uploadThumnail = function($files) {
			/*$files: an array of files selected, each file has name, size, and type.*/
			for (var i = 0; i < $files.length; i++) {
				var file = $files[i];
				if(file.size>1200000){
					$scope.showAlert=true;
				}
				else {
					$scope.showAlert=false;
					Upload.upload({
						url: 'api/article/upload/thumbnail',
						method: 'POST',
						withCredentials: true,
						file: file,
					}).progress(function(evt) {
							$scope.uploadper=parseInt(100.0 * evt.loaded / evt.total);
					}).success(function(data, status, headers, config) {
							/*file is uploaded successfully*/
							$scope.imgUrl=data;
							$scope.showImgUpload=false;
							$scope.showUpload=true;
							$scope.articleData.thumbnail=data;
					});
				}
			}
		}
}])