import React, { useEffect, useState, Fragment } from "react";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
  Box,
  Typography,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Table from "./Table";
import Map from "./Map";
import "./App.css";
import { sortData, prettyPrintStat } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 20.59, lng: 78.96 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    console.log("useeffect1");
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    console.log("useeffect2");

    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, //INDIA,UNITED STATE,FRANCE
            value: country.countryInfo.iso2, //IN,US,FR
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryName = event.target.value;
    const url =
      countryName === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryName}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryName);
        setCountryInfo(data);
        countryName === "worldwide"
          ? setMapCenter([20.59, 78.96])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  return (
    <Fragment>
      <div className="app-container">
        <div className="app">
          <div className="app__left">
            <div className="app__header">
              <h1>COVID-19 TRACKER</h1>
              <FormControl className="app__dropdown">
                <Select
                  variant="outlined"
                  onChange={onCountryChange}
                  value={country}
                >
                  <MenuItem value="worldwide">Worldwide</MenuItem>
                  {countries.map((country) => (
                    <MenuItem key={country.name} value={country.name}>
                      {country.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="app__stats">
              <InfoBox
                isRed
                active={casesType === "cases"}
                onClick={(e) => setCasesType("cases")}
                title="Confirmed"
                cases={prettyPrintStat(countryInfo.todayCases)}
                total={prettyPrintStat(countryInfo.cases)}
              />
              <InfoBox
                isBlue
                active={casesType === "active"}
                onClick={(e) => setCasesType("active")}
                title="Active"
                total={prettyPrintStat(countryInfo.active)}
              />

              <InfoBox
                isGreen
                active={casesType === "recovered"}
                onClick={(e) => setCasesType("recovered")}
                title="Recovered"
                cases={prettyPrintStat(countryInfo.todayRecovered)}
                total={prettyPrintStat(countryInfo.recovered)}
              />
              <InfoBox
                isBlack
                active={casesType === "deaths"}
                onClick={(e) => setCasesType("deaths")}
                title="Deaths"
                cases={prettyPrintStat(countryInfo.todayDeaths)}
                total={prettyPrintStat(countryInfo.deaths)}
              />
            </div>

            {/* Table */}
            {/* Graph */}

            <Map
              casesType={casesType}
              countries={mapCountries}
              center={mapCenter}
              zoom={mapZoom}
            />
          </div>
          <Card className="app__right">
            <CardContent>
              <h3>Live cases by Country</h3>
              <Table countries={tableData} />
              <h3 className="app__graphTitle">
                Daily New {casesType} In {country}
              </h3>
              <LineGraph
                className="app__graph"
                casesType={casesType}
                country={country}
              />
            </CardContent>
          </Card>
        </div>
        <Box clssName="app__footer" mt={4}>
          <Typography variant="body2" color="textSecondary">
            Developed By Suhail and Team From RDEC College
          </Typography>
        </Box>
      </div>
    </Fragment>
  );
}

export default App;
