import React, { createContext, useEffect, useState } from 'react';
import Keycloak from 'keycloak-js';

const KeycloakContext = createContext();

const keycloakInstance = new Keycloak({
  url: GLOBAL_VARIABLES.keycloakUrl,
  realm: GLOBAL_VARIABLES.keycloakRealm,
  clientId: GLOBAL_VARIABLES.keycloakClientId,
});

export const useKeycloak = {
  callLogout: () => keycloakInstance.logout(),
};

export const KeycloakProvider = ({ children }) => {
  const [keycloak, setKeycloak] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    keycloakInstance
      .init({
        onLoad: 'login-required',
        promiseType: 'native', // eslint-disable-next-line
    }).then((auth) => { 
      setKeycloak(keycloakInstance);
        setAuthenticated(authenticated);
      })
      .catch((error) =>
        console.error('Keycloak initialization failed:', error)
      );
  }, []);

  return (
    <KeycloakContext.Provider value={keycloak}>
      {children}
    </KeycloakContext.Provider>
  );
};
