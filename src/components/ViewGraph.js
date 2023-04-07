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

const ViewGraph = ({ chartData }) => {
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
      {
        label: chartData?.lug ? chartData.lug : "",
        data: chartData?.us.dataG,
        borderColor: "yellow",
        borderWidth: 1,
        pointborderColour: "white",
        cubicInterpolationMode: "monotone",
      },
      {
        label: chartData?.luh ? chartData.luh : "",
        data: chartData?.us.dataH,
        borderColor: "black",
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
        label: chartData?.lt1 ? chartData.lt1 : "",
        spanGaps: false,
        data: chartData?.ut.data1,
        borderColor: "red",
        borderWidth: 1,
        pointborderColour: "white",
        cubicInterpolationMode: "monotone",
      },
      {
        label: chartData?.lt2 ? chartData.lt2 : "",
        spanGaps: false,
        data: chartData?.ut.data2,
        borderColor: "blue",
        borderWidth: 1,
        pointborderColour: "white",
        cubicInterpolationMode: "monotone",
      },
      {
        label: chartData?.lt3 ? chartData.lt3 : "",
        spanGaps: false,
        data: chartData?.ut.data3,
        borderColor: "yellow",
        borderWidth: 1,
        pointborderColour: "white",
        cubicInterpolationMode: "monotone",
      },
      {
        label: chartData?.lt4 ? chartData.lt4 : "",
        spanGaps: false,
        data: chartData?.ut.data4,
        borderColor: "black",
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
    <>
      {chartData ? <Line data={dataU} options={optionsU}></Line> : null}
      {chartData ? <Line data={dataT} options={optionsT}></Line> : null}
    </>
  );
};

export default ViewGraph;
