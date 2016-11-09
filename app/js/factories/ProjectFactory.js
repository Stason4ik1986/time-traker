timeTracker.factory('ProjectFactory', function ($localStorage) {
    var service = {};
    var projectTasks = $localStorage.projectTasks ? $localStorage.projectTasks : [];
    service.getProjectTask = function() {
        return projectTasks;
    };

    var projects = [
        {
            projectName: 'Select project'
        },
        {
            projectName: 'Project1'
        },
        {
            projectName: 'Project2'
        },
        {
            projectName: 'Project3'
        }
    ];
    service.getProjects = function() {
        return projects;
    };
    var currentTask = {
        taskName: '',
        currentProject: projects[0].projectName,
        dateFinish: ''
    };
    service.getCurrentTask  = function () {
        return currentTask;
    };
    return service;
});