// Tab System
export type TabRole = 'customer' | 'organization' | 'admin';
export interface TabDefinition {
  id: string;
  labelKo: string;
  labelEn: string;
  href: string;
  role: TabRole;
  roleBadgeKo: string;
  roleBadgeEn: string;
  icon: string; // lucide icon name
  hidden?: boolean;
}

// Organizations
export type OrgCategory = 'all' | 'children' | 'environment' | 'animals' | 'elderly' | 'medical';
export interface Organization {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  category: Exclude<OrgCategory, 'all'>;
  donorCount: number;
  monthlyAmount: number;
  mission: string;
  missionEn: string;
  impactDescriptions: { amount: number; descriptionKo: string; descriptionEn: string }[];
  fundUsage: { category: string; categoryEn: string; percentage: number; color: string }[];
}

// Donations
export type DonationType = 'onetime' | 'recurring';
export type PaymentMethod = 'card' | 'bank' | 'kakaopay' | 'naverpay' | 'toss';
export interface DonationRecord {
  id: string;
  date: string;
  organizationName: string;
  organizationNameEn: string;
  amount: number;
  type: DonationType;
  receiptId: string;
}
export interface RecentDonorTicker {
  id: string;
  name: string; // anonymized like "김**"
  orgName: string;
  orgNameEn: string;
  amount: number;
  timeAgo: string;
  timeAgoEn: string;
}

// Tax
export interface TaxSummary {
  year: number;
  totalDonations: number;
  taxDeductionEligible: number;
  donationCount: number;
  previousYearTotal: number;
}
export interface MonthlyDonationTrend {
  month: string;
  monthEn: string;
  amount: number;
}

// Accounting
export type TransactionType = 'income' | 'expense';
export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  description: string;
  descriptionEn: string;
  category: string;
  categoryEn: string;
  amount: number;
}
export interface MonthlyFinancial {
  month: string;
  monthEn: string;
  income: number;
  expense: number;
  budget: number;
}
export interface BudgetCategory {
  category: string;
  categoryEn: string;
  budget: number;
  actual: number;
  color: string;
}
export interface Report {
  id: string;
  titleKo: string;
  titleEn: string;
  descriptionKo: string;
  descriptionEn: string;
  icon: string;
  downloadType: 'pdf' | 'excel' | 'link';
}

// Marketing / Donors
export interface DonorAgeData {
  ageGroup: string;
  ageGroupEn: string;
  value: number;
  color: string;
}
export interface DonorRegionData {
  region: string;
  regionEn: string;
  value: number;
  color: string;
}
export interface RetentionFunnelStage {
  stage: string;
  stageEn: string;
  count: number;
  rate: number;
  color: string;
}
export interface Campaign {
  id: string;
  nameKo: string;
  nameEn: string;
  period: string;
  reach: number;
  engagement: number;
  conversions: number;
  status: 'active' | 'completed' | 'planned';
}
export interface ContentCalendarItem {
  id: string;
  date: string;
  titleKo: string;
  titleEn: string;
  platform: 'instagram' | 'facebook' | 'newsletter' | 'youtube';
  status: 'published' | 'scheduled' | 'draft';
}
export interface SNSPlatform {
  id: string;
  name: string;
  connected: boolean;
  handle?: string;
  followerCount?: number;
  icon: string;
}

// Fee Management
export type OrgActivityStatus = 'active' | 'declining' | 'churned';
export interface OrgFee {
  rank: number;
  orgName: string;
  orgNameEn: string;
  totalDonations: number;
  feeRate: number;
  feeAmount: number;
  donorCount: number;
  activityStatus: OrgActivityStatus;
}
export interface FeeTier {
  nameKo: string;
  nameEn: string;
  rate: number;
  descriptionKo: string;
  descriptionEn: string;
  servicesKo: string[];
  servicesEn: string[];
  color: string;
  badgeKo: string;
  badgeEn: string;
}
export interface RevenueDataPoint {
  month: string;
  monthEn: string;
  feeRevenue: number;
  totalDonations: number;
}

// HR
export type EmployeeStatus = 'active' | 'leave' | 'resigned';
export interface Employee {
  id: string;
  name: string;
  nameEn: string;
  position: string;
  positionEn: string;
  department: string;
  departmentEn: string;
  email: string;
  phone: string;
  status: EmployeeStatus;
  joinDate: string;
  bio?: string;
  bioEn?: string;
  skills?: string[];
}
export interface AttendanceRecord {
  employeeId: string;
  employeeName: string;
  presentDays: number;
  lateDays: number;
  absentDays: number;
  vacationUsed: number;
  vacationRemaining: number;
}
export interface DailyAttendance {
  date: string;
  present: number;
  late: number;
  absent: number;
  total: number;
}
export interface PayrollEntry {
  employeeId: string;
  employeeName: string;
  employeeNameEn: string;
  department: string;
  departmentEn: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netPay: number;
}
export interface Department {
  id: string;
  nameKo: string;
  nameEn: string;
  head: string;
  headEn: string;
  employeeCount: number;
  budget: number;
  budgetUtilization: number;
  members: { name: string; nameEn: string; position: string; positionEn: string }[];
}
