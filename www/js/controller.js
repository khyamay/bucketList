angular.module('bucketList.controllers', [])
	.controller('SingUpCtrl', ['$scope', '$rootScope', '$firebaseAuth', '$window', function ($scope, $rootScope, $firebaseAuth, $window){
		$scope.user = {
			email: "",
			password: ""
		};

		$scope.createUser = function (){
			var email = this.user.email;
			var password = this.user.password;
		};

		if (!email || !password){
			$rootScope.notify("Please enter valid credentials");
			return false;
		}

		$rootScope.show('Please wait.. Registering');
		$rootScope.auth.$createUser(email, password, function (error, user){
			if (!error){
				$rootScope.hide();
				$rootScope.userEmail = user.email;
				$window.location.href= ('#/bucket/list');
			}
			else {
				$rootScope.hide();
				if (error.code == 'INVALID_EMAIL'){	
					$rootScope.notify('Invalid Email Address');
				}
				else if (error.code == 'EMAIL_TAKEN') {
					$rootScope.notify('Email Address already taken');
				}
				else {
					$rootScope.notify('Opps something went wrong. Please try it again later');
				}
			}
		});
	}]);