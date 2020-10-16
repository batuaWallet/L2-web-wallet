import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
} from "@material-ui/core";

import { Loading } from "./Loading";

const QRCode = require('qrcode.react');

export const Account = (props: { address: string }) => {

  const { address } = props;

  if (address) {
    return (
      <div>
        <Card>
          <CardHeader subheader={address} />
          <CardContent>
            <QRCode value={address} />
          </CardContent>
        </Card>
      </div>
    )
  } else {
    return <Loading />
  }

};
