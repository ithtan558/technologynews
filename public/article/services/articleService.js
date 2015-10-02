angular.module('articleService', [])
    .factory('Article',['$http','$stateParams', function($http,$stateParams) {
        return {
            create :function(articleData){
                return $http.post('/api/article/create',articleData);
            },
            get: function(){
	            return $http.get('/api/article/list');
	        },
            getArticleCategory: function(){
                return $http.get('/api/getArticleCategory/list/'+ $stateParams.id);
            },
            getArticleTag: function(name){
                return $http.get('/api/getArticleTag/list/'+ name);
            },
            getOfUser: function(){
                return $http.get('/api/article/getOfUser');
            },
            getArticleDetail: function(){
                return $http.get('api/article/'+ $stateParams.id);
            },
            edit : function(articleData) {
                return $http.post('/api/article/edit', articleData);
            },
        };
    }])