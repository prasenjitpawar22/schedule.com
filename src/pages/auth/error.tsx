import React, { ReactElement } from "react";

const error = () => {
  return <div>error</div>;
};

export default error;

error.getLayout = function getLayout(page: ReactElement) {
  return <div> {page} </div>;
};
