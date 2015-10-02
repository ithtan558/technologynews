angular.module('appServices', [])
.service('DataAccess',['$http', '$q', function($http, $q) {
    var files = {};
    this.loadTag = function(name) {
        $http.get('/api/tag').success(function(data) {
            files[name]  = data.map(function(item) {
                return item.tagName;
            });
        });
    };
    this.searchTag = function(name, query) {
        var items, deferred = $q.defer();
        items = _.chain(files[name])
            .filter(function(x) { return x.toLowerCase().indexOf(query.toLowerCase()) > -1; })
            .take(10)
            .value();
        deferred.resolve(items);
        return deferred.promise;
    };
}])
.service('appAlert',['$modal','$http', function($modal,$http) {
    this.alert=function(data,callback) {
        /*begin modal*/
        var modalInstance = $modal.open({
            templateUrl: '/views/modal/alert.html',
            controller: 'modal.alert',
            backdrop:'static',
            /*scope:$scope,*/
            resolve: {
                data: function () {
                    return data;
                }
            }
        });
        modalInstance.result.then(function () {
        }, function () {
        });
        /*end modal*/
    };
    this.confirm=function(data,callback) {
        /*begin modal*/
        var modalInstance = $modal.open({
            templateUrl: '/views/modal/confirm.html',
            controller: 'modal.confirm',
            backdrop:'static',
            /*scope:$scope,*/
            resolve: {
                data: function () {
                    return data;
                }
            }
        });
        modalInstance.result.then(function () {
            return callback(true);
        }, function () {
            return callback(false);
        });
        /*end modal*/
    };
    this.report=function(data,callback) {
        /*begin modal*/
        var modalInstance = $modal.open({
            templateUrl: '/views/modal/report.html',
            controller: 'modal.report',
            backdrop:'static',
            /*scope:$scope,*/
            resolve: {
                data: function () {
                    return data;
                }
            }
        });
        modalInstance.result.then(function () {
            return callback(true);
        }, function () {
            return callback(false);
        });
        /*end modal*/
    };
}])
/**
 * A fake service designed to simulate an asynchronous call to a server for data.
 */
.service('articleService', function($q, $timeout,$http) {
	this.getTitleArticle = function(id) {
		var deferred = $q.defer();
		var userId = parseInt(id, 10);
		$timeout(function() {
			$http.get('/api/article/'+ id).success(function(data){
				deferred.resolve(data.title);
			});
		}, 10);
		return deferred.promise;
	}

    this.getNameCategory = function(id) {
        var deferred = $q.defer();
        var userId = parseInt(id, 10);
        $timeout(function() {
            $http.get('/api/category/'+ id).success(function(data){
                deferred.resolve(data.name);
            });
        }, 10);
        return deferred.promise;
    }

    this.getNameTag = function(id) {
        var deferred = $q.defer();
        var userId = parseInt(id, 10);
        $timeout(function() {
            $http.get('/api/skill/'+ id).success(function(data){
                deferred.resolve(data.name);
            });
        }, 10);
        return deferred.promise;
    }

});