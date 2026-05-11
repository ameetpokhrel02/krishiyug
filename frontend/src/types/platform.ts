export type UserRole = 'ADMIN' | 'PALIKA_OFFICER' | 'INSURANCE_OFFICER' | 'FARMER';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  organizationId?: string; // Links to Insurance Company or Municipality
}

export interface Organization {
  id: string;
  name: string;
  type: 'INSURANCE_COMPANY' | 'PALIKA';
  district: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface Policy {
  id: string;
  title: string;
  category: 'CROP' | 'LIVESTOCK';
  description: string;
  premiumRate: number; // Percentage or Flat
  coverageAmount: number;
  insuranceCompanyId: string;
  insuranceCompanyName?: string;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
}

export interface Claim {
  id: string;
  farmerId: string;
  farmerName: string;
  policyId: string;
  policyTitle: string;
  amount: number;
  status: 'PENDING' | 'VERIFIED' | 'APPROVED' | 'REJECTED' | 'PAID';
  riskScore: number;
  tagNumber?: string; // Livestock tag ID
  multimedia: {
    type: 'IMAGE' | 'VIDEO';
    url: string;
  }[];
  verificationReport?: string;
  createdAt: string;
  district: string;
}
