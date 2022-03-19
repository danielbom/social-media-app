import React, { useMemo, useState } from "react";

export const RoutingContext = React.createContext({
  privateEnabled: false,
  authorize: () => { },
  unauthorize: () => { },
});

export const RoutingProvider: React.FC = ({ children }) => {
  const [privateEnabled, setPrivateEnabled] = useState(false);

  const value = useMemo(() => ({
    privateEnabled,
    authorize() {
      setPrivateEnabled(true);
    },
    unauthorize() {
      setPrivateEnabled(false);
    }
  }), [privateEnabled]);

  return (
    <RoutingContext.Provider value={value}>
      {children}
    </RoutingContext.Provider>
  )
}
