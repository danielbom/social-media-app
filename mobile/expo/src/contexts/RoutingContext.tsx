import React, { useState } from "react";

export const RoutingContext = React.createContext({
  privateEnabled: false,
  authorize: () => { },
  unauthorize: () => { },
});

export const RoutingProvider: React.FC = ({ children }) => {
  const [privateEnabled, setPrivateEnabled] = useState(false);

  function authorize() {
    setPrivateEnabled(true);
  }

  function unauthorize() {
    setPrivateEnabled(false);
  }

  return (
    <RoutingContext.Provider value={{ privateEnabled, authorize, unauthorize }}>
      {children}
    </RoutingContext.Provider>
  )
}
