(function(angular) {
    var app = angular.module('chatApp', [])
        .directive('schrollBottom', function() {
            return {
                scope: {
                    schrollBottom: "="
                },
                link: function(scope, element) {
                    scope.$watchCollection('schrollBottom', function(newValue) {
                        if (newValue) {
                            $(element).scrollTop($(element)[0].scrollHeight);
                        }
                    });
                }
            }
        })
        .controller('chatController', function($scope, $http, $timeout) {
            $scope.messages = [{
                body: 'Oyuna hoş geldiniz! Birinci adım için \\basla yazin.',
                date: '1st June',
                from: 'me',
                isBot: true
            }];
            $scope.send = function() {
                $http.post('/api/console/input', { message: $scope.inputMessage }).success(function(result) {
                    $scope.messages.push({
                        body: $scope.inputMessage,
                        date: 'now',
                        from: 'me',
                        isBot: false
                    });
                    $scope.inputMessage = '';
                    $scope.messages.push({
                        body: result,
                        date: 'now',
                        from: 'teller',
                        isBot: true
                    });

                    $timeout(function() {
                        var scroller = document.getElementById("chat-history");
                        scroller.scrollTop = scroller.scrollHeight;
                    });
                });
            };
        });
})(angular);