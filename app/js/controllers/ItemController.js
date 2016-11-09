'use strict';
//Controller
timeTracker.controller('ItemController', ['$scope', '$timeout', '$localStorage', 'ProjectFactory',
    function ($scope, $timeout, $localStorage, ProjectFactory) {

        $scope.$storage = $localStorage;

        $scope.projectTasks = ProjectFactory.getProjectTask();
        $scope.projects = ProjectFactory.getProjects();
        $scope.currentTask = ProjectFactory.getCurrentTask();

        $scope.toggleStartStopTimer = function () {
            if ($scope.currentTask.dateBegin == undefined) {
                $scope.startTimer();
            } else {
                $scope.stopTimer();
            }
        };
        $scope.started = false;
        $scope.valueButton = 'Start';

        $scope.startTimer = function () {
            var dateBegin = new Date();
            $scope.currentTask.dateBegin = dateBegin.toString();
            $scope.timer();
            $scope.started = true;
            $scope.valueButton = 'Stop';
        };
        $scope.stopTimer = function () {
            var dateFinish = new Date();
            $scope.currentTask.dateFinish = dateFinish.toString();
            $scope.projectTasks.push($scope.currentTask);
            $timeout.cancel(stopWatch);
            $scope.timeContainer = '00:00:00';
            $scope.projectTasks.sort(sortProjects);
            $scope.currentTask = {};
            $localStorage.projectTasks = $scope.projectTasks;
            $scope.started = false;
            $scope.valueButton = "Start";
        };
        $scope.quickStartTimer = function (projectTasks) {
            if ($scope.currentTask.dateBegin !== undefined) {
                $scope.stopTimer();
            }
            $scope.startTimer();
            $scope.currentTask.taskName = projectTasks.taskName;
            $scope.currentTask.currentProject = projectTasks.currentProject;
        };

        var stopWatch;
        $scope.timer = function () {
            $scope.timeContainer = $scope.spentTime(new Date($scope.currentTask.dateBegin), new Date());
            stopWatch = $timeout($scope.timer, 1000);
        };
        $scope.spentTime = function (dateBegin, dateFinish) {
            var spentTime = ((Math.floor((dateFinish) / 1000)) - (Math.floor((dateBegin) / 1000)));
            var seconds = spentTime % 60;
            spentTime -= seconds;
            spentTime = Math.floor(spentTime / 60);
            var minutes = spentTime % 60;
            spentTime -= minutes;
            spentTime = Math.floor(spentTime / 60);
            var hours = spentTime % 60;
            if (hours < 10) hours = '0' + hours;
            if (minutes < 10) minutes = '0' + minutes;
            if (seconds < 10) seconds = '0' + seconds;
            spentTime = hours + ':' + minutes + ':' + seconds;
            return spentTime;
        };
        function sortProjects(a, b) {
            var result = 0;
            if (a.dateFinish > b.dateFinish) {
                result = -1;
            }
            if (a.dateFinish < b.dateFinish) {
                result = 1;
            }
            return result;
        }
        $scope.dateFormater = function (dateStr) {
            return new Date(dateStr);
        };
    }]);