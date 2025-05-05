import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { ru } from 'date-fns/locale';
import { useTheme } from '../../ThemeProvider';
import { Line } from 'react-chartjs-2';

// Регистрация необходимых модулей Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    TimeScale
);

const Chart = ({ data }) => {
    const { resolvedTheme } = useTheme(); // Текущая тема: light/dark
    const [chartData, setChartData] = useState(null);
    const [chartOptions, setChartOptions] = useState(null);

    useEffect(() => {
        if (data && data.length > 0) {
            // Фильтруем данные с count > 0 для корректного отображения
            const validData = data.filter(item => item.count > 0);
            // Преобразуем данные в формат, понятный Chart.js
            const labels = validData.map(item => {
                const date = new Date(item.year, item.month - 1, item.day);
                return date.toISOString();
            });

            const dataValues = validData.map(item => item.count);
            // Вычисляем максимальное значение по Y для масштабирования
            const maxCount = Math.max(...dataValues);
            const yAxisMax = Math.max(maxCount, 5);
            // Формируем данные графика
            setChartData({
                labels: labels,
                datasets: [{
                    label: 'Количество доставок',
                    data: dataValues,
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.2)',
                    fill: true,
                    tension: 0.1,
                    borderWidth: 1.5,
                    pointRadius: 3,
                    pointHoverRadius: 6,
                }],
            });
            // Настройки графика
            setChartOptions({
                plugins: {
                    legend: {
                        labels: {
                            color: resolvedTheme === 'dark' ? '#ffffff' : '#333333',
                            font: {
                                family: 'var(--base-font-family)',
                            },
                        },
                    },
                    tooltip: {
                        titleColor: resolvedTheme === 'dark' ? '#ffffff' : '#333333',
                        bodyColor: resolvedTheme === 'dark' ? '#ffffff' : '#333333',
                        backgroundColor: resolvedTheme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                        borderWidth: 1,
                        callbacks: {
                            label: function (context) {
                                const label = context.dataset.label || '';
                                const value = Number(context.parsed.y);
                                return `${label}: ${value.toLocaleString('ru-RU')}`;
                            }
                        },
                    },
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                            displayFormats: {
                                day: 'd MMM',
                            },
                            tooltipFormat: 'PPP',
                            adapter: {
                                locale: ru,
                            },
                        },
                        color: resolvedTheme === 'dark' ? '#ffffff' : '#333333',
                        ticks: {
                            color: resolvedTheme === 'dark' ? '#ffffff' : '#333333',
                            font: {
                                family: 'var(--base-font-family)',
                            },
                            maxTicksLimit: 10
                        },
                        grid: {
                            color: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                        }
                    },
                    y: {
                        min: 0,
                        max: yAxisMax,
                        ticks: {
                            color: resolvedTheme === 'dark' ? '#ffffff' : '#333333',
                            font: {
                                family: 'var(--base-font-family)',
                            },
                            stepSize: 1,
                            precision: 0
                        },
                        title: {
                            display: true,
                            text: 'Количество доставок',
                            color: resolvedTheme === 'dark' ? '#ffffff' : '#333333',
                            font: {
                                family: 'var(--base-font-family)',
                            },
                        },
                        type: 'linear',
                        beginAtZero: true,
                    },
                },
            });
        } else {
            setChartData(null);
            setChartOptions(null);
        }
    }, [data, resolvedTheme]);

    if (!chartData || !chartOptions) {
        return null;
    }

    return <Line data={chartData} options={chartOptions} height={100} />;
};

export default Chart;