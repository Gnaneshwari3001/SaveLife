
export type Donor = {
  id: string;
  userId: string;
  name: string;
  bloodGroup: string;
  lastDonation: string;
  email: string;
  phone: string;
};

export type Request = {
  id: string;
  userId: string;
  patientName: string;
  bloodGroup: string;
  units: number;
  hospital: string;
  status: 'Pending' | 'Fulfilled';
  urgency: 'Urgent' | 'Standard' | 'Within a Week';
};

export type Bank = {
  id: string;
  name: string;
  location: string;
  contact: string;
};


export const mockDonors: Omit<Donor, 'id'>[] = [
  { userId: 'mock_user_1', name: 'Alice Johnson', bloodGroup: 'A+', lastDonation: '2024-05-10', email: 'alice@example.com', phone: '111-222-3333' },
  { userId: 'mock_user_2', name: 'Bob Williams', bloodGroup: 'O-', lastDonation: '2024-04-22', email: 'bob@example.com', phone: '222-333-4444' },
  { userId: 'mock_user_3', name: 'Charlie Brown', bloodGroup: 'B+', lastDonation: '2024-06-01', email: 'charlie@example.com', phone: '333-444-5555' },
  { userId: 'mock_user_4', name: 'Diana Miller', bloodGroup: 'AB+', lastDonation: '2023-12-15', email: 'diana@example.com', phone: '444-555-6666' },
];

export const mockRequests: Omit<Request, 'id' | 'status'>[] = [
  { userId: 'mock_user_1', patientName: 'Eve Davis', bloodGroup: 'A+', units: 2, hospital: 'City General', urgency: 'Urgent' },
  { userId: 'mock_user_2', patientName: 'Frank White', bloodGroup: 'O-', units: 1, hospital: 'St. Mary\'s', urgency: 'Standard' },
  { userId: 'mock_user_3', patientName: 'Grace Lee', bloodGroup: 'B+', units: 3, hospital: 'County Hospital', urgency: 'Urgent' },
];

export const mockBanks: Omit<Bank, 'id'>[] = [
  { name: 'City Central Blood Bank', location: 'New York, NY', contact: '123-456-7890' },
  { name: 'Hope Donation Center', location: 'Los Angeles, CA', contact: '987-654-3210' },
  { name: 'Downtown Blood Services', location: 'Chicago, IL', contact: '555-123-4567' },
];
