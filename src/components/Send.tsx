import React, { useState, useContext } from "react";
import { Typography } from "@material-ui/core";
import QrReader from "react-qr-scanner";

export const Send = (props: any) => {
  const scanner = {
    height: 360,
    width: 522,
  };
  const [scan, setScan] = useState("");

  const handleScan = (data: any) => {
    setScan(data);
  };

  return (
    <>
      <Typography> Sending Payment </Typography>;
      <QrReader
        delay={100}
        style={scanner}
        onError={(err: any) => console.log(err)}
        onScan={handleScan}
      />
    </>
  )
};
