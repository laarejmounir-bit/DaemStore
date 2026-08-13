import React, { createContext, useContext } from 'react';
import { useServices, ICON_MAP } from '../hooks/useServices';

export const ServicesContext = createContext<{
  services: any[];
  loading: boolean;
  addService: (service: any) => Promise<void>;
  updateService: (id: string, data: any) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
}>({
  services: [],
  loading: true,
  addService: async () => {},
  updateService: async () => {},
  deleteService: async () => {},
});

export const useAppServices = () => useContext(ServicesContext);

export const ServicesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { services, loading, addService, updateService, deleteService } = useServices();

  return (
    <ServicesContext.Provider value={{ services, loading, addService, updateService, deleteService }}>
      {children}
    </ServicesContext.Provider>
  );
};

export { ICON_MAP };
