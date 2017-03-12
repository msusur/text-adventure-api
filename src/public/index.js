(function(angular) {
    var uuid = function() { // Public Domain/MIT
        var d = new Date().getTime();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }();

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
        .controller('chatController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
            $scope.dialogDisplay = true;

            $scope.selectLanguage = function(language) {
                $scope.language = language;
                var message = 'Oyuna hoş geldiniz! Birinci adım için "\\start" yazip enter tusuna basin..';
                if (language === 'en') {
                    message = 'Welcome to the game, write "\\start" and press enter to start the game.';
                }
                $scope.messages = [{
                    body: message,
                    date: 'now',
                    from: 'Bot',
                    isBot: true
                }];
                $scope.dialogDisplay = false;
            };

            $scope.selectLanguage('tr');

            $scope.send = function() {
                var message = $scope.inputMessage;
                $scope.inputMessage = '';
                $http.post('/api/console/input', { message: message, id: uuid }).success(function(result) {
                    $scope.messages.push({
                        body: message,
                        date: 'now',
                        from: 'me',
                        isBot: false
                    });
                    $scope.messages.push({
                        body: result.result.text,
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
        }]);
})(angular);