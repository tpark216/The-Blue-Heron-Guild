
import { Domain, Difficulty, Badge, Tier, Colony } from './types';

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'b1',
    title: 'Forest Stewardship',
    description: 'Learn to care for local woodland ecosystems and identify native species.',
    domain: Domain.ENVIRONMENT,
    difficulty: Difficulty.TWO,
    requirements: [
      // Added requireAttachment and requireNote to satisfy the BadgeRequirement interface
      { id: 'r1', description: 'Explain the concept of forest succession and the role of climax species in your local biome.', isCompleted: false, requireAttachment: true, requireNote: true },
      { id: 'r2', description: 'Identify 10 native trees and 5 invasive plant species in a local woodland area.', isCompleted: false, requireAttachment: true, requireNote: true },
      { id: 'r3', description: 'Describe the impact of soil pH and drainage on forest health.', isCompleted: false, requireAttachment: true, requireNote: true },
      { id: 'r4', description: 'Demonstrate the safe use of at least three forestry tools (e.g., pruning saw, loppers, clinometer).', isCompleted: false, requireAttachment: true, requireNote: true },
      { id: 'r5', description: 'Complete a minimum of 8 hours of verified trail maintenance or invasive species removal.', isCompleted: false, requireAttachment: true, requireNote: true },
      { id: 'r6', description: 'Create a 1-year restoration plan for a small section of a local park or private land.', isCompleted: false, requireAttachment: true, requireNote: true },
      { id: 'r7', description: 'Explain the nitrogen and carbon cycles as they relate to forest floor decomposition.', isCompleted: false, requireAttachment: true, requireNote: true },
      { id: 'r8', description: 'Lead a small group on a guided "Tree Walk" to share your findings.', isCompleted: false, requireAttachment: true, requireNote: true }
    ],
    reflections: '',
    evidenceUrls: [],
    isVerified: true,
    isUserCreated: false,
    icon: '🌳',
    designChoice: 'template',
    badgeShape: 'circle'
  },
  {
    id: 'b2',
    title: 'Community Architect',
    description: 'Design and propose a community-centered space or initiative with professional rigor.',
    domain: Domain.SOCIETY,
    difficulty: Difficulty.THREE,
    requirements: [
      // Added requireAttachment and requireNote to satisfy the BadgeRequirement interface
      { id: 'r3', description: 'Define "Third Place" theory and its importance to social cohesion.', isCompleted: false, requireAttachment: true, requireNote: true },
      { id: 'r4', description: 'Conduct a site analysis of an underutilized space in your colony, noting sun exposure and foot traffic.', isCompleted: false, requireAttachment: true, requireNote: true },
      { id: 'r5', description: 'Interview three diverse stakeholders about their needs for a community hub.', isCompleted: false, requireAttachment: true, requireNote: true },
      { id: 'r6', description: 'Draft a to-scale blueprint or 3D model of your proposed intervention.', isCompleted: false, requireAttachment: true, requireNote: true },
      { id: 'r7', description: 'Research and list the zoning laws or guild permits required for your project.', isCompleted: false, requireAttachment: true, requireNote: true },
      { id: 'r8', description: 'Develop a budget and resource list, including possible sources of funding or donation.', isCompleted: false, requireAttachment: true, requireNote: true },
      { id: 'r9', description: 'Present your proposal to a Colony Council or local board for feedback.', isCompleted: false, requireAttachment: true, requireNote: true },
      { id: 'r10', description: 'Reflect on how your design promotes equity and environmental sustainability.', isCompleted: false, requireAttachment: true, requireNote: true }
    ],
    reflections: '',
    evidenceUrls: [],
    isVerified: true,
    isUserCreated: false,
    icon: '🏛️',
    designChoice: 'template',
    badgeShape: 'square'
  },
  {
    id: 'b3',
    title: 'The Socratic Path',
    description: 'Master the art of constructive dialogue and logical inquiry through practical application.',
    domain: Domain.ETHICS,
    difficulty: Difficulty.FIVE,
    requirements: [
      // Added requireAttachment and requireNote to satisfy the BadgeRequirement interface
      { id: 'r5', description: 'Define the Socratic Method and differentiate it from traditional debate.', isCompleted: false, requireAttachment: true, requireNote: true },
      { id: 'r6', description: 'Identify and explain 10 common logical fallacies (e.g., Ad Hominem, Straw Man).', isCompleted: false, requireAttachment: true, requireNote: true },
      { id: 'r7', description: 'Read and summarize one Platonic dialogue (e.g., Meno or The Apology).', isCompleted: false, requireAttachment: true, requireNote: true },
      { id: 'r8', description: 'Facilitate a 60-minute group inquiry session on a complex ethical topic.', isCompleted: false, requireAttachment: true, requireNote: true },
      { id: 'r9', description: 'Demonstrate active listening techniques by summarizing an opposing viewpoint to their satisfaction.', isCompleted: false, requireAttachment: true, requireNote: true },
      { id: 'r10', description: 'Write a 1,500-word treatise on the role of doubt in the pursuit of truth.', isCompleted: false, requireAttachment: true, requireNote: true },
      { id: 'r11', description: 'Create a set of "Dialogue Ground Rules" for use in your local Colony meetings.', isCompleted: false, requireAttachment: true, requireNote: true },
      { id: 'r12', description: 'Mentor a Seeker through their first public inquiry session.', isCompleted: false, requireAttachment: true, requireNote: true }
    ],
    reflections: '',
    evidenceUrls: [],
    isVerified: true,
    isUserCreated: false,
    icon: '⚖️',
    designChoice: 'template',
    badgeShape: 'rectangle'
  }
];

export const MOCK_COLONIES: Colony[] = [
  {
    id: 'c1',
    name: 'Portland Colony',
    number: 101,
    siege: 'Cascadia',
    charter: 'To foster growth through sustainable urban living.',
    membersCount: 42,
    isApproved: true
  },
  {
    id: 'c2',
    name: 'Riverbend Colony',
    number: 205,
    siege: 'The Virtual Siege',
    charter: 'Connecting nomads across digital borders.',
    membersCount: 128,
    isApproved: true
  }
];
