angular.module('lastMile')
    .directive('datepicker', function () {
        return {
            require : 'ngModel',
            link : function (scope, element, attrs, ngModelCtrl) {
                $(function(){
                    element.datepicker({
                        dateFormat:'dd.mm.yy',
                        onSelect:function (dateText, inst) {
                            ngModelCtrl.$setViewValue(dateText);
                            scope.$apply();
                        }
                    });
                });
            }
        }
    });