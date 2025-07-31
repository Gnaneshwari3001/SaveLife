
"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { database, auth } from '@/lib/firebase';
import { ref, onValue, push, set, get, update, remove } from 'firebase/database';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { Donor, Request, Bank } from '@/lib/data';
import { toast } from '@/hooks/use-toast';

interface UserProfile {
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

interface AppContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  donors: Donor[];
  requests: Request[];
  banks: Bank[];
  addDonor: (donor: Omit<Donor, 'id'>) => void;
  updateDonor: (id: string, donor: Omit<Donor, 'id'>) => void;
  deleteDonor: (id: string) => void;
  addRequest: (request: Omit<Request, 'id' | 'status'>) => void;
  updateRequest: (id: string, request: Omit<Request, 'id'>) => void;
  deleteRequest: (id: string) => void;
  updateRequestStatus: (id: string, status: 'Pending' | 'Fulfilled') => void;
  addBank: (bank: Omit<Bank, 'id'>) => void;
  userSignOut: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
        setCurrentUser(user);
        if (user) {
            const userRef = ref(database, 'users/' + user.uid);
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                setUserProfile(snapshot.val() as UserProfile);
            } else {
                setUserProfile(null);
            }
        } else {
            setUserProfile(null);
        }
        setLoading(false);
    });

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
      unsubscribeAuth();
      donorsUnsubscribe();
      requestsUnsubscribe();
      banksUnsubscribe();
    };
  }, []);


  const addDonor = (donor: Omit<Donor, 'id'>) => {
    const donorsRef = ref(database, 'donors');
    const newDonorRef = push(donorsRef);
    set(newDonorRef, donor);
  };
  
  const updateDonor = (id: string, donor: Omit<Donor, 'id'>) => {
    const donorRef = ref(database, `donors/${id}`);
    update(donorRef, donor);
  };
  
  const deleteDonor = (id: string) => {
    const donorRef = ref(database, `donors/${id}`);
    remove(donorRef);
  }

  const addRequest = (request: Omit<Request, 'id' | 'status'>) => {
    const requestsRef = ref(database, 'requests');
    const newRequestRef = push(requestsRef);
    set(newRequestRef, {
      ...request,
      status: 'Pending' as const,
    });
  };

  const updateRequest = (id: string, request: Omit<Request, 'id'>) => {
    const requestRef = ref(database, `requests/${id}`);
    update(requestRef, request);
  }

  const deleteRequest = (id: string) => {
    const requestRef = ref(database, `requests/${id}`);
    remove(requestRef);
  }

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
  
  const value = {
    currentUser,
    userProfile,
    donors,
    requests,
    banks,
    addDonor,
    updateDonor,
    deleteDonor,
    addRequest,
    updateRequest,
    deleteRequest,
    updateRequestStatus,
    addBank,
    userSignOut
  };

  return (
    <AppContext.Provider value={value}>
      {!loading && children}
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
