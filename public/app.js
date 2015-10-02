
var app = angular.module('mean', [
 'ui.router',
 'ngCookies',
 'ngSanitize',
 'ngResource',
 'ngSanitize',
 'ngProgress',
 'ngAnimate',
 'ngFileUpload',
 'ngTagsInput',
 'angular-flash.service',
 'angular-flash.flash-alert-directive',
 'ui.bootstrap',
 'textAngular',
 'appRoutes',
 'appServices',
 'appFilters',
 'appModal',
 'mainCtrl',
 'homeCtrl',
 'userCtrl',
 'userService',
 'articleCtrl',
 'articleService',
 'commentCtrl',
 'commentService'
]);
/*Cấu hình thông báo lỗi*/
app.config(['flashProvider', function (flashProvider) {

	flashProvider.errorClassnames.push('alert-danger');
	flashProvider.warnClassnames.push('alert-warning');
	flashProvider.infoClassnames.push('alert-info');
	flashProvider.successClassnames.push('alert-success');

}]);
app.directive('flexslider', function () {
	return {
		link: function (scope, element, attrs) {
			element.flexslider({
				animation: "slide"
			});
		}
	}
});
/* Run the first*/
app.run(['$rootScope', 'ngProgressFactory', '$timeout', '$window', '$state', 'AuthenticationService', 'flash',
	function($rootScope, ngProgressFactory, $timeout, $window, $state, AuthenticationService, flash) {

	$rootScope.show = false;

	$rootScope.progressbar = ngProgressFactory.createInstance();

	$rootScope.color = 'firebrick';
	$rootScope.height = '3px';

	$rootScope.progressbar.start();
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
		$rootScope.currentState=toState.name;
		$rootScope.currentParam=toParams;
		$rootScope.oldState=fromState.name;
		$rootScope.oldParam = fromParams;
		if (toState.title) {
            $rootScope.pageTitle = toState.title + ' | Share knowledge';
        }
        else{
            $rootScope.pageTitle="Express - share knowledge";
        }
        /*Xác thực quyền thành viên khi truy cập vào trang cần đăng nhập*/
        if(toState.access){
	        if (toState.access.requiredLogin){
	        	if(!$window.sessionStorage.token){
				/*Nếu người dùng chưa đăng nhập*/
					flash.error="Bạn cần đăng nhập để truy cập vào khu vực này!";
					$state.transitionTo("home.register_login");
					event.preventDefault();
				}
	        }
	    }
    });
	$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        /*Thực thi xử lý sau khi state thay đổi thành công*/
        $timeout(function(){
			$rootScope.progressbar.complete();
			$rootScope.show = true;
		});
    });

	$rootScope.setWidth = function(new_width, $event) {
		$rootScope.progressbar.set(new_width);
		$event.preventDefault();
	}

	$rootScope.startProgress = function($event) {
		$event.preventDefault();
		$rootScope.progressbar.start();
	}

	$rootScope.increment = function($event) {
		$event.preventDefault();
		$rootScope.progressbar.set($rootScope.progressbar.status() + 9);
	}

	$rootScope.new_color = function($event, color) {
		$event.preventDefault();
		$rootScope.progressbar.setColor(color);
	}

	$rootScope.new_height = function($event, new_height) {
		$event.preventDefault();
		$rootScope.progressbar.setHeight(new_height);
	}

	$rootScope.completeProgress = function($event) {
		$event.preventDefault();
		$rootScope.progressbar.complete();
	}

	$rootScope.stopProgress = function($event) {
		$event.preventDefault();
		$rootScope.progressbar.stop();
	}

	$rootScope.resetProgress = function($event) {
		$rootScope.progressbar.reset();
		$event.preventDefault();
	}

	$rootScope.start_contained = function($event) {
		$rootScope.contained_progressbar.start();
		$event.preventDefault();
	}

	$rootScope.complete_contained = function($event) {
		$rootScope.contained_progressbar.complete();
		$event.preventDefault();
	}

	$rootScope.reset_contained = function($event) {
		$rootScope.contained_progressbar.reset();
		$event.preventDefault();
	}
}]);
