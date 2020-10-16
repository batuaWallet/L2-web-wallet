import React, { useEffect, useState } from "react";

import { Loading } from "./Loading";

export const Account = (props: { address: string }) => {

  const { address } = props;

  if (address) {
    return (
      <div>
        {address}
      </div>
    )
  } else {
    return <Loading />
  }

};
