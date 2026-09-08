// frontend/app/utils/apiMock.utils.ts

import type { GroupOutDto } from '~/types/groups.type';

/* =========================================================
   INTERFACES
========================================================= */

export interface MockUser {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  phone_number?: string;
  role?: string;
  joinedAt?: string;
  canViewDocuments?: boolean;
}

export interface MockDay {
  id: string;
  date: string;
  dayOfWeek: string;
}

export interface MockEvent {
  id: string;
  title: string;
  timeStart: string;
  timeEnd: string;
  isPrivate: boolean;
  description: string;
  location: string;
  creator: MockUser;
  members: MockUser[];
}

/* =========================================================
   MOCK DATA
========================================================= */

/* --- MOCK USERS --- */
export const MOCK_USERS: MockUser[] = [
  {
    id: 'u1',
    username: 'lehel_dev',
    email: 'lehel@example.com',
    avatar: null,
    phone_number: '+40 712 345 678',
    role: 'Leader',
    joinedAt: '2025-10-10',
    canViewDocuments: true,
  },
  {
    id: 'u2',
    username: 'john_doe',
    email: 'john@example.com',
    avatar: null,
    phone_number: '+1 555 012 3456',
    role: 'Member',
    joinedAt: '2026-01-05',
    canViewDocuments: false,
  },
  {
    id: 'u3',
    username: 'jane_smith',
    email: 'jane@example.com',
    avatar: null,
    phone_number: '+44 7700 900077',
    role: 'Member',
    joinedAt: '2026-02-15',
    canViewDocuments: true,
  },
  {
    id: 'u4',
    username: 'mike_wazowski',
    email: 'mike@example.com',
    avatar: null,
    phone_number: '+1 555 019 8765',
    role: 'Member',
    joinedAt: '2026-03-20',
    canViewDocuments: false,
  },
  {
    id: 'u5',
    username: 'sarah_connor',
    email: 'sarah@example.com',
    avatar: null,
    phone_number: '+1 555 010 1122',
    role: 'Member',
    joinedAt: '2026-04-10',
    canViewDocuments: true,
  },
  {
    id: 'u6',
    username: 'tom_hardy',
    email: 'tom@example.com',
    avatar: null,
    phone_number: '+44 7700 900123',
    role: 'Member',
    joinedAt: '2026-05-05',
    canViewDocuments: false,
  },
  {
    id: 'u7',
    username: 'emma_watson',
    email: 'emma@example.com',
    avatar: null,
    phone_number: '+44 7700 900456',
    role: 'Member',
    joinedAt: '2026-06-01',
    canViewDocuments: true,
  },
  {
    id: 'u8',
    username: 'bruce_wayne',
    email: 'bruce@example.com',
    avatar: null,
    phone_number: '+1 555 019 9999',
    role: 'Member',
    joinedAt: '2026-07-15',
    canViewDocuments: true,
  },
];

/* --- MOCK GROUPS --- */
export const MOCK_GROUPS: GroupOutDto[] = [
  {
    uuid: 'g1',
    name: 'WebGurus Hackathon',
    role: 'leader',
    current_size: 4,
    created_at: '2026-09-01',
  },
  {
    uuid: 'g2',
    name: 'Transylvania Road Trip',
    role: 'member',
    current_size: 8,
    created_at: '2026-08-15',
  },
];

/* --- MOCK DAYS --- */
export const MOCK_DAYS: Record<string, MockDay[]> = {
  // actual
  g1: [
    { id: 'd1_g1', date: '09.02', dayOfWeek: 'Wed' }, // past
    { id: 'd2_g1', date: '09.03', dayOfWeek: 'Thu' }, // current
    { id: 'd3_g1', date: '09.04', dayOfWeek: 'Fri' }, // future
  ],
  // fully expired
  g2: [
    { id: 'd1_g2', date: '08.20', dayOfWeek: 'Thu' },
    { id: 'd2_g2', date: '08.21', dayOfWeek: 'Fri' },
  ],
};

/* --- MOCK EVENTS --- */
export const MOCK_EVENTS: Record<string, MockEvent[]> = {
  // SEPTEMBER 2. (EXPIRED)
  d1_g1: [
    {
      id: 'e1',
      title: 'Pre-hackathon setup',
      timeStart: '18:00',
      timeEnd: '20:00',
      isPrivate: false,
      description: 'Setting up environments and repositories.',
      location: 'Discord Server',
      creator: MOCK_USERS[0]!,
      members: [MOCK_USERS[0]!, MOCK_USERS[1]!],
    },
  ],
  // SEPTEMBER 3. (TODAY)
  d2_g1: [
    {
      id: 'e2',
      title: 'Morning Sync',
      timeStart: '08:00',
      timeEnd: '09:00', // LEJÁRT (09:27 van)
      isPrivate: false,
      description: 'Quick standup before we start coding.',
      location: 'Google Meet',
      creator: MOCK_USERS[0]!,
      members: [MOCK_USERS[0]!, MOCK_USERS[1]!, MOCK_USERS[2]!],
    },
    {
      id: 'e3',
      title: 'Core Feature Dev',
      timeStart: '10:00',
      timeEnd: '14:00', // JÖVŐ/AKTÍV
      isPrivate: false,
      description: 'Developing the main scheduling logic.',
      location: 'Office Desk',
      creator: MOCK_USERS[1]!,
      members: [
        MOCK_USERS[0]!,
        MOCK_USERS[1]!,
        MOCK_USERS[2]!,
        MOCK_USERS[3]!,
        MOCK_USERS[4]!,
        MOCK_USERS[5]!,
      ],
    },
    {
      id: 'e4',
      title: 'Late Review',
      timeStart: '19:00',
      timeEnd: '20:00', // JÖVŐ
      isPrivate: true,
      description: 'Reviewing PRs alone.',
      location: 'Home',
      creator: MOCK_USERS[0]!,
      members: [MOCK_USERS[0]!],
    },
  ],
  // SEPTEMBER 4. (TOMORROW)
  d3_g1: [
    {
      id: 'e5',
      title: 'Project Demo',
      timeStart: '12:00',
      timeEnd: '14:00',
      isPrivate: false,
      description: 'Showcasing the app to stakeholders.',
      location: 'Main Conference Room',
      creator: MOCK_USERS[2]!,
      members: [MOCK_USERS[0]!, MOCK_USERS[1]!, MOCK_USERS[2]!],
    },
  ],
  // AUGUST 20. (EXPIRED)
  d1_g2: [
    {
      id: 'e6',
      title: 'Arrival & Check-in',
      timeStart: '14:00',
      timeEnd: '15:00',
      isPrivate: false,
      description: 'Check-in at the hotel.',
      location: 'Hotel Transylvania',
      creator: MOCK_USERS[0]!,
      members: [MOCK_USERS[0]!, MOCK_USERS[1]!],
    },
  ],
  d2_g2: [],
};

/* =========================================================
   SIMULATED API FUNCTIONS
========================================================= */

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchMockGroups = async (): Promise<GroupOutDto[]> => {
  await delay(600);
  return MOCK_GROUPS;
};

export const fetchMockDays = async (groupUuid: string): Promise<MockDay[]> => {
  await delay(400);
  return MOCK_DAYS[groupUuid] || [];
};

export const fetchMockEvents = async (dayId: string): Promise<MockEvent[]> => {
  await delay(400);
  return MOCK_EVENTS[dayId] || [];
};
