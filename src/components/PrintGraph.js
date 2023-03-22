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

const PrintGraph = ({ chartData, setChartData }) => {
  let labelS = [];
  for (let i = 0; i < 501; i++) {
    labelS.push(Math.floor(50 + i * 1.9));
  }
  let labelT = [];
  for (let i = 0; i < 601; i++) {
    labelT.push(Math.floor(-10 + i * 0.1));
  }
  // setChartData({
  //   lub: "",
  //   luf: "",
  //   lt: "",
  //   us: {
  //     label: labelS,
  //     dataF: [],
  //     dataB: [],
  //   },
  //   ut: {
  //     label: labelT,
  //     data: [],
  //   },
  // });
  const dataU = {
    labels: chartData?.us.label,
    datasets: [
      {
        label: chartData?.lub ? chartData.lub : "",
        data: chartData?.us.dataB,
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
        title: {
          display: true,
          text: "Frequency(MHz)",
        },
        ticks: {
          stepSize: 200,
          // beginAtZero: true,
          maxTicksLimit: 5,
        },
        suggestedMin: 40,
        suggestedMax: 1050,
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
        title: {
          display: true,
          text: "t(ms)",
        },
        ticks: {
          stepSize: 200,
          maxTicksLimit: 6,
        },
        suggestedMin: -20,
        suggestedMax: 60,
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
  };
  //   const getPageMargins = () => {
  //     return `@page { margin: ${marginTop} ${marginRight} ${marginBottom} ${marginLeft} !important; }`;
  //   };
  return (
    <>
      <Line data={dataU} options={optionsU}></Line>
      <Line data={dataT} options={optionsT}></Line>
    </>
  );
};

export default PrintGraph;
