angular.module('appRoutes',['ui.router', 'angularUtils.directives.uiBreadcrumbs']).config(['$stateProvider', '$urlRouterProvider','$locationProvider', '$ocLazyLoadProvider',
 function($stateProvider, $urlRouterProvider,$locationProvider, $ocLazyLoadProvider){
 /*Điều hướng 404*/
	$urlRouterProvider.otherwise("/404");
	$urlRouterProvider.when('/_=_', '/');
	/*Thiết lập các state*/
	$stateProvider
		.state('home', {
			url: "/",
			views: {
				'main@': {
					templateUrl: "home/index",
					controller: 'homeController',
				}
			},
			data: {
				displayName: 'Home',
			}
		})
		.state('home.register_login', {
			url: "register-login",
			views: {
				'main@': {
					templateUrl: "user/register_login",
					controller: 'userController'
				}
			},
			title: 'Register - Login',
	        data: {
				displayName: 'Register - Login'
			}
		})
		.state('profile', {
	        url: "/profile/:id",
			views: {
				'main@': {
	        		templateUrl : "user/profile",
	        		controller :'userProfileController'
				}
			},
	        title: 'Profile',
	        access: { requiredLogin: true }
	    })
	    .state('editProfile', {
	        url: "/editProfile/:id",
			views: {
				'main@': {
	        		templateUrl : "user/editProfile",
	        		controller :'editUserController'
				}
			},
	        title: 'Profile',
	        access: { requiredLogin: true }
	    })
	    /* Article */
	    .state('createArticle', {
	    	url: "/create-article",
			views: {
				'main@': {
	        		templateUrl : "articles/createArticle",
	        		controller :'articleController'
				}
			},
	        title: 'Create article',
	        access: { requiredLogin: true }
	    })
	    .state('listArticle', {
	    	url: "/list-article",
			views: {
				'main@': {
	        		templateUrl : "articles/listArticle",
	        		controller :'articleController'
				}
			},
	        title: 'List article',
	        access: { requiredLogin: true }
	    })
	    .state('article-edit',{
	        url: "/article/edit/:id",
			views: {
				'main@': {
	        		templateUrl : 'articles/editArticle',
	        		controller :'editArticleController'
				}
			},
	        title: 'Edit article',
	        access: { requiredLogin: true }
	    })
	    .state('home.articleDetail',{
	        url: "detail-article/:id",
	        views: {
				'main@': {
				  	templateUrl : 'articles/detailArticle',
	        		controller :'detailArticleController'
				}
			},
	        title: 'Detail article',
	        data: {
				displayName: '{{title}}'
			},
			resolve: {
		        title: function($stateParams, articleService) {
		          return articleService.getTitleArticle($stateParams.id);
		        }
		    }
	    })
	    .state('home.articleCategory',{
	        url: "article-category/:slug/:id",
	        views: {
				'main@': {
				  	templateUrl : 'home/index',
	        		controller :'articleCategoryController'
				}
			},
	        title: 'Article category',
	        data: {
				displayName: '{{title}}'
			},
			resolve: {
		        title: function($stateParams, articleService) {
		          return articleService.getNameCategory($stateParams.id);
		        }
		    }
	    })
	    .state('home.articleTag',{
	        url: "article-tag/:slug/:id",
	        views: {
				'main@': {
				  	templateUrl : 'home/index',
	        		controller :'articleTagController'
				}
			},
	        title: 'Article tag',
	        data: {
				displayName: '{{title}}'
			},
			resolve: {
		        title: function($stateParams, articleService) {
		          return articleService.getNameTag($stateParams.id);
		        }
		    }
	    })
	    .state('chat',{
	        url: "/chat",
			views: {
				'main@': {
	        		templateUrl : 'chat/index',
	        		controller :'chatController'
				}
			},
			resolve: {
                loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load('/chat/controllers/chatCtrl.js');
                }]
            },
	        title: 'Chatting',
	        access: { requiredLogin: true }
	    })

	    /* End article */
	/*===============404 NOT FOUND================*/
	.state('404', {
		url: "/404",
		templateUrl : '404',
				title: '404 - Không tìm thấy trang yêu cầu'
	});
	$locationProvider.html5Mode({
		enabled: true,
		requireBase: true
	});
	$locationProvider.hashPrefix('!');
}]);
