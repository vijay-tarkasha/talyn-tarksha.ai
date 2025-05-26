import {
    CategoryScale,
    Chart as ChartJS,
    ChartOptions,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    TimeScale,
    Title,
    Tooltip
} from "chart.js";
import 'chartjs-adapter-date-fns';
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { ServiceEndpoint } from "../../../config/ServiceEndpoints";
import { useTenantFormStore } from "../../../wire/AppStoreFactory";
import { getPxcel } from "../../../wire/errorToast";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale
);

const StatisticsChart = () => {
    const [dataPoints, setDataPoints] = useState<any>({ labels: [], datasets: [] });
    const [_chartInterval, setChartInterval] = useState("weekly");
    const endPoint = ServiceEndpoint.dashboard.restApi;

    const store = useTenantFormStore(endPoint);

    const [chartData, setChartData] = useState<any>([]);

    useEffect(() => {
        store.post({}).then((d) => {
            if (d)
                setChartData(d?.result || [])
        })
    }, [])

    const colors = [
        "rgb(233, 108, 59)", "rgb(15, 69, 140)", "rgb(34, 204, 178)",
        "rgb(232, 97, 140)", "rgb(233, 227, 59)", "rgb(15, 130, 140)",
        "rgb(34, 204, 108)", "rgb(219, 97, 232)"
    ];

    const getDataPoints = (data: any) => {
        if (data && data.length > 0 && data[0]?.counts) {
            const labels: any = data?.map((item: any) => item.date);
            const datasets: any = Object.keys(data[0]?.counts).map((key, index) => {
                const dataset = {
                    label: key,
                    data: data?.map((item: any) => item.counts[key]),
                    borderColor: colors[index % colors.length],
                    backgroundColor: colors[index % colors.length],
                    fill: false,
                    borderWidth: 2,
                    tension: 0.5,
                    pointRadius: 1,
                    pointHoverRadius: 0
                };
                return dataset;
            });
            return { labels, datasets };
        } else {
            return {
                labels: ["No Data"],
                datasets: [
                    {
                        label: "No Data Available",
                        data: [0],
                        borderColor: "rgb(200, 200, 200)",
                        backgroundColor: "rgb(200, 200, 200)",
                        borderWidth: 2,
                        tension: 0.5,
                        pointRadius: 1,
                        pointHoverRadius: 0
                    }
                ]
            };
        }
    };

    useEffect(() => {
        if (chartData) {
            const totalWeeks = chartData?.length;

            let filteredData = [...chartData];

            if (totalWeeks === 12) {
                setChartInterval("weekly");
            } else if (totalWeeks > 8 && totalWeeks <= 12) {
                setChartInterval("bi-weekly");
                filteredData = chartData?.filter((_s: any, index: number) => index % 2 === 0);
            } else if (totalWeeks > 12) {
                setChartInterval("monthly");
                filteredData = chartData?.filter((_s: any, index: number) => index % 4 === 0);
            }
            const { labels, datasets }: any = getDataPoints(filteredData);
            setDataPoints({
                labels,
                datasets,
            });
        }
        else[]
    }, [chartData]);

    if (!dataPoints?.datasets?.length) {
        return <div>Loading chart...</div>;
    }

    const options: ChartOptions<any> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    textAlign:'center',
                    boxHeight: 6
                },
            },
            tooltip: {
                //     mode: "index",
                //     intersect: false,
                // callbacks: {
                //     label: function (tooltip: any) {
                //         const formatTooltip = format(tooltip.parsed.x, 'dd-MMM-yyyy');
                //         return formatTooltip;
                //     }
                // }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                // display: false,
                title: {
                    display: false
                },
                ticks: {
                    beginAtZero: true
                },
            },
            x: {
                // type: 'time',
                grid: {
                    display: false,
                },
                ticks: {
                    source: 'auto',
                    // callback: function (value: any) {
                    //     return format(value, chartInterval === 'weekly' ? 'dd-MM-yyyy' :
                    //         chartInterval === 'bi-weekly' ? 'dd-MMM-yyyy' : 'MMM-yyyy');
                    // },
                }
            }
        }
    }
    return (
        <div className='chart-container'>
            {chartData ?
                <Line data={dataPoints} options={options}
                 width={getPxcel('100%', '200px')} height={getPxcel('30%', '200px')}/> : <div></div>
            }
        </div>
    );
};

export default StatisticsChart;