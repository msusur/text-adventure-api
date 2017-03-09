(function(angular) {
    var app = angular.module('chatApp', []);
    app.controller('chatController', function($scope) {
        $scope.messages = [{
                body: 'test message',
                date: '1st June',
                from: 'me',
                isBot: true
            },
            {
                body: 'test message',
                date: '1st June',
                from: 'me',
                isBot: false
            },
            {
                body: 'test message',
                date: '1st June',
                from: 'me',
                isBot: true
            },
        ];
        $scope.send = function() {};
    });
})(angular);