import React, { useEffect, useRef, useState } from "react";
import ApexCharts from "apexcharts";

const DonutChart = () => {
  const chartRef = useRef(null);
  const [chart, setChart] = useState(null);

  const getChartOptions = () => ({
    series: [25, 25, 25, 25],
    colors: ["#1D4ED8", "#2563EB", "#93C5FD", "#DBEAFE"],
    chart: {
      height: 120,
      width: "100%",
      type: "donut",
    },
    stroke: {
      colors: ["transparent"],
      lineCap: "",
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: true,
              fontFamily: "Inter, sans-serif",
              offsetY: 20,
              color: "#1E40AF", // Change color for the name label
            },
            total: {
              showAlways: true,
              show: true,
              label: "Sales",
              fontFamily: "Inter, sans-serif",
              fontSize: "60px",
              color: "red", // Change color for the total label
              formatter: function (w) {
                const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return sum;
              },
            },
            value: {
              show: true,
              fontFamily: "Inter, sans-serif",
              offsetY: -20,
              color: "#4486F6", // Change color for the value label
              formatter: function (value) {
                return value;
              },
            },
          },
          size: "70%",
        },
      },
    },
    grid: {
      padding: {
        top: 0,
      },
    },
    labels: ["Direct", "Sponsor", "Affiliate", "Email marketing"],
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "right",
      fontFamily: "Inter, sans-serif",
    },
    yaxis: {
      labels: {
        color: "#4486F6", // Change color for y-axis labels
        formatter: function (value) {
          return value;
        },
      },
    },
    // xaxis: {
    //   labels: {
    //     formatter: function (value) {
    //       return value + "%";
    //     },
    //     axisTicks: {
    //       show: false,
    //     },
    //     axisBorder: {
    //       show: false,
    //     },
    //     style: {
    //       colors: "#4486F6", // Change color for x-axis labels
    //     },
    //   },
    // },
  });

  useEffect(() => {
    console.log("Mounting chart");
    if (chartRef.current && typeof ApexCharts !== "undefined") {
      const newChart = new ApexCharts(chartRef.current, getChartOptions());
      newChart.render();
      setChart(newChart);
    }

    return () => {
      console.log("Unmounting chart");
      if (chart) {
        chart.destroy();
      }
    };
  }, []);

  //   const handleCheckboxChange = (event) => {
  //     if (!chart) return;

  //     const checkbox = event.target;
  //     if (checkbox.checked) {
  //       switch (checkbox.value) {
  //         case "desktop":
  //           chart.updateSeries([15.1, 22.5, 4.4, 8.4]);
  //           break;
  //         case "tablet":
  //           chart.updateSeries([25.1, 26.5, 1.4, 3.4]);
  //           break;
  //         case "mobile":
  //           chart.updateSeries([45.1, 27.5, 8.4, 2.4]);
  //           break;
  //         default:
  //           chart.updateSeries([55.1, 28.5, 1.4, 5.4]);
  //       }
  //     } else {
  //       chart.updateSeries([35.1, 23.5, 2.4, 5.4]);
  //     }
  //   };

  return (
    <div>
      <div id="donut-chart" ref={chartRef} />
      {/* <div id="devices">
        <label>
          <input
            type="checkbox"
            value="desktop"
            onChange={handleCheckboxChange}
          />
          Desktop
        </label>
        <label>
          <input
            type="checkbox"
            value="tablet"
            onChange={handleCheckboxChange}
          />
          Tablet
        </label>
        <label>
          <input
            type="checkbox"
            value="mobile"
            onChange={handleCheckboxChange}
          />
          Mobile
        </label>
      </div> */}
    </div>
  );
};

export default DonutChart;
