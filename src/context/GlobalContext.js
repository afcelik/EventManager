import { createContext, useState } from 'react';

export const AppContext = createContext();

const AppContextProvider = ({ context }) => {


  return (
    <AppContext.Provider
      value={{  }}
    >
      {context}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
