"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { database } from '@/lib/firebase';
import { ref, onValue, push, set, update } from 'firebase/database';
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
  const [donors, setDonors] = useState<Donor[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);

  useEffect(() => {
    const donorsRef = ref(database, 'donors');
    const requestsRef = ref(database, 'requests');
    const banksRef = ref(database, 'banks');

    const donorsListener = onValue(donorsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const donorsList = Object.keys(data).map(key => ({ ...data[key], id: key }));
        setDonors(donorsList);
      } else {
        // If no data, populate with mock data
        mockDonors.forEach(donor => {
            const newDonorRef = push(donorsRef);
            set(newDonorRef, { ...donor, id: newDonorRef.key });
        });
      }
    });

    const requestsListener = onValue(requestsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const requestsList = Object.keys(data).map(key => ({ ...data[key], id: key }));
        setRequests(requestsList);
      } else {
         mockRequests.forEach(request => {
            const newRequestRef = push(requestsRef);
            set(newRequestRef, { ...request, id: newRequestRef.key });
        });
      }
    });

    const banksListener = onValue(banksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const banksList = Object.keys(data).map(key => ({ ...data[key], id: key }));
        setBanks(banksList);
      } else {
        mockBanks.forEach(bank => {
            const newBankRef = push(banksRef);
            set(newBankRef, { ...bank, id: newBankRef.key });
        });
      }
    });

    return () => {
      donorsListener();
      requestsListener();
      banksListener();
    };
  }, []);


  const addDonor = (donor: Omit<Donor, 'id'>) => {
    const donorsRef = ref(database, 'donors');
    const newDonorRef = push(donorsRef);
    set(newDonorRef, {
      ...donor,
      id: newDonorRef.key
    });
  };

  const addRequest = (request: Omit<Request, 'id' | 'status'>) => {
    const requestsRef = ref(database, 'requests');
    const newRequestRef = push(requestsRef);
    set(newRequestRef, {
      ...request,
      id: newRequestRef.key,
      status: 'Pending' as const,
    });
  };

  const updateRequestStatus = (id: string, status: 'Pending' | 'Fulfilled') => {
    const requestRef = ref(database, `requests/${id}`);
    update(requestRef, { status });
  };
  
  const addBank = (bank: Omit<Bank, 'id'>) => {
    const banksRef = ref(database, 'banks');
    const newBankRef = push(banksRef);
    set(newBankRef, {
        ...bank,
        id: newBankRef.key
    });
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
