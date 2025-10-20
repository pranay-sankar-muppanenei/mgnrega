// client/src/components/PerformanceChart.jsx
import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart components once
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Define chart configurations (we use a constant to easily map button clicks to data sets)
const CHART_CONFIGS = {
  PEOPLE: 'PEOPLE',
  FINANCE: 'FINANCE',
  WORKS: 'WORKS',
};

const PerformanceChart = ({ data }) => {
  const monthlyData = data.performance || [];
  const district = data.district || 'Selected District';
  const financialYear = data.financialYear || '';

  // State to track which chart is currently active (default to PEOPLE)
  const [activeChart, setActiveChart] = useState(CHART_CONFIGS.PEOPLE); 

  if (monthlyData.length === 0) {
    return <p className="text-gray-500 text-center p-10">No monthly performance data available for **{district}**.</p>;
  }

  // --- Utility Function to get Chart Data and Options based on selection ---
  const getChartProps = (chartType) => {
    const labels = monthlyData.map(item => `${item.month} (${item.financialYear.substring(0, 4)})`);
    let datasets = [];
    let options = {};
    let chartTitle = '';
    let yAxisTitle = '';

    switch (chartType) {
      case CHART_CONFIGS.PEOPLE:
        chartTitle = 'Active Cards & Workers (Count)';
        yAxisTitle = 'Count of People';
        datasets = [
          {
            label: 'Active Job Cards',
            data: monthlyData.map(item => item.activeJobCards),
            backgroundColor: 'rgba(75, 192, 192, 0.8)',
          },
          {
            label: 'Active Workers',
            data: monthlyData.map(item => item.activeWorkers),
            backgroundColor: 'rgba(153, 102, 255, 0.8)',
          },
        ];
        break;

      case CHART_CONFIGS.FINANCE:
        chartTitle = 'Total Expenditure & Average Wage';
        yAxisTitle = 'Total Expenditure (Crores)';
        datasets = [
          {
            label: 'Total Expenditure (Crores)',
            data: monthlyData.map(item => item.totalExpenditure),
            backgroundColor: 'rgba(255, 159, 64, 0.8)',
            yAxisID: 'y',
          },
          {
            label: 'Average Wage Rate (₹/day)',
            data: monthlyData.map(item => item.avgWage),
            backgroundColor: 'rgba(0, 123, 255, 0.8)',
            yAxisID: 'y1', // Separate axis for wage rate
          },
        ];
        // Custom options for dual Y-axis on Finance Chart
        options = {
            scales: {
                y: {
                    type: 'linear',
                    position: 'left',
                    title: { display: true, text: 'Expenditure (Crores)', color: 'rgba(255, 159, 64, 1)' },
                },
                y1: {
                    type: 'linear',
                    position: 'right',
                    grid: { drawOnChartArea: false },
                    title: { display: true, text: 'Avg. Wage Rate (₹/day)', color: 'rgba(0, 123, 255, 1)' },
                }
            }
        };
        break;

      case CHART_CONFIGS.WORKS:
        chartTitle = 'Works Progress & Women Persondays';
        yAxisTitle = 'Total Works (Stacked)';
        datasets = [
          {
            label: 'Ongoing Works',
            data: monthlyData.map(item => item.ongoingWorks),
            backgroundColor: 'rgba(54, 162, 235, 0.8)',
            stack: 'works',
          },
          {
            label: 'Completed Works',
            data: monthlyData.map(item => item.completedWorks),
            backgroundColor: 'rgba(75, 192, 192, 0.8)',
            stack: 'works',
          },
          {
            label: 'Women Persondays (in thousands)',
            data: monthlyData.map(item => item.womenPersondays / 1000), // Scale down
            backgroundColor: 'rgba(255, 99, 132, 0.8)',
            yAxisID: 'y1',
          },
        ];
        // Custom options for Stacked Bar and dual Y-axis on Works Chart
        options = {
            scales: {
                y: {
                    stacked: true,
                    position: 'left',
                    title: { display: true, text: 'Works Count', color: 'rgba(54, 162, 235, 1)' },
                },
                y1: {
                    position: 'right',
                    grid: { drawOnChartArea: false },
                    title: { display: true, text: 'Women Persondays (in thousands)', color: 'rgba(255, 99, 132, 1)' },
                    ticks: { callback: (value) => value * 1000 } // Show original value * 1000 on tooltips/labels
                }
            }
        };
        break;

      default:
        break;
    }

    // Base Options (applied to all charts)
    const baseOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'bottom', labels: { color: '#333' } },
            title: {
                display: true,
                text: `${chartTitle} for ${district} (${financialYear})`,
                color: '#333',
                font: { size: 16 }
            },
            tooltip: { 
                mode: 'index', 
                intersect: false,
                callbacks: {
                    // Make tooltips show actual value for Women Persondays
                    label: (context) => {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.dataset.label.includes('Persondays')) {
                            // Convert value back to actual number
                            label += (context.parsed.y * 1000).toLocaleString('en-IN');
                        } else {
                            label += context.parsed.y.toLocaleString('en-IN');
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            x: { title: { display: true, text: 'Month', color: '#333' } },
            y: { ...options.scales?.y, beginAtZero: true },
            y1: { ...options.scales?.y1, beginAtZero: true },
        },
    };

    return {
      chartData: { labels, datasets },
      chartOptions: { ...baseOptions, ...options },
    };
  };

  const { chartData, chartOptions } = getChartProps(activeChart);

  // --- Render Component ---
  return (
    <div className="text-gray-800 p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">
        {district} Monthly MGNREGA Progress 📈
      </h2>
      <p className="text-center text-md mb-4 text-gray-600">
        **Financial Year(s): {financialYear}**
      </p>

      {/* Button Group for Chart Selection */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setActiveChart(CHART_CONFIGS.PEOPLE)}
          className={`px-4 py-2 rounded-full text-white font-semibold transition-colors ${
            activeChart === CHART_CONFIGS.PEOPLE
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gray-500 hover:bg-gray-600'
          }`}
        >
          People Engagement (Cards & Workers)
        </button>
        <button
          onClick={() => setActiveChart(CHART_CONFIGS.FINANCE)}
          className={`px-4 py-2 rounded-full text-white font-semibold transition-colors ${
            activeChart === CHART_CONFIGS.FINANCE
              ? 'bg-yellow-600 hover:bg-yellow-700'
              : 'bg-gray-500 hover:bg-gray-600'
          }`}
        >
          Financial Overview (Expenditure & Wage)
        </button>
        <button
          onClick={() => setActiveChart(CHART_CONFIGS.WORKS)}
          className={`px-4 py-2 rounded-full text-white font-semibold transition-colors ${
            activeChart === CHART_CONFIGS.WORKS
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-gray-500 hover:bg-gray-600'
          }`}
        >
          Works & Equity (Completed, Ongoing, Women)
        </button>
      </div>

      {/* Dynamic Chart Area */}
      <div className="p-6 border rounded-lg shadow-xl bg-white">
        <Bar data={chartData} options={chartOptions} />
      </div>

      <p className="text-sm text-gray-500 mt-6 text-center">
        *Click a button above to change the focus of the monthly performance graph.*
      </p>
    </div>
  );
};

export default PerformanceChart;