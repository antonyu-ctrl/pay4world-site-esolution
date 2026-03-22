import type { DonorAgeData, DonorRegionData, RetentionFunnelStage } from '@/types';

export const donorAgeData: DonorAgeData[] = [
  { ageGroup: '20대', ageGroupEn: '20s', value: 15, color: '#3B82F6' },
  { ageGroup: '30대', ageGroupEn: '30s', value: 28, color: '#10B981' },
  { ageGroup: '40대', ageGroupEn: '40s', value: 25, color: '#F59E0B' },
  { ageGroup: '50대', ageGroupEn: '50s', value: 18, color: '#8B5CF6' },
  { ageGroup: '60대', ageGroupEn: '60s', value: 10, color: '#EF4444' },
  { ageGroup: '70대+', ageGroupEn: '70s+', value: 4, color: '#6B7280' },
];

export const donorRegionData: DonorRegionData[] = [
  { region: '서울', regionEn: 'Seoul', value: 35, color: '#3B82F6' },
  { region: '경기', regionEn: 'Gyeonggi', value: 22, color: '#10B981' },
  { region: '부산', regionEn: 'Busan', value: 12, color: '#F59E0B' },
  { region: '대구', regionEn: 'Daegu', value: 8, color: '#8B5CF6' },
  { region: '인천', regionEn: 'Incheon', value: 7, color: '#EF4444' },
  { region: '대전', regionEn: 'Daejeon', value: 5, color: '#EC4899' },
  { region: '광주', regionEn: 'Gwangju', value: 4, color: '#14B8A6' },
  { region: '기타', regionEn: 'Others', value: 7, color: '#6B7280' },
];

export const retentionFunnel: RetentionFunnelStage[] = [
  {
    stage: '신규 방문',
    stageEn: 'New Visitors',
    count: 10000,
    rate: 100,
    color: '#3B82F6',
  },
  {
    stage: '첫 기부',
    stageEn: 'First Donation',
    count: 2500,
    rate: 25,
    color: '#10B981',
  },
  {
    stage: '재기부',
    stageEn: 'Repeat Donation',
    count: 1200,
    rate: 48,
    color: '#F59E0B',
  },
  {
    stage: '정기후원',
    stageEn: 'Regular Sponsor',
    count: 480,
    rate: 40,
    color: '#8B5CF6',
  },
];
