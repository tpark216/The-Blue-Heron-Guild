
import { Domain, Difficulty, Badge, Tier, Colony, TierRequirement } from './types';

export const TIER_ASCENSION_MAP: Record<Tier, TierRequirement[]> = {
  [Tier.MEMBER]: [], // Starting Tier
  [Tier.SEEKER]: [
    { id: 'ts-k1', description: 'Master Ethics Keystone: "The Core Covenant"', needsStatement: false },
    { id: 'ts-k2', description: 'Master Society Keystone: "Communal Genealogies"', needsStatement: false },
    { id: 'ts-o1', description: 'Complete Seeker Onboarding Orientation', needsStatement: false },
    { id: 'ts-o2', description: 'Submit an original trial design to the Oracle', needsStatement: true }
  ],
  [Tier.WAYFARER]: [
    { id: 'tw-k1', description: 'Master Ideologies Keystone: "Pillars of Belief"', needsStatement: false },
    { id: 'tw-k2', description: 'Master Environment Keystone: "Planetary Custodianship"', needsStatement: false },
    { id: 'tw-o1', description: 'Maintain an active journal for 3 lunar cycles', needsStatement: true },
    { id: 'tw-o2', description: 'Earn 3 standard domain badges', needsStatement: false }
  ],
  [Tier.JOURNEYER]: [
    { id: 'tj-k1', description: 'Master Ethics Keystone: "Pluralistic Protocol"', needsStatement: false },
    { id: 'tj-k2', description: 'Master Ideologies Keystone: "Institutional Dynamics"', needsStatement: false },
    { id: 'tj-o1', description: 'Perform 10 hours of verified colony service', needsStatement: true }
  ],
  [Tier.ARTISAN]: [
    { id: 'ta-k1', description: 'Master Society Keystone: "Sociological Synthesis"', needsStatement: false },
    { id: 'ta-k2', description: 'Master Environment Keystone: "Ecological Integration"', needsStatement: false },
    { id: 'ta-o1', description: 'Mentor a Seeker through their first 3 trials', needsStatement: true }
  ],
  [Tier.WARDEN]: [
    { id: 'twa-k1', description: 'Master Ethics Keystone: "The Warden\'s Integrity"', needsStatement: false },
    { id: 'twa-k2', description: 'Master Environment Keystone: "Restoration Duty"', needsStatement: false },
    { id: 'twa-o1', description: 'Lead a multi-Seeker service initiative', needsStatement: true }
  ],
  [Tier.KEYSTONE]: [
    { id: 'tk-k1', description: 'Master Ideologies Keystone: "Sovereign Systems"', needsStatement: false },
    { id: 'tk-k2', description: 'Master Society Keystone: "Anthropological Legacy"', needsStatement: false },
    { id: 'tk-o1', description: 'Forge a public legacy project impacting Guild sovereignty', needsStatement: true }
  ]
};

export const INITIAL_BADGES: Badge[] = [
  // --- THE 12 MANDATORY KEYSTONES ---
  // Tier: Member -> Seeker
  {
    id: 'ks-eth-1', title: 'The Core Covenant', description: 'Mastery of the rules and regulations that guide our community\'s internal progression.',
    domain: Domain.ETHICS, difficulty: Difficulty.THREE, requirements: [], reflections: '', evidenceUrls: [], isVerified: true, isUserCreated: false, creatorId: 'guildmaster', icon: '⚖️', designChoice: 'template', badgeShape: 'circle'
  },
  {
    id: 'ks-soc-1', title: 'Communal Genealogies', description: 'Exploring the diverse communities that made our world and the lessons taken from them.',
    domain: Domain.SOCIETY, difficulty: Difficulty.THREE, requirements: [], reflections: '', evidenceUrls: [], isVerified: true, isUserCreated: false, creatorId: 'guildmaster', icon: '🏛️', designChoice: 'template', badgeShape: 'square'
  },
  // Tier: Seeker -> Wayfarer
  {
    id: 'ks-ide-1', title: 'Pillars of Belief', description: 'Analyzing the beliefs and institutions (political, religious, ideological) that guide shared values.',
    domain: Domain.IDEOLOGY, difficulty: Difficulty.THREE, requirements: [], reflections: '', evidenceUrls: [], isVerified: true, isUserCreated: false, creatorId: 'guildmaster', icon: '🧠', designChoice: 'template', badgeShape: 'rectangle'
  },
  {
    id: 'ks-env-1', title: 'Planetary Custodianship', description: 'Understanding the world we inhabit and the fundamental duty we owe to it.',
    domain: Domain.ENVIRONMENT, difficulty: Difficulty.THREE, requirements: [], reflections: '', evidenceUrls: [], isVerified: true, isUserCreated: false, creatorId: 'guildmaster', icon: '🌿', designChoice: 'template', badgeShape: 'circle'
  },
  // Tier: Wayfarer -> Journeyer
  {
    id: 'ks-eth-2', title: 'Pluralistic Protocol', description: 'How we should treat those outside of our specific ideological beliefs and institutions.',
    domain: Domain.ETHICS, difficulty: Difficulty.FOUR, requirements: [], reflections: '', evidenceUrls: [], isVerified: true, isUserCreated: false, creatorId: 'guildmaster', icon: '🤝', designChoice: 'template', badgeShape: 'square'
  },
  {
    id: 'ks-ide-2', title: 'Institutional Dynamics', description: 'Deep dive into the systems that guide community-created values.',
    domain: Domain.IDEOLOGY, difficulty: Difficulty.FOUR, requirements: [], reflections: '', evidenceUrls: [], isVerified: true, isUserCreated: false, creatorId: 'guildmaster', icon: '👁️', designChoice: 'template', badgeShape: 'rectangle'
  },
  // Tier: Journeyer -> Artisan
  {
    id: 'ks-soc-2', title: 'Sociological Synthesis', description: 'Anthropological study of communities and the structural lessons they provide.',
    domain: Domain.SOCIETY, difficulty: Difficulty.FOUR, requirements: [], reflections: '', evidenceUrls: [], isVerified: true, isUserCreated: false, creatorId: 'guildmaster', icon: '⚒️', designChoice: 'template', badgeShape: 'circle'
  },
  {
    id: 'ks-env-2', title: 'Ecological Integration', description: 'Practical application of duty to the inhabit world through regenerative design.',
    domain: Domain.ENVIRONMENT, difficulty: Difficulty.FOUR, requirements: [], reflections: '', evidenceUrls: [], isVerified: true, isUserCreated: false, creatorId: 'guildmaster', icon: '♻️', designChoice: 'template', badgeShape: 'square'
  },
  // Tier: Artisan -> Warden
  {
    id: 'ks-eth-3', title: 'The Warden\'s Integrity', description: 'Advanced regulations guiding community progression and external ethical relations.',
    domain: Domain.ETHICS, difficulty: Difficulty.FIVE, requirements: [], reflections: '', evidenceUrls: [], isVerified: true, isUserCreated: false, creatorId: 'guildmaster', icon: '🛡️', designChoice: 'template', badgeShape: 'rectangle'
  },
  {
    id: 'ks-env-3', title: 'Restoration Duty', description: 'Leadership in environmental reclamation and bioregional stewardship.',
    domain: Domain.ENVIRONMENT, difficulty: Difficulty.FIVE, requirements: [], reflections: '', evidenceUrls: [], isVerified: true, isUserCreated: false, creatorId: 'guildmaster', icon: '🌲', designChoice: 'template', badgeShape: 'circle'
  },
  // Tier: Warden -> Keystone
  {
    id: 'ks-ide-3', title: 'Sovereign Systems', description: 'Final mastery of the ideological frameworks that sustain autonomous communities.',
    domain: Domain.IDEOLOGY, difficulty: Difficulty.FIVE, requirements: [], reflections: '', evidenceUrls: [], isVerified: true, isUserCreated: false, creatorId: 'guildmaster', icon: '🖋️', designChoice: 'template', badgeShape: 'square'
  },
  {
    id: 'ks-soc-3', title: 'Anthropological Legacy', description: 'Ensuring the diverse community lessons shaped into a lasting world legacy.',
    domain: Domain.SOCIETY, difficulty: Difficulty.FIVE, requirements: [], reflections: '', evidenceUrls: [], isVerified: true, isUserCreated: false, creatorId: 'guildmaster', icon: '🏗️', designChoice: 'template', badgeShape: 'rectangle'
  },

  {
    id: 'b1', title: 'Forest Stewardship', description: 'Learn to care for local woodland ecosystems and identify native species.',
    domain: Domain.ENVIRONMENT, difficulty: Difficulty.TWO, requirements: [
      { id: 'r1', description: 'Explain the concept of forest succession.', isCompleted: false, requireAttachment: true, requireNote: true },
      { id: 'r2', description: 'Identify 10 native trees.', isCompleted: false, requireAttachment: true, requireNote: true }
    ], reflections: '', evidenceUrls: [], isVerified: true, isUserCreated: false, creatorId: 'guildmaster', icon: '🌳', designChoice: 'template', badgeShape: 'circle'
  }
];

export const MOCK_COLONIES: Colony[] = [
  { id: 'c1', name: 'Portland Colony', number: 101, siege: 'Cascadia', charter: 'Sustainable urban living.', membersCount: 42, isApproved: true, notices: [], events: [] },
  { id: 'c2', name: 'Riverbend Colony', number: 205, siege: 'The Virtual Siege', charter: 'Connecting nomads.', membersCount: 128, isApproved: true, notices: [], events: [] }
];
