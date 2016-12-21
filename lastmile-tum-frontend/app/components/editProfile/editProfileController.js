angular.module('lastMile')
    .controller('EditCtrl', ['$scope',
        function($scope) {
            var initPicSize = function(){
                $('.pic').height($('.pic').width());
            };

            var initPicSize2 = function(){
                $('.pic2').height($('.pic2').width());
            };

            var initGraph = function(){
                var dataset = {
                    name: 'Maxl',
                    data: [3, 6, 1, 2, 6]};


                $( function() {
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
                                labels: {enabled:true}
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

            $('#showDetails').on('shown.bs.modal', function(){
                // init upper pic size
                initPicSize2();
                // init graph
                initGraph();

            });

            var initAccordion = function (){
                $( function() {
                    $( "#accordion" ).accordion({
                        collapsible: true,
                        icons: null,
                        heightStyle: "content"
                    });
                } );
            };

            initPicSize();

            initAccordion();
        }
    ]);