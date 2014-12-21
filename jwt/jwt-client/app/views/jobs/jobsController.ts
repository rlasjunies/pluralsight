
module jobs {
    export interface job {
        name: string;
    }
    export class JobsController {
        public jobs: job[] = [];
        notificationService: services.NotificationService;
        constructor($scope: ng.IScope, $http: ng.IHttpService, API_URL, NotificationService: services.NotificationService) {
            this.notificationService = NotificationService;

            $http.get(API_URL + "/jobs")
                .error((err) => {
                    this.notificationService.error("Error message: \n" + JSON.stringify(err), "Cannot load jobs resources:");
                })
                .success((jobs:job[]) => {
                    this.jobs = jobs;
                });

            console.log("JobsController: Constructor");

            console.log(JSON.stringify(this.jobs));

        }
    }
}

app.controller("JobsController", jobs.JobsController);