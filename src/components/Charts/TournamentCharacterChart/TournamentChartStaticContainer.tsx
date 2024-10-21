import { chart } from "highcharts";
import { useRef } from "react";

export default function useTournamentChartStaticOptions(){
    const chartOptions: Highcharts.Options["chart"] = {
        type: "column",
        height: 750,
        backgroundColor: '#252527',
        // backgroundColor: 'transparent',
        borderRadius: 20,
        style:{
            color: 'white',
        },
        animation: {
            // duration: 400, // Reduce animation duration
            // easing: 'easeOutCubic'
        }
    }

    const titleOptions: Highcharts.Options["title"] = {
        text: `Character Representation of Top 16 in Season 2 Tournaments`,
        align: "center",
        style: {
            color: 'white'
        }
    }

    const plotOptions: Highcharts.Options["plotOptions"] = {
        column: {
            stacking: 'normal',
            pointWidth: 45, // TODO: change width of bars
            borderWidth: 0,
            borderRadius: 0,
            // dataLabels: {
            //     enabled: true,
            //     format: '{point.percentage:.0f}%'
            // }
            // animation: {
            //     duration: 400, // Reduce animation duration
            //     easing: 'easeOutCubic'
            // }
        },
        series: {
            opacity: 0.97,
            states:{
                hover: {
                    enabled: true,
                    opacity: 1,
                },
                inactive: {
                    enabled: true,
                    opacity: 0.6
                },
            },
        }
    }

    const legendOptions: Highcharts.Options["legend"] = {
        layout: 'vertical',
        align: 'center',
        verticalAlign: 'top',
        x: 600,
        y: 45,
        floating: true,
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
        shadow: true,
        events:{}
    }
    
    const tooltipOptions: Highcharts.Options["tooltip"] = {
        valueSuffix: ' players'
    }

    const yAxisOptions: Highcharts.Options["yAxis"] = {
        allowDecimals: false,
        min: 0,
        title: {
            text: 'Player Count',
            style: {
                color: 'white',
                fontSize: '20px'
            }
        },
        labels: {
            style:{
                color: 'white'
            }
        },
    }

    const xAxisOptions: Highcharts.Options["xAxis"] = {
        title:{
            margin: 10,
            text: 'Character',
            style: {
                color: 'white',
                fontSize: '20px'
            }
        },
        labels: {
            distance: 10,
            useHTML: true,
            rotation: 0,
        }
    }
    
    const staticOptions: Highcharts.Options = {
        credits: {enabled: false,},
        chart: chartOptions,
        title: titleOptions,
        plotOptions: plotOptions,
        legend: legendOptions,
        tooltip: tooltipOptions,
        yAxis: yAxisOptions,
        xAxis: xAxisOptions,
    }

    return { staticOptions }
}