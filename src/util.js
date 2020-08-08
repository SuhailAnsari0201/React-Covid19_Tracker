import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    rgb: "rgb(204,16,52)",
    multiplier: 800,
  },
  active: {
    hex: "#0000FF",
    rgb: "rgb(0,0,255)",
    multiplier: 900,
  },
  recovered: {
    hex: "#008000",
    rgb: "rgb(144,238,144)",
    multiplier: 1000,
  },
  deaths: {
    hex: "#808080",
    rgb: "rgb(128,128,128)",
    multiplier: 1400,
  },
};

export const sortData = (data) => {
  const sortedData = [...data];

  sortedData.sort((a, b) => {
    if (a.cases > b.cases) {
      return -1;
    } else {
      return 1;
    }
  });
  return sortedData;
};

export const prettyPrintStat = (stat) =>
  stat ? `${numeral(stat).format("0,0")}` : "0";

export const showDataOnMap = (data, casesType = "cases") =>
  data.map((country) => (
    <Circle
      key={country.country}
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.4}
      color={casesTypeColors[casesType].hex}
      fillColor={casesTypeColors[casesType].rgb}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
    >
      <Popup>
        <div className="info-contanier">
          <div
            className="info-flag"
            style={{
              backgroundImage: `url(${country.countryInfo.flag})`,
            }}
          ></div>
          <div className="info-name">{country.country}</div>
          <div className="info-confirmed">
            Cases: {numeral(country.cases).format("0,0")}
          </div>
          <div className="info-active">
            Active: {numeral(country.active).format("0,0")}
          </div>
          <div className="info-recovered">
            Recovered: {numeral(country.recovered).format("0,0")}
          </div>
          <div className="info-deaths">
            Deaths: {numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));
