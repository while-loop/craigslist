var app = angular.module('StarterApp', ['ngRoute', 'ngMaterial', 'ngCookies', 'ngStorage']);

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        title: 'Craigslist Search',
        templateUrl: 'components/search/search.html',
        controller: 'SearchController'
    });

    $locationProvider.html5Mode(true)
});

app.config(function ($mdThemingProvider) {
    var customBlueMap = $mdThemingProvider.extendPalette('light-blue', {
        'contrastDefaultColor': 'light',
        'contrastDarkColors': ['50'],
        '50': 'ffffff'
    });
    $mdThemingProvider.definePalette('customBlue', customBlueMap);
    $mdThemingProvider.theme('default')
        .primaryPalette('customBlue', {
            'default': '500',
            'hue-1': '50'
        })
        .accentPalette('pink');
    $mdThemingProvider.theme('input', 'default')
        .primaryPalette('grey')
});

app.run(['$rootScope', '$route', function ($rootScope, $route) {
    $rootScope.$on('$routeChangeSuccess', function () {
        document.title = $route.current.title;
        $rootScope.title = $route.current.title;
    });
}]);