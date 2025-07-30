"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockDonors, mockRequests, mockBanks, Donor, Request, Bank } from '@/lib/data';

interface AppContextType {
  donors: Donor[];
  requests: Request[];
  banks: Bank[];
  addDonor: (donor: Omit<Donor, 'id'>) => void;
  addRequest: (request: Omit<Request, 'id' | 'status'>) => void;
  updateRequestStatus: (id: string, status: 'Pending' | 'Fulfilled') => void;
  addBank: (bank: Omit<Bank, 'id'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [donors, setDonors] = useState<Donor[]>(mockDonors);
  const [requests, setRequests] = useState<Request[]>(mockRequests);
  const [banks, setBanks] = useState<Bank[]>(mockBanks);

  const addDonor = (donor: Omit<Donor, 'id'>) => {
    const newDonor = {
      ...donor,
      id: `D${String(donors.length + 1).padStart(3, '0')}`,
    };
    setDonors(prev => [...prev, newDonor]);
  };

  const addRequest = (request: Omit<Request, 'id' | 'status'>) => {
    const newRequest = {
      ...request,
      id: `R${String(requests.length + 1).padStart(3, '0')}`,
      status: 'Pending' as const,
    };
    setRequests(prev => [...prev, newRequest]);
  };

  const updateRequestStatus = (id: string, status: 'Pending' | 'Fulfilled') => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };
  
  const addBank = (bank: Omit<Bank, 'id'>) => {
    const newBank = {
      ...bank,
      id: `B${String(banks.length + 1).padStart(3, '0')}`,
    };
    setBanks(prev => [...prev, newBank]);
  };

  return (
    <AppContext.Provider value={{ donors, requests, banks, addDonor, addRequest, updateRequestStatus, addBank }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
