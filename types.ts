
export enum Tier {
  MEMBER = 'Member',
  SEEKER = 'Seeker',
  WAYFARER = 'Wayfarer',
  JOURNEYER = 'Journeyer',
  ARTISAN = 'Artisan',
  WARDEN = 'Warden',
  KEYSTONE = 'Keystone'
}

export enum Domain {
  SKILL = 'Skill',
  SERVICE = 'Service',
  KNOWLEDGE = 'Knowledge',
  ETHICS = 'Ethics',
  SOCIETY = 'Society',
  ENVIRONMENT = 'Environment',
  IDEOLOGY = 'Ideology'
}

export enum Difficulty {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5
}

export type BadgeShape = 'circle' | 'square' | 'rectangle';

export interface BadgeRequirement {
  id: string;
  description: string;
  isCompleted: boolean;
  evidenceUrl?: string;
  evidenceNote?: string;
  requireAttachment: boolean;
  requireNote: boolean;
}

export type DesignChoice = 'upload' | 'request' | 'template';

export interface UsefulLink {
  label: string;
  url: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  domain: Domain;
  secondaryDomains?: Domain[];
  difficulty: Difficulty;
  requirements: BadgeRequirement[];
  reflections: string;
  evidenceUrls: string[];
  isVerified: boolean;
  isUserCreated: boolean;
  creatorId?: string; // 'guildmaster' or user.id
  icon?: string;
  designChoice: DesignChoice;
  visualAssetUrl?: string;
  badgeShape: BadgeShape;
  usefulLinks?: UsefulLink[];
  partnerName?: string;
  isPartnership?: boolean;
}

export type CouncilStatus = 'pending' | 'approved' | 'rejected' | 'needs_info';

export interface LinkSuggestion {
  id: string;
  badgeId: string;
  badgeTitle: string;
  userId: string;
  userName: string;
  label: string;
  url: string;
  status: CouncilStatus;
  submittedAt: string;
}

export interface PartnershipRequest {
  id: string;
  userId: string;
  userName: string;
  partnerName: string;
  partnerType: 'Organization' | 'Creator' | 'Institution';
  description: string;
  websiteUrl?: string;
  status: CouncilStatus;
  submittedAt: string;
}

export interface PhysicalBadgeRequest {
  id: string;
  userId: string;
  badgeId: string;
  badgeTitle: string;
  status: CouncilStatus;
  cost: number;
  submittedAt: string;
}

export interface ActionStatement {
  requirementId: string;
  requirementTitle: string;
  intent: string;
  difficulties: string;
  lessons: string;
  referenceContact: string; 
}

export interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  badgeId: string;
  badgeTitle: string;
  submittedAt: string;
  status: CouncilStatus;
  rejectionReason?: string;
}

export interface PromotionRequest {
  id: string;
  userId: string;
  userName: string;
  targetTier: Tier;
  supportingBadgeIds: string[];
  actionStatements: ActionStatement[];
  status: CouncilStatus;
  councilFeedback?: string;
  submittedAt: string;
}

export interface BadgeProposal {
  id: string;
  userId: string;
  userName: string;
  badge: Badge;
  goal: string;
  metrics: string;
  status: CouncilStatus;
  rejectionReason?: string;
  submittedAt: string;
}

export interface ColonyEvent {
  id: string;
  colonyId: string;
  title: string;
  description: string;
  date: string;
  creatorName: string;
  attendees: string[]; // user names for simplicity
}

export interface ColonyNotice {
  id: string;
  colonyId: string;
  author: string;
  content: string;
  timestamp: string;
}

export interface Colony {
  id: string;
  name: string;
  number: number;
  siege: string;
  charter: string;
  membersCount: number;
  isApproved: boolean;
  notices: ColonyNotice[];
  events: ColonyEvent[];
}

export interface PrivacySettings {
  storageLocation: 'local' | 'personal_cloud' | 'guild_sync';
  isEncrypted: boolean;
  autoSync: boolean;
}

export interface SecurityCredentials {
  publicKey: string;
  privateKeyHash: string;
  lastBackup: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  tier: Tier;
  badges: Badge[];
  showcasedBadgeIds: string[];
  colonyId?: string;
  isScholarshipRecipient: boolean;
  prefPhysicalBadge: boolean;
  mentorshipCount: number;
  serviceMilestones: number;
  privacy: PrivacySettings;
  security?: SecurityCredentials;
  claimedFreePhysicalBadgeIds: string[]; // Track which badges got their free physical copy
}

export interface TierRequirement {
  id: string;
  description: string;
  needsStatement: boolean;
}

export interface AppState {
  user: UserProfile;
  badgesLibrary: Badge[];
  colonies: Colony[];
  accessFundBalance: number;
  verificationRequests: VerificationRequest[];
  badgeProposals: BadgeProposal[];
  promotionRequests: PromotionRequest[];
  linkSuggestions: LinkSuggestion[];
  partnershipRequests: PartnershipRequest[];
  physicalBadgeRequests: PhysicalBadgeRequest[];
}
