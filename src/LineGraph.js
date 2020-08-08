import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },

  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callcacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};
const buildChartData = (data, country, casesType) => {
  const chartData = [];
  let lastDataPoints = 0;
  let activeCase;
  var Data = country === "worldwide" ? data : data.timeline;
  if (casesType !== "active") {
    for (let date in Data.cases) {
      if (lastDataPoints) {
        const newDataPoint = {
          x: date,
          y: Data[casesType][date] - lastDataPoints,
        };

        chartData.push(newDataPoint);
      }
      lastDataPoints = Data[casesType][date];
    }
    return chartData;
  } else {
    for (let date in Data.cases) {
      activeCase =
        Data["cases"][date] - Data["recovered"][date] - Data["deaths"][date];
      if (lastDataPoints) {
        const newDataPoint = {
          x: date,
          y: lastDataPoints,
        };

        chartData.push(newDataPoint);
      }
      lastDataPoints = activeCase;
    }
    return chartData;
  }
};
function LineGraph({ casesType = "cases", country = "worldwide", ...props }) {
  const [data, setData] = useState({});
  const [borderColor, setBorderColor] = useState("#CC1034");
  const [backgroundColor, setBackgroundColor] = useState(
    "rgba(255, 192, 203, 0.3)"
  );

  useEffect(() => {
    let name = country === "worldwide" ? "all" : country;
    const fetchData = async () => {
      fetch(`https://disease.sh/v3/covid-19/historical/${name}?lastdays=120`)
        .then((response) => response.json())
        .then((data) => {
          let chartData = buildChartData(data, country, casesType);
          setData(chartData);
        });

      if (casesType === "active") {
        setBackgroundColor("rgba(0,0,255,0.3)");
        setBorderColor("#0000FF");
      } else if (casesType === "recovered") {
        setBackgroundColor("rgb(0,128,0,0.3)");
        setBorderColor("#008000");
      } else if (casesType === "deaths") {
        setBackgroundColor("rgba(128,128,128,0.3)");
        setBorderColor("#808080");
      } else {
        setBackgroundColor("rgba(204, 16, 52, 0.3)");
        setBorderColor("#CC1034");
      }
    };

    fetchData();
  }, [casesType, country]);

  return (
    <div className={props.className}>
      {data?.length > 0 && (
        <Line
          options={options}
          data={{
            datasets: [
              {
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                data: data,
              },
            ],
          }}
        />
      )}
    </div>
  );
}

export default LineGraph;
