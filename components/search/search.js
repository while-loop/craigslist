app.controller('SearchController', ['$scope', '$cookies', 'myCache',
    function ($scope, $cookies, myCache) {
        var URL = 'http://AREA.craigslist.org/search/sss?sort=rel&query=QUERY';
        var IMAGE_URL = 'https://images.craigslist.org/IMAGE_ID_300x300.jpg';

        $scope.results = {};
        var cache = myCache.get('myData');
        if (cache) { // If there’s something in the cache, use it!
            $scope.results = cache;
        }
        $scope.input = $cookies.get("areas") ? $cookies.get("areas") : "lakeland,miami,spacecoast";
        $scope.query = $cookies.get("query") ? $cookies.get("query") : "240sx";
        $scope.areas = $scope.input.split(',');
        $scope.total = 0;

        $scope.hide = function (id) {
            console.log("Id: " + id);
        };
        $scope.search = function () {
            $cookies.put("areas", $scope.input);
            $cookies.put("query", $scope.query);
            $scope.total = 0;
            $scope.areas = $scope.input.split(',');
            for (var i = 0; i < $scope.areas.length; i++) {
                $scope.areas[i] = trim11($scope.areas[i]);
                var area = $scope.areas[i];
                var tmpUrl = URL.replace("AREA", area).replace("QUERY", $scope.query);
                $scope.results[area] = [];
                httpGet("http://cors.io/?" + tmpUrl, area, success);

                function success(data, myArea) {
                    var test = new DOMParser().parseFromString(data, 'text/html');
                    var rows = test.getElementsByClassName("result-row");
                    for (var i = 0; i < rows.length; i++) {
                        var url = rows[i].getElementsByClassName("result-image")[0].getAttribute("href");
                        if (url.substring(0, 2) != "//") {
                            url = myArea + ".craigslist.org" + url;
                        }
                        var urls = [];
                        try {
                            urls = rows[i].getElementsByClassName("result-image")[0].getAttribute("data-ids").split(',');
                            for (var j = 0; j < urls.length; j++) {
                                urls[j] = IMAGE_URL.replace("IMAGE_ID", urls[j].substring(urls.indexOf("1:") + 3));
                            }
                        } catch (err) {
                            urls.push("https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg");
                        }
                        var price = "$0";
                        try {
                            price = rows[i].getElementsByClassName("result-info")[0].getElementsByClassName("result-price")[0].innerHTML;
                        } catch (err) {
                        }
                        var date = rows[i].getElementsByClassName("result-info")[0].getElementsByTagName("time")[0].innerHTML;
                        var title = rows[i].getElementsByClassName("result-info")[0].getElementsByClassName("result-title")[0].innerHTML;
                        var location = myArea;
                        try {
                            location = trim11(rows[i].getElementsByClassName("result-info")[0].getElementsByClassName("result-hood")[0].innerHTML);
                        } catch (err) {
                            try {
                                location = rows[i].getElementsByClassName("result-info")[0].getElementsByClassName("nearby")[0].getAttribute("title");
                            } catch (err) {
                                continue;
                            }
                        }

                        var result = {
                            url: url,
                            title: title,
                            date: date,
                            description: '',
                            price: price,
                            location: location,
                            pics: urls
                        };
                        //console.log(result);
                        $scope.results[myArea].push(result);
                    }
                    $scope.total += $scope.results[myArea].length;
                    $scope.$apply();
                }
            }
            myCache.put("myData", $scope.results);
        };
        function httpGet(theUrl, area, callback) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                    callback(xmlHttp.responseText, area);
            };
            xmlHttp.open("GET", theUrl, true); // true for asynchronous
            xmlHttp.send(null);
        }

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
    }
]);