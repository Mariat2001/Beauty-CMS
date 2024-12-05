import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { background } from '@chakra-ui/react';

function AreaChart() {
    const options = {
        chart: {
            type: 'area',
            height: null,
            backgroundColor: null,  
        },
        accessibility: {
            description: 'An area chart comparing the nuclear stockpiles of the USA and the USSR/Russia over months.',
        },
        title: {
            text: 'WorldWide Sales',
        },
        subtitle: {
            text: '',
        },
        xAxis: {
            type: 'datetime',
            tickInterval: 30 * 24 * 3600 * 1000, // Show labels every month
            labels: {
                format: '{value:%b}' // Format to display only the month (e.g., Jan, Feb)
            },
            accessibility: {
                rangeDescription: 'Range: January to December.',
            },
        },
        yAxis: {
            title: {
                text: 'Sales in $',
            },
        },
        tooltip: {
            xDateFormat: '%B', // Full month name in tooltip
            pointFormat: '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x:%B}',
        },
        plotOptions: {
            area: {
                pointStart: Date.UTC(2024, 0), // January 2024
                pointInterval: 30 * 24 * 3600 * 1000, // One month interval
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true,
                        },
                    },
                },
            },
        },
        series: [
            {
                name: 'USA',
                data: [
                    553, 9, 13, 50, 170, 299, 438, 841, 1169, 1703, 222, 692,
                ],
            },
            {
                name: 'France',
                data: [
                    780, 5, 25, 50, 120, 150, 200, 426, 660, 863, 148, 127,
                ],
            },
            {
                name: 'Lebanon',
                data: [
                    300, 1300, 25, 50, 120, 150, 250, 426, 660, 863, 1048, 367,
                ],
            },
            {
                name: 'Saudi Arabia',
                data: [
                    1000, 5, 25, 50, 120, 1500, 200, 426, 770, 863, 1048, 1627,
                ],
            },
            {
                name: 'Quatar',
                data: [
                    100, 5, 25, 50, 120, 150, 200, 426, 660, 863, 1048, 1627,
                ],
            },
        ],
    };
  
    return (
        <figure className="highcharts-figure" >
            <HighchartsReact highcharts={Highcharts} options={options} style={{background:'transparent'}} />
         
        </figure>
    );
}

export default AreaChart;
