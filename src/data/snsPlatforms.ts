import type { SNSPlatform } from '@/types';

export const snsPlatforms: SNSPlatform[] = [
  {
    id: 'sns-001',
    name: 'Instagram',
    connected: true,
    handle: '@greenstar_official',
    followerCount: 2340,
    icon: 'instagram',
  },
  {
    id: 'sns-002',
    name: 'Facebook',
    connected: true,
    handle: '초록별 환경재단',
    followerCount: 1890,
    icon: 'facebook',
  },
  {
    id: 'sns-003',
    name: 'KakaoTalk Channel',
    connected: false,
    icon: 'message-circle',
  },
  {
    id: 'sns-004',
    name: 'YouTube',
    connected: false,
    icon: 'youtube',
  },
];
