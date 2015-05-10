var angularTodo = angular.module('angularTodo', []);

angularTodo.controller ('mainController' , ['$scope', '$http', function($scope, $http){
	$scope.formData = {};

	$http.get('/tareas')
		.success(function (data){
			$scope.tareas = data;
		})
		.error (function(data){
			console.log("Recuperando lista de tareas. Error: " + data)
		});

	$scope.anadirTarea = function() {
		$http.post('/tareas', $scope.formData)
			.success(function(data){
				$scope.formData = {};
				$scope.tareas = data;
				console.log(data);
			})
			.error(function(data){
				console.log("Añadiendo tarea. Error " + data);
			});
	}

	$scope.eliminarTarea = function(id_tarea) {
			$http.delete('/tareas/' + id_tarea)
				.success(function(data){
					$scope.tareas = data;
					console.log(data);
				})
				.error(function(data){
					console.log("Eliminando tarea. Error " + data);
				});
	}

}]);