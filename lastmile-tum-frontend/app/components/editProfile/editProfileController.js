angular.module('lastMile')
    .controller('EditProfileCtrl',
        function ($scope, User, userService, Upload, BACKEND_BASE_URL) {

            $scope.pictureUpdated = false;
            $scope.user = User.get({userID: userService.getUserName()._id});


            $scope.updateUser = function () {
                var userID = userService.getUserName()._id;
                Upload.upload({
                    url: BACKEND_BASE_URL + '/user/'+userID,
                    data: {
                        file: $scope.user.picture,
                        _id: $scope.user._id,
                        email: $scope.user.email,
                        sex: $scope.user.sex,
                        birthday: $scope.user.birthday,
                        firstName: $scope.user.firstName,
                        lastName: $scope.user.lastName,
                        street: $scope.user.street,
                        number: $scope.user.number,
                        zipCode: $scope.user.zipCode,
                        town: $scope.user.town,
                        telephone: $scope.user.telephone,
                        trunkSize: $scope.user.trunkSize,
                        password: $scope.user.password
                    }
                    ,method: 'PUT'
                })
                .then(function (resp) {
                 alert("user successfully updated");
                 }).catch(function (resp) {
                 alert("error while updating user");
                 });
            };
            var initPicSize = function () {
                $('.pic').height($('.pic').width());
            };

            var initPicSize2 = function () {
                $('.pic2').height($('.pic2').width());
            };

            var initGraph = function () {
                var dataset = {
                    name: 'Maxl',
                    data: [3, 6, 1, 2, 6]
                };


                $(function () {
                    (Highcharts.chart({
                        chart: {
                            renderTo: '#starBarchart',
                            type: 'bar',
                            height: 150
                        },
                        title: {
                            text: '',
                            style: {
                                display: 'none'
                            }
                        },
                        subtitle: {
                            text: '',
                            style: {
                                display: 'none'
                            }
                        },
                        xAxis: {
                            categories: ['5', '4', '3', '2', '1'],
                            labels: {enabled: true}
                        },
                        yAxis: {
                            allowDecimals: false,
                            title: {
                                enabled: false
                            },
                            min: 0,
                            max: 10
                        },
                        legend: {
                            enabled: false
                        },
                        series: [dataset]
                    }));
                });

            };

            $('#showDetails').on('shown.bs.modal', function () {
                // init upper pic size
                initPicSize2();
                // init graph
                initGraph();

            });

            var initAccordion = function () {
                $(function () {
                    $("#accordion").accordion({
                        collapsible: true,
                        icons: null,
                        heightStyle: "content"
                    });
                });
            };

            initPicSize();

            initAccordion();


        }
    );