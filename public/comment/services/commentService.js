angular.module('commentService', [])
    .factory('Comment',['$http','$stateParams', function($http,$stateParams) {
        return {
            create :function(commentData){
                return $http.post('/api/comment/create',commentData);
            },
            get: function(){
	            return $http.get('/api/comment/list');
	        },
            getCommentArticle: function(){
                return $http.get('/api/getCommentArticle/list/'+ $stateParams.id);
            },
            getCommentChildArticle: function(){
                return $http.get('/api/getCommentChildArticle/list/'+ $stateParams.id);
            },
            getOfUser: function(){
                return $http.get('/api/comment/getOfUser');
            },
            edit : function(commentData) {
                return $http.post('/api/comment/edit', commentData);
            },
        };
    }])