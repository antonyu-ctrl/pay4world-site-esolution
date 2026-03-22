// Point transactions
export const pointHistory = [
  { id: 'pt-1', date: '2026-03-20', description: '초록별 환경재단 기부', descriptionEn: 'Green Star Foundation donation', type: 'earn' as const, points: 500, balance: 12500 },
  { id: 'pt-2', date: '2026-03-15', description: '기부 뱃지 교환 - 환경 지킴이', descriptionEn: 'Badge exchange - Eco Guardian', type: 'use' as const, points: -1000, balance: 12000 },
  { id: 'pt-3', date: '2026-03-10', description: '희망나래 아동재단 정기 기부', descriptionEn: 'Hope Wings monthly donation', type: 'earn' as const, points: 1000, balance: 13000 },
  { id: 'pt-4', date: '2026-03-05', description: '사랑의동물보호소 기부', descriptionEn: 'Love Animal Shelter donation', type: 'earn' as const, points: 300, balance: 12000 },
  { id: 'pt-5', date: '2026-03-01', description: '월간 출석 보너스', descriptionEn: 'Monthly attendance bonus', type: 'earn' as const, points: 200, balance: 11700 },
  { id: 'pt-6', date: '2026-02-28', description: '감사 편지 교환', descriptionEn: 'Thank you letter exchange', type: 'use' as const, points: -500, balance: 11500 },
  { id: 'pt-7', date: '2026-02-20', description: '건강나눔 의료재단 기부', descriptionEn: 'Health Sharing Foundation donation', type: 'earn' as const, points: 500, balance: 12000 },
  { id: 'pt-8', date: '2026-02-15', description: '정기 기부 3개월 연속 보너스', descriptionEn: '3-month recurring bonus', type: 'earn' as const, points: 500, balance: 11500 },
  { id: 'pt-9', date: '2026-02-10', description: '실버케어 복지재단 기부', descriptionEn: 'Silver Care Foundation donation', type: 'earn' as const, points: 300, balance: 11000 },
  { id: 'pt-10', date: '2026-02-01', description: '소아암 완치기금 기부', descriptionEn: 'Pediatric Cancer Fund donation', type: 'earn' as const, points: 1000, balance: 10700 },
  { id: 'pt-11', date: '2026-01-25', description: '새해 특별 보너스', descriptionEn: 'New Year special bonus', type: 'earn' as const, points: 500, balance: 9700 },
  { id: 'pt-12', date: '2026-01-15', description: '초록별 환경재단 기부', descriptionEn: 'Green Star Foundation donation', type: 'earn' as const, points: 500, balance: 9200 },
];

// Reward items
export const rewardItems = [
  { id: 'rw-1', nameKo: '기부 감사 편지', nameEn: 'Donation Thank You Letter', descKo: '단체로부터 받는 손편지', descEn: 'Handwritten letter from organization', points: 500, category: 'experience', available: true },
  { id: 'rw-2', nameKo: '환경 에코백', nameEn: 'Eco Tote Bag', descKo: '친환경 소재 에코백', descEn: 'Eco-friendly tote bag', points: 2000, category: 'goods', available: true },
  { id: 'rw-3', nameKo: '봉사활동 참여권', nameEn: 'Volunteer Activity Pass', descKo: '단체 봉사활동 우선 참여', descEn: 'Priority access to volunteer activities', points: 1500, category: 'experience', available: true },
  { id: 'rw-4', nameKo: '기부 인증서', nameEn: 'Donation Certificate', descKo: '연간 기부 활동 인증서', descEn: 'Annual donation activity certificate', points: 1000, category: 'certificate', available: true },
  { id: 'rw-5', nameKo: '단체 굿즈 세트', nameEn: 'Organization Goods Set', descKo: '텀블러 + 스티커 세트', descEn: 'Tumbler + sticker set', points: 3000, category: 'goods', available: true },
  { id: 'rw-6', nameKo: 'VIP 후원자 행사 초대', nameEn: 'VIP Donor Event Invitation', descKo: '연례 후원자 감사 행사', descEn: 'Annual donor appreciation event', points: 5000, category: 'experience', available: false },
];

// Badges
export const badges = [
  { id: 'bg-1', nameKo: '첫 기부', nameEn: 'First Donation', descKo: '첫 번째 기부를 완료했습니다', descEn: 'Completed your first donation', icon: '🎉', earned: true, earnedDate: '2024-06-15' },
  { id: 'bg-2', nameKo: '정기 후원자', nameEn: 'Regular Supporter', descKo: '3개월 연속 정기 기부', descEn: '3 consecutive months of regular giving', icon: '💎', earned: true, earnedDate: '2024-09-01' },
  { id: 'bg-3', nameKo: '환경 지킴이', nameEn: 'Eco Guardian', descKo: '환경 단체에 5회 이상 기부', descEn: 'Donated to environmental orgs 5+ times', icon: '🌿', earned: true, earnedDate: '2025-03-10' },
  { id: 'bg-4', nameKo: '나눔 챔피언', nameEn: 'Sharing Champion', descKo: '총 기부금 100만원 달성', descEn: 'Total donations reached 1M KRW', icon: '🏆', earned: true, earnedDate: '2025-08-20' },
  { id: 'bg-5', nameKo: '다재다능 기부자', nameEn: 'Versatile Donor', descKo: '3개 이상 카테고리에 기부', descEn: 'Donated to 3+ categories', icon: '🌈', earned: true, earnedDate: '2025-11-05' },
  { id: 'bg-6', nameKo: '월간 기부왕', nameEn: 'Monthly Top Donor', descKo: '월간 기부 금액 TOP 10', descEn: 'Monthly donation amount TOP 10', icon: '👑', earned: false, earnedDate: null },
  { id: 'bg-7', nameKo: '1년 연속 기부', nameEn: '1-Year Streak', descKo: '12개월 연속 기부 유지', descEn: '12 consecutive months of donations', icon: '🔥', earned: false, earnedDate: null },
  { id: 'bg-8', nameKo: '사회 공헌 리더', nameEn: 'Social Impact Leader', descKo: '총 기부금 500만원 달성', descEn: 'Total donations reached 5M KRW', icon: '⭐', earned: false, earnedDate: null },
];

// Grade tiers
export const gradeTiers = [
  {
    id: 'bronze',
    nameKo: '브론즈',
    nameEn: 'Bronze',
    minPoints: 0,
    maxPoints: 5000,
    color: '#CD7F32',
    benefitsKo: ['기본 포인트 적립', '기부 영수증 발급'],
    benefitsEn: ['Basic point earning', 'Donation receipt issuance'],
  },
  {
    id: 'silver',
    nameKo: '실버',
    nameEn: 'Silver',
    minPoints: 5000,
    maxPoints: 15000,
    color: '#C0C0C0',
    benefitsKo: ['포인트 1.5배 적립', '월간 뉴스레터', '우선 봉사활동 참여'],
    benefitsEn: ['1.5x point earning', 'Monthly newsletter', 'Priority volunteer access'],
  },
  {
    id: 'gold',
    nameKo: '골드',
    nameEn: 'Gold',
    minPoints: 15000,
    maxPoints: 50000,
    color: '#FFD700',
    benefitsKo: ['포인트 2배 적립', '전용 이벤트 초대', 'VIP 고객 지원', '특별 굿즈 제공'],
    benefitsEn: ['2x point earning', 'Exclusive event invitations', 'VIP support', 'Special merchandise'],
  },
  {
    id: 'platinum',
    nameKo: '플래티넘',
    nameEn: 'Platinum',
    minPoints: 50000,
    maxPoints: 999999,
    color: '#E5E4E2',
    benefitsKo: ['포인트 3배 적립', '연례 감사 행사 초대', '1:1 전담 매니저', '세무 컨설팅 무료'],
    benefitsEn: ['3x point earning', 'Annual gala invitation', 'Dedicated account manager', 'Free tax consulting'],
  },
];
