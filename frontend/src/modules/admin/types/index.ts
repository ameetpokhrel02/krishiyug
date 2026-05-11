export type UserRole = 'ADMIN' | 'PALIKA_OFFICER' | 'INSURANCE_OFFICER' | 'FARMER' | 'WITNESS';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  organizationId?: string;
}

export interface Organization {
  id: string;
  name: string;
  type: 'PALIKA' | 'INSURANCE_COMPANY';
  district: string;
  municipality?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface Claim {
  id: string;
  farmerId: string;
  farmerName: string;
  amount: number;
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'FLAGGED';
  riskScore: number;
  createdAt: string;
  district: string;
}

export interface FraudAlert {
  id: string;
  claimId: string;
  reason: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'OPEN' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
}
