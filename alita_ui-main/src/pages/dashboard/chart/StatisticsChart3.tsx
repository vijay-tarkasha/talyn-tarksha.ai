import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    ChartOptions,
    Legend,
    LinearScale,
    TimeScale,
    Title,
    Tooltip
} from "chart.js";
import 'chartjs-adapter-date-fns';
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { ServiceEndpoint } from "../../../config/ServiceEndpoints";
import { useTenantFormStore } from "../../../wire/AppStoreFactory";
import { getPxcel } from "../../../wire/errorToast";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    TimeScale
);

const StatisticsChar3 = () => {
    const [dataPoints, setDataPoints] = useState<any>({ labels: [], datasets: [] });
    const [chartInterval, setChartInterval] = useState("weekly");
    const endPoint = ServiceEndpoint.dashboard.restApi;

    const store = useTenantFormStore(endPoint);
    const [chartData, setChartData] = useState<any>([]);

    useEffect(() => {
        store.post({}).then((d) => {
            if (d)
                setChartData(d?.result || []);
        });
    }, []);

    const colors = [
        "rgb(233, 108, 59)", "rgb(15, 69, 140)", "rgb(34, 204, 178)",
        "rgb(232, 97, 140)", "rgb(233, 227, 59)", "rgb(15, 130, 140)",
        "rgb(34, 204, 108)", "rgb(219, 97, 232)"
    ];

    const getDataPoints = (data: any) => {
        if (data && data.length > 0 && data[0]?.counts) {
            const labels = data.map((item: any) => item.date);
            const datasets = Object.keys(data[0]?.counts).map((key, index) => ({
                label: key,
                data: data.map((item: any) => item.counts[key]),
                backgroundColor: colors[index % colors.length],
                borderColor: colors[index % colors.length],
                borderWidth: 1,barThickness: 8,
            }));
            return { labels, datasets };
        } else {
            return {
                labels: ["No Data"],
                datasets: [{
                    label: "No Data Available",
                    data: [0],
                    backgroundColor: "rgb(200, 200, 200)",
                    borderColor: "rgb(200, 200, 200)",
                    borderWidth: 1
                }]
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

            const { labels, datasets } = getDataPoints(filteredData);
            setDataPoints({ labels, datasets });
        }
    }, [chartData]);

    if (!dataPoints?.datasets?.length) {
        return <div>Loading chart...</div>;
    }

    const options: ChartOptions<"bar"> = {
        indexAxis: 'y', 
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    textAlign: 'center',
                    boxHeight: 4
                },
            },
            tooltip: {},
        },
        scales: {
            x: {
                ticks: {
                    // beginAtZero: true
                    source: 'auto',
                autoSkip: true,
                maxRotation: 45,
                minRotation: 0
                },
                title: {
                    display: false
                },
                  grid: {
                    display: false
                },
            },
            y: {                beginAtZero: true,

                grid: {
                    display: false
                },
                ticks: {
                    source: 'auto',
                }
            }
        }
    };

    return (
        <>
               <div className='chart-container h-40'>
            <Bar
                data={dataPoints}
                options={options}
                width={getPxcel('100%', '200px')}
                height={getPxcel('30%', '200px')}
            />
        </div>
        </>
 
    );
};

export default StatisticsChar3;
