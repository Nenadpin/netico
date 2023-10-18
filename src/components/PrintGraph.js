import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Legend);

const PrintGraph = ({ chartData }) => {
  const dataU = {
    labels: chartData?.us.label,
    datasets: [
      {
        label: chartData?.lub ? chartData.lub : "",
        data: chartData?.us.dataB,
        spanGaps: false,
        borderColor: "red",
        borderWidth: 1,
        pointborderColour: "white",
        cubicInterpolationMode: "monotone",
      },
      {
        label: chartData?.luf ? chartData.luf : "",
        data: chartData?.us.dataF,
        borderColor: "blue",
        borderWidth: 1,
        pointborderColour: "white",
        cubicInterpolationMode: "monotone",
      },
    ],
  };
  const optionsU = {
    plugins: {
      legend: true,
    },
    maintainAspectRatio: false,
    scales: {
      y: {
        display: true,
        title: {
          display: true,
          text: "Amplitude(dBm)",
        },
        suggestedMin: -80,
        suggestedMax: -40,
      },
      x: {
        display: true,
        type: "linear",
        title: {
          display: true,
          text: "Frequency(MHz)",
        },
        ticks: {
          stepSize: 200,
          maxTicksLimit: 15,
        },
        suggestedMin: 50,
        suggestedMax: 1000,
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
  };
  const dataT = {
    labels: chartData?.ut.label,
    datasets: [
      {
        label: chartData?.lt ? chartData.lt : "",
        spanGaps: false,
        data: chartData?.ut.data,
        borderColor: "blue",
        borderWidth: 1,
        pointborderColour: "white",
        cubicInterpolationMode: "monotone",
      },
    ],
  };
  const optionsT = {
    plugins: {
      legend: true,
    },
    maintainAspectRatio: false,
    scales: {
      y: {
        display: true,
        title: {
          display: true,
          text: "dBm",
        },
        suggestedMin: -80,
        suggestedMax: -60,
      },
      x: {
        display: true,
        type: "linear",
        title: {
          display: true,
          text: "t(ms)",
        },
        ticks: {
          stepSize: 5,
          maxTicksLimit: 50,
        },
        suggestedMin: -12,
        suggestedMax: 50,
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
  };

  return (
    <div style={{ height: "200px" }}>
      <Line data={dataU} options={optionsU}></Line>
      {chartData?.ut.data.length ? (
        <div style={{ height: "200px" }}>
          <Line data={dataT} options={optionsT}></Line>
        </div>
      ) : null}
    </div>
  );
};

export default PrintGraph;
