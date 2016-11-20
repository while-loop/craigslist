app.controller('SearchController', ['$scope', '$http',
    function ($scope, $http) {
        var URL = 'http://AREA.craigslist.org/search/sss?sort=rel&query=QUERY';
        $scope.results = {};
        $scope.input = 'lakeland,miami,spacecoast';
        $scope.query = '240sx';
        $scope.cities = $scope.input.split(',');

        $scope.search = function () {
            $scope.cities = $scope.input.split(',');
            for (var i = 0, len = $scope.cities.length; i < len; i++) {
                var area = $scope.cities[i];
                var tmpUrl = URL.replace("AREA", area).replace("QUERY", $scope.query);
                $scope.results[area] = [];
                var parser = new DOMParser();
                $http.get(tmpUrl).then(function (response) {
                    var raw_html = response.data;
                    console.log(raw_html);
                });

                var result = {
                    url: tmpUrl,
                    title: '1995 Nissan 240sx',
                    description: 'Hi, I have a 1995 Nissan ...',
                    price: '$8500',
                    location: 'Melbourne',
                    pics: ['https://images.craigslist.org/00p0p_chsSJBpigLu_600x450.jpg',
                        'https://images.craigslist.org/00j0j_i0cZbYJTcYD_600x450.jpg,',
                        'https://images.craigslist.org/00303_cEUJsnllOnL_600x450.jpg']
                };
                $scope.results[area].push(result);
            }
        }
    }
]);