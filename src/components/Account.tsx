import React, { useEffect, useState } from "react";
import { Loading } from "./Loading";

const QRCode = require('qrcode.react');

export const Account = (props: { address: string }) => {

  const { address } = props;

  if (address) {
    return (
      <div>
        {address}
        <QRCode value={address} />
      </div>
    )
  } else {
    return <Loading />
  }

};
