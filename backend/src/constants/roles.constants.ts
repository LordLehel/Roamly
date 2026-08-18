export const ROLES = {
  LEADER: 'leader',
  MEMBER: 'member',
  INVITEDLEADER: 'invitedLeader',
  INVITEDMEMBER: 'invitedMember',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
