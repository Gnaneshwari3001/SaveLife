
"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { database, auth } from '@/lib/firebase';
import { ref, onValue, push, set, get, update } from 'firebase/database';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { mockDonors, mockRequests, mockBanks, Donor, Request, Bank } from '@/lib/data';
import { toast } from '@/hooks/use-toast';

interface AppContextType {
  currentUser: User | null;
  donors: Donor[];
  requests: Request[];
  banks: Bank[];
  addDonor: (donor: Omit<Donor, 'id'>) => void;
  addRequest: (request: Omit<Request, 'id' | 'status'>) => void;
  updateRequestStatus: (id: string, status: 'Pending' | 'Fulfilled') => void;
  addBank: (bank: Omit<Bank, 'id'>) => void;
  userSignOut: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initializeData = async (path: string, mockData: any[]) => {
    const dataRef = ref(database, path);
    const snapshot = await get(dataRef);
    if (!snapshot.exists() || !snapshot.hasChildren()) {
        console.log(`No data found at ${path}, populating with mock data.`);
        const updates: { [key: string]: any } = {};
        mockData.forEach(item => {
            const newKey = push(ref(database, path)).key;
            if(newKey) {
                updates[newKey] = item;
            }
        });
        await set(dataRef, updates);
    }
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
    });

    const initAndListen = async () => {
      await initializeData('donors', mockDonors);
      await initializeData('requests', mockRequests);
      await initializeData('banks', mockBanks);

      const donorsRef = ref(database, 'donors');
      const requestsRef = ref(database, 'requests');
      const banksRef = ref(database, 'banks');

      const donorsUnsubscribe = onValue(donorsRef, (snapshot) => {
        const data = snapshot.val();
        const loadedDonors = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
        setDonors(loadedDonors);
      });

      const requestsUnsubscribe = onValue(requestsRef, (snapshot) => {
        const data = snapshot.val();
        const loadedRequests = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
        setRequests(loadedRequests);
      });

      const banksUnsubscribe = onValue(banksRef, (snapshot) => {
        const data = snapshot.val();
        const loadedBanks = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
        setBanks(loadedBanks);
      });
      
      return () => {
        donorsUnsubscribe();
        requestsUnsubscribe();
        banksUnsubscribe();
      };
    };
    
    const dataUnsubscribePromise = initAndListen();

    return () => {
        unsubscribeAuth();
        dataUnsubscribePromise.then(unsub => unsub && unsub());
    };
  }, []);


  const addDonor = (donor: Omit<Donor, 'id'>) => {
    const donorsRef = ref(database, 'donors');
    const newDonorRef = push(donorsRef);
    set(newDonorRef, donor);
  };

  const addRequest = (request: Omit<Request, 'id' | 'status'>) => {
    const requestsRef = ref(database, 'requests');
    const newRequestRef = push(requestsRef);
    set(newRequestRef, {
      ...request,
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
    set(newBankRef, bank);
  };

  const userSignOut = async () => {
    try {
        await signOut(auth);
        toast({ title: 'Signed Out', description: 'You have been successfully signed out.' });
    } catch (error) {
        toast({ title: 'Error', description: 'Failed to sign out.', variant: 'destructive' });
    }
  }

  return (
    <AppContext.Provider value={{ currentUser, donors, requests, banks, addDonor, addRequest, updateRequestStatus, addBank, userSignOut }}>
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
