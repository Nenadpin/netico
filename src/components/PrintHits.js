import React from "react";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  PointElement,
  BarElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Scatter, Bar } from "react-chartjs-2";

const PrintHits = ({ chartData }) => {
  ChartJS.register(
    LinearScale,
    PointElement,
    BarElement,
    LineElement,
    CategoryScale,
    Tooltip,
    Legend
  );

  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "mV",
        },
      },
      x: {
        beginAtZero: true,
        type: "linear",
        title: {
          display: true,
          text: "t(ms)",
        },
      },
    },
  };
  const data = {
    datasets: [
      {
        label: "Leves vs Phase Plot",
        data: chartData?.hits.data,
        backgroundColor: "black",
        pointRadius: 4,
      },
    ],
  };
  const barData1 = {
    labels: ["CH 1"],
    datasets: [
      {
        label: "",
        data: [chartData?.bars.data[0]],
        backgroundColor: "red",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        maxBarThickness: 10,
      },
    ],
  };
  const barData2 = {
    labels: ["CH 1"],
    datasets: [
      {
        label: "",
        data: [chartData?.bars.data[1]],
        backgroundColor: "red",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        maxBarThickness: 10,
      },
    ],
  };
  const barData3 = {
    labels: ["CH 1"],
    datasets: [
      {
        label: "",
        data: [chartData?.bars.data[2]],
        backgroundColor: "red",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        maxBarThickness: 10,
      },
    ],
  };
  const barData4 = {
    labels: ["CH 1"],
    datasets: [
      {
        label: "",
        data: [chartData?.bars.data[3]],
        backgroundColor: "red",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        maxBarThickness: 10,
      },
    ],
  };

  const barOptions1 = {
    indexAxis: "y",
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: "RMS (mV)",
        },
        ticks: {
          stepSize: 0.5,
          // maxTicksLimit: 1.5,
        },
        suggestedMax: 3.5,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  const barOptions2 = {
    indexAxis: "y",
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Peak (mV)",
        },
        ticks: {
          stepSize: 5,
          // maxTicksLimit: 1.5,
        },
        suggestedMax: 12.5,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  const barOptions3 = {
    indexAxis: "y",
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Freq1 (mV)",
        },
        ticks: {
          stepSize: 0.5,
          // maxTicksLimit: 1.5,
        },
        suggestedMax: 1.25,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  const barOptions4 = {
    indexAxis: "y",
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Freq 2 (mV)",
        },
        ticks: {
          stepSize: 0.5,
          // maxTicksLimit: 1.5,
        },
        suggestedMax: 1.25,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <>
      {chartData?.hits ? (
        <div style={{ height: "200px", marginTop: "200px" }}>
          <Scatter options={options} data={data} />
        </div>
      ) : null}
      {chartData?.bars.data.length === 4 ? (
        <div style={{ height: "45px" }}>
          <p style={{ textAlign: "center" }}>{chartData?.luh}</p>
          <Bar data={barData1} options={barOptions1} />
          <Bar data={barData2} options={barOptions2} />
          <Bar data={barData3} options={barOptions3} />
          <Bar data={barData4} options={barOptions4} />
        </div>
      ) : null}
    </>
  );
};

export default PrintHits;
