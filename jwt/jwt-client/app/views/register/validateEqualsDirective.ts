

module register {


    export class ValidateEqualsDirective implements ng.IDirective{
        require = "ngModel";
        link = function (scope: ng.IScope, instanceElement: ng.IAugmentedJQuery, instanceAttributes: ng.IAttributes, controller: ng.INgModelController, transclude: ng.ITranscludeFunction) {
            function validateEqual(value) {
                var valid = (value === scope.$eval(instanceAttributes["validateEquals"]));
                controller.$setValidity("equal", valid);
                return valid ? value : undefined;
            };

            controller.$parsers.push(validateEqual);
            controller.$formatters.push(validateEqual);

            scope.$watch(instanceAttributes["validateEquals"], function () {
                controller.$setViewValue(controller.$viewValue);
            });
        }

    }
}

app.directive("validateEquals", () => {
    return new register.ValidateEqualsDirective();
});