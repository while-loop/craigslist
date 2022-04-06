app.controller('SearchController', ['$scope', '$cookies', '$localStorage', '$http',
    function ($scope, $cookies, $localStorage, $http) {
        var URL = 'http://localhost/api.php?area=AREA&query=QUERY';

        if (window.performance) {
            if (performance.navigation.type == 1) {
                $localStorage.results = {};
                $localStorage.total = 0;
            }
        }

        if ($localStorage.hiddenResults === undefined) {
            $localStorage.hiddenResults = [];
        }
        $scope.results = $localStorage.results || {};
        setTimeout(function () {
            document.getElementsByTagName('md-content')[0].scrollTop = $localStorage.pos;
        }, 2000);

        $scope.searching = false;
        $scope.input = $cookies.get("areas") ? $cookies.get("areas") : "lakeland,miami,spacecoast";
        $scope.query = $cookies.get("query") ? $cookies.get("query") : "240sx";
        $scope.areas = $scope.input.split(',');
        $scope.hidden = {};
        $scope.total = $localStorage.total;

        for (var i = 0; i < $scope.areas.length; i++) {
            $scope.hidden[$scope.areas[i]] = false;
        }

        $scope.toggleArea = function (area) {
            $scope.hidden[area] = !$scope.hidden[area];
        };

        $scope.hideResult = function (area, obj) {
            var index = $scope.results[area].indexOf(obj);

            if (index > -1) {
                var scrollPos = document.getElementsByTagName('md-content')[0].scrollTop;
                $scope.results[area].splice(index, 1);
                $scope.total--;
                $localStorage.hiddenResults.push(obj["id"]);
                setTimeout(function () {
                    document.getElementsByTagName('md-content')[0].scrollTop = scrollPos;
                }, 50);
                $localStorage.$apply();
            }
        };

        // catch if the user is leaving the page to a different site
        window.onbeforeunload = function (e) {
            $localStorage.pos = document.getElementsByTagName('md-content')[0].scrollTop;
            $localStorage.total = $scope.total;
            $localStorage.$apply();
            return undefined;
        };

        $scope.changePic = function (obj, dir) {
            var url = document.getElementById(obj["id"]).style.backgroundImage;
            url = url.substring(url.indexOf('("') + 2, url.indexOf('")'));
            var idx = obj["pics"].indexOf(url);
            if (idx > -1) {
                document.getElementById(obj["id"]).style.backgroundImage = 'url("' + obj["pics"][(idx + dir).mod(obj["pics"].length)] + '")';
            }
        };

        $scope.search = function () {
            $cookies.put("areas", $scope.input);
            $cookies.put("query", $scope.query);
            $scope.total = 0;
            $scope.searching = true;
            $scope.areas = $scope.input.split(',');
            for (var i = 0; i < $scope.areas.length; i++) {
                $scope.areas[i] = trim11($scope.areas[i]);
                var area = $scope.areas[i];
                $scope.hidden[area] = true;
                var tmpUrl = URL.replace("AREA", area).replace("QUERY", $scope.query);
                $http.get(tmpUrl)
                    .then(function (response) {
                        var area = response.data['area'];
                        $scope.results[area] = response.data['results'].filter(function (obj) {
                            if ($localStorage.hiddenResults.indexOf(obj["id"]) == -1) {
                                return true;
                            } else {
                                console.log("Hidding ad... ID: " + obj["id"]);
                                return false;
                            }
                        });
                        $scope.total += $scope.results[area].length;
                        $scope.searching = false;
                        setTimeout(function () {
                            $scope.hidden[area] = false;
                            $scope.$apply();
                        }, 1);
                    });
            }
            $localStorage.results = $scope.results;
        };

        function trim11(str) {
            str = str.replace(/^\s+/, '');
            for (var i = str.length - 1; i >= 0; i--) {
                if (/\S/.test(str.charAt(i))) {
                    str = str.substring(0, i + 1);
                    break;
                }
            }
            return str;
        }

        Number.prototype.mod = function(n) {
            return ((this%n)+n)%n;
        };
    }
]);