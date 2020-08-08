import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";

function InfoBox({
  title,
  cases,
  isRed,
  isBlue,
  isGreen,
  isBlack,
  active,
  total,
  ...props
}) {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"} ${
        isRed && "infoBox--red"
      } ${isBlue && "infoBox--blue"} ${isGreen && "infoBox--green"} ${
        isBlack && "infoBox--black"
      }`}
    >
      <CardContent>
        {/* Coronavirus cases */}
        <Typography className="infoBox__title">{title}</Typography>

        {/* Number cases */}
        {!isBlue && (
          <h2
            className={`infoBox__cases ${isRed && "infoBox__cases--red"} ${
              isGreen && "infoBox__cases--green"
            } ${isBlack && "infoBox__cases--black"}`}
          >
            {`+${cases}`}
          </h2>
        )}

        {/* Total cases */}
        <h2
          className={`infoBox__total ${isRed && "infoBox__total--red"} ${
            isGreen && "infoBox__total--green"
          } ${isBlack && "infoBox__total--black"} ${
            isBlue && "infoBox__total--blue"
          }`}
        >
          {total} Total
        </h2>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
