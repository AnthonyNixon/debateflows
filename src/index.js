angular.module('debateflowsapp', ['ngMaterial', 'ngRoute'])

    .config(['$mdThemingProvider', '$routeProvider', '$locationProvider', function ($mdThemingProvider, $routeProvider, $locationProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('amber');

        $routeProvider
            .when('/', {
                templateUrl: template("home")
            })
            .when('/login', {
                templateUrl: template('login')
            });

        function template(page) {
            return 'src/views/' + page + '.html';
        }

        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
    }])
    .run( function($rootScope, $location) {
        console.log('hi');
        // $rootScope.loggedUser = "ajn0592@gmail.com";
        // register listener to watch route changes
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            console.log('changing route');
            if ($rootScope.loggedUser === null || $rootScope.loggedUser === undefined) {
                console.log('user not logged in');
                $location.path('login');
            }
        });
    })
    // Set up routeCtrl to act as the controller for route operations
    .controller('rootCtrl', ['$scope', '$location', '$window', '$http', '$rootScope',
        function ($scope, $location, $window, $http, $rootScope) {
            $rootScope.goto = gotoInternal;
            $rootScope.gotoExternal = gotoExternal;
            // function to go to an internal link
            // takes in a link variable
            // redirects the page to an internal link
            function gotoInternal(link) {
                console.log('goto ' + link);
                $location.path(link);
            }

            // function to go to an external link
            // takes in a link variable
            // redirects the page to the external link
            function gotoExternal(link) {
                $window.open(link);
            }

        }])

    .controller('loginCtrl', function($scope) {
        $scope.email = "";
        $scope.password = "";

        $scope.login = function () {

            console.log("logging in user with email address: ", $scope.email);
            $scope.passwordHash = CryptoJS.HmacSHA512($scope.password);
            console.log($scope.passwordHash);
        }
    })

    .controller('searchCtrl', ['$scope', '$http',
        function ($scope, $http) {
            $scope.releaseName = "";
            $scope.letter = "";
            $scope.currentlyUpdating = false;
            $scope.alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
            $scope.selectLetter = selectLetter;

            $scope.updateReleaseName = function() {
                getReleaseName($scope.letter);
            };

            function getReleaseName(letter) {
                $scope.currentlyUpdating = true;
                $http.get("https://us-central1-releasegenerator.cloudfunctions.net/generaterelease?letter=" + letter + "&numReleases=10")
                    .then(function(response){
                        $scope.releases = response.data;
                        $scope.currentlyUpdating = false;
                    });
            }

            function selectLetter(letter) {
                $scope.letter = letter;
                getReleaseName($scope.letter);
            }

        }]);
