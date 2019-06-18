console.log('%c Hacking is illigal!!! ', 'font-size: 40px; color: red');
// document.addEventListener('contextmenu', event => event.preventDefault());

var app = angular.module('mainApp', ['ngRoute']);


// Route Config

app.config(function($routeProvider, $locationProvider){

    $routeProvider
    .when('/', {
        templateUrl: 'frontend/template/welcome.html',
        controller: 'welcomeCtrl'
    })

    .when('/register', {
        templateUrl: 'frontend/template/register.html',
        controller: 'registerCtrl'
	})
	
	.when('/subject', {
		resolve: {
			check: function($location, user){
				if(!user.isLoggedIn()){
					$location.path('/');
				}
			}
		},
        templateUrl: 'frontend/template/subject.html',
        controller: 'subjectCtrl'
	})
	
	.when('/rules', {
		resolve: {
			check: function($location, user){
				if(!user.isLoggedIn()){
					$location.path('/');
				}
			}
		},
        templateUrl: 'frontend/template/rules.html',
        controller: 'rulesCtrl'
	})
	
	.when('/exam', {
		resolve: {
			check: function($location, user){
				if(!user.isLoggedIn()){
					$location.path('/');
				}
			}
		},
        templateUrl: 'frontend/template/exam.html',
        controller: 'examCtrl'
	})
	
	.when('/result', {
		resolve: {
			check: function($location, user){
				if(!user.isLoggedIn()){
					$location.path('/');
				}
			}
		},
        templateUrl: 'frontend/template/result.html',
        controller: 'resultCtrl'
	})
	
	.otherwise({
		template: '404 not found'
	})

	$locationProvider.html5Mode(true);

})


// service

app.service('user', function($http, $location, $timeout){

	var loggedIn = false;
	var name;
	var Id;
	var subject;
	var totalQuestion;
	var questionNumber = -1;
	var correctAnswered = 0;
	var totalAnswered = 0;
	var timeOut = false;

	this.serverBaseUrl = function(){
		return "http://localhost/mobotics/test2/backend/index.php/";
	}

	this.saveData = function(data){
		name = data.name;
		Id = data.id;
		localStorage.setItem('user', JSON.stringify({
            'name': name,
			'email': data.email,
			'id': Id
		}));
		loggedIn = true;
	}

	this.clearData = function(){
		localStorage.removeItem('user');
		localStorage.clear();
		loggedIn = false;
		name = '';
		Id = '';
	}

	this.isLoggedIn = function(){
		if(localStorage.getItem('user')){
			loggedIn = true;
			var data = JSON.parse(localStorage.getItem('user'));
            name = data.name;
            Id = data.id;
		}
		return loggedIn;
	}

	this.getID = function(){
		return Id;
	}

	this.setSubject = function(sub){
		subject = sub;
	}

	this.getSubject = function(){
		return subject;
	}

	this.setTotalQuestion = function (num) {
		totalQuestion = num;
	  }
	
	this.getTotalQuestion = function () {
		return totalQuestion;
	}

	this.getQuestionNumber = function () {
		if (questionNumber < totalQuestion - 1) {
		  questionNumber++;
		  return questionNumber;
		} else {
		  return false;
		}
	}

	this.correctAnswered = function () {
		correctAnswered++;
	}
	
	this.answered = function () {
		totalAnswered++;
	}

	this.getCorrectAnswered = function () {
		return correctAnswered;
	}
	
	this.getTotalAnswered = function () {
		return totalAnswered;
	}

	this.timer = function($scope){
		if(timeOut === false){
			$scope.counter = 3600;
			$scope.onTimeout = function(){
			if ($scope.counter > 0){
				$scope.counter--;
				mytimeout = $timeout($scope.onTimeout,1000);
			}else{
				timeOut = true;
				$location.path('/result');
			}
				
			}
			var mytimeout = $timeout($scope.onTimeout,1000);
		}
		
	}

	this.question = function($scope){
		var num = this.getQuestionNumber();
		if(num === false){
			console.log("exam end");
			this.timer($scope, false);
			$location.path('/result');

		}else{
			$http({
				url: this.serverBaseUrl()+'exam/get_question',
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data: 'id='+this.getID()+'&sub='+this.getSubject()+'&num='+num
			}).then(function(response){
				if(response.data == 'CSRF'){
					alert('CSRF maybe!!!');
				}else{
					$scope.question = response.data.question;
					$scope.op = [response.data.op1, response.data.op2, response.data.op3, response.data.op4];
					$scope.ans = response.data.ans;
				}
			})
		}
	}

});



// controllers

// welcomeCtrl

app.controller('welcomeCtrl', function($scope, $location){

    $scope.goToRegister = function(){
        $location.path('/register');
    }

});


// registerCtrl

app.controller('registerCtrl', function($scope, $location, $http, user){

    $scope.options = {
        'onsuccess': function(googleUser) {
          var profile = googleUser.getBasicProfile();
          $http({
			url: user.serverBaseUrl()+'register',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'name='+profile.getName()+'&email='+profile.getEmail()
          }).then(function(response){
			  user.saveData(response.data);
			  $location.path('/subject');
		  })
        },
        'theme': 'dark',
        'longtitle': true,
        'height': 50,
        'width': 280
      }

});


// subjectCtrl

app.controller('subjectCtrl', function($scope, $location, $http, user){

	$http({
		url: user.serverBaseUrl()+'exam',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		data: 'id='+user.getID()
	}).then(function(response){
		if(response.data == 'CSRF'){
			alert('CSRF maybe!!!');
		}else{
			$scope.subjects = response.data;
		}
	})

	$scope.sub_choise = function(sub){
		user.setSubject(sub);
		$location.path('/rules');
	}

});



// rulesCtrl

app.controller('rulesCtrl', function($scope, $location, $http, user){

	$scope.subject = user.getSubject();
	$http({
		url: user.serverBaseUrl()+'exam/total_question',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		data: 'id='+user.getID()+'&sub='+user.getSubject()
	}).then(function(response){
		if(response.data == 'CSRF'){
			alert('CSRF maybe!!!');
		}else{
			user.setTotalQuestion(response.data);
		}
	})
	
	$scope.startExam = function(){
		$location.path('/exam');
	}

});



// examCtrl

app.controller('examCtrl', function($scope, $location,  user){

	$scope.subject = user.getSubject();
	$scope.total_question = user.getTotalQuestion();
	$scope.correct_answered = user.getCorrectAnswered();
	$scope.total_answered = user.getTotalAnswered();

	user.question($scope);
	user.timer($scope);

	$scope.submitAnswer = function () {
		user.answered();
		if ($scope.option == $scope.ans) {
		  console.log("right");
		  user.correctAnswered();
		  user.question($scope);
		} else {
		  console.log("wrong");
		  user.question($scope);
		}
	
		$scope.correct_answered = user.getCorrectAnswered();
		$scope.total_answered = user.getTotalAnswered();
	}

    
	
	

});


// resultCtrl

app.controller('resultCtrl', function($scope, $location, $http, user){

	user.clearData();
	$scope.total = user.getTotalAnswered();
	$scope.correct = user.getCorrectAnswered();
	

});




// google sign in directive

app.directive('googleSignInButton', function() {
    return {
      scope: {
        buttonId: '@',
        options: '&'
      },
      template: '<div></div>',
      link: function(scope, element, attrs) {
        var div = element.find('div')[0];
        div.id = attrs.buttonId;
        gapi.signin2.render(div.id, scope.options()); //render a google button, first argument is an id, second options
      }
    };
  });




app.filter('secondsToDateTime', [function() {
	return function(seconds) {
    	return new Date(1970, 0, 1).setSeconds(seconds);
    };
}])