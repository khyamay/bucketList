angular.module('bucketList.controllers', [])
	.controller('SignUpCtrl', ['$scope', '$rootScope', '$firebaseAuth', '$window', function ($scope, $rootScope, $firebaseAuth, $window){
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
	}])
	.controller('SignInCtrl', ['$scope', '$rootScope', 'firebaseAuth', '$window', function ($scope, $rootScope, $firebaseAuth, $window){
		$rootScope.checkSession();
		$scope.user = {
			email: '',
			password: ''
		};

		$scope.validateUser = function (){
			$rootScope.show('Please wait... Authenticating');
			var email = this.user.email;
			var password = this.user.password;
			if (!email || !password){
				$rootScope.notify('Please enter valid credentials');
				return false;
			}
			$rootScope.auth.$login('password', {
				email: email,
				password: password
			})
			.then(function (user){
				$rootScope.hide();
				$rootScope.userEmail = user.email;
				$window.location.href = ('#/bucket/list');
			}, function (error){
				$rootScope.hide();
				if (error.code == 'INVALID_EMAIL'){
					$rootScope.notify('Invalid Email Address');
				}
				else if (error.code == 'INVALID_PASSWORD'){
					$rootScope.notify('Invalid Password');
				}
				else if (error.code == 'INVALID_USER'){
					$rootScope.notify('Invalid User');
				}
				else {
					$rootScope.notify('Opps something went wrong. Please try it again later');
				}
			});
		}
	}])
	.controller('myListCtrl', function ($rootScope, $scope, $window, $ionicModal, $firebase){
		$rootScope.show('Please Wait... Processing');
		$scope.list = [];
		var bucketListRef = new Firebase($rootScope.baseUrl + escapeEmailAddress($rootScope.userEmail));
		bucketListRef.on('value', function (snapshot){
			var data = snapshot.val();
			$scope.list = [];

			for (var key in data){
				if (data.hasOwnProperty(key)){
					if (data[key].isCompleted == false){
						data[key].key = key;
						$scope.list.push(data[key]);
					}
				}
			}

			if ($scope.list.length == 0){
				$scope.noData = true;
			} else {
				$scope.noData = false;
			}
			$rootScope.hide();
		});

		$ionicModal.fromTemplateUrl('templates/newItem.html', function (modal){
			$scope.newTemplate = modal;
		});

		$scope.newTask = function (){
			$scope.newTempalte.show();
		};

		$scope.markCompleted = function (key){
			$rootScope.show('Please wait.. Updating list');
			var itemRef = new Firebase($rootScope.baseUrl + escapeEmailAddress($rootScope.userEmail)+ '/' + key);
			
			itemRef.update({
				isCompleted: true;
			}, function (error){
				if (error){
					$rootScope.hide();
					$rootScope.notify('Opps something went wrong. Try again');
				} else {
					$rootScope.hide();
					$rootScope.notify('Successfully Updated');
				}
			});
		};

		$scope.deleteItem = function (key){
			$rootScope.show('Please wait... Deleting from the list');
			var itemRef = new Firebase($rootScope.baseUrl + escapeEmailAddress($rootScope.userEmail));
			bucketListRef.child(key).remove(function (error){
				if (error){
					$rootScope.hide();
					$rootScope.notify('Opps Something went wrong. Try it again');
				} else {
					$rootScope.hide();
					$rootScope.notify('Successfully Deleted.');
				}
			})
		}

		function escapeEmailAddress(email){
			if (!email) return false
				email = email.toLowercase();
				email = email.replace(/\./g, ',');
				return email.trim();
		}
	});
