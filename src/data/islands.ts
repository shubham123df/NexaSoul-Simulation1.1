export type IslandId =
  | "foundation"
  | "builder"
  | "hackathon"
  | "opensource"
  | "fullstack"
  | "ai"
  | "leadership"
  | "network"
  | "legacy";

export interface Mission {
  id: string;
  title: string;
  reward: string;
  badge: string;
  xp: number;
}

export interface IslandData {
  id: IslandId;
  index: number;
  name: string;
  subtitle: string;
  year: number;
  theme: string;
  color: [number, number, number];
  accent: [number, number, number];
  position: [number, number, number];
  description: string;
  missions: Mission[];
  finalText?: string;
}

// Islands arranged in a sweeping arc through the universe
export const ISLANDS: IslandData[] = [
  {
    id: "foundation",
    index: 0,
    name: "Foundation Valley",
    subtitle: "The Beginning",
    year: 1,
    theme: "Foundation",
    color: [0.0, 0.718, 1.0],
    accent: [0.0, 0.47, 0.843],
    position: [0, 0, 0],
    description:
      "Every developer starts somewhere. Learn HTML, CSS, JavaScript and Git — the bedrock of everything you will build.",
    missions: [
      { id: "f1", title: "Build Your First Website", reward: "First Steps", badge: "HTML Explorer", xp: 100 },
      { id: "f2", title: "Style with CSS Crystals", reward: "Design Eye", badge: "CSS Stylist", xp: 120 },
      { id: "f3", title: "Activate JavaScript Logic", reward: "Logic Unlocked", badge: "JS Spark", xp: 150 },
      { id: "f4", title: "Open the Git Portal", reward: "Version Control", badge: "Git Keeper", xp: 130 },
    ],
  },
  {
    id: "builder",
    index: 1,
    name: "Builder City",
    subtitle: "Project-First Learning",
    year: 1,
    theme: "Projects",
    color: [0.18, 0.85, 1.0],
    accent: [0.55, 0.88, 0.0],
    position: [38, 2, -14],
    description:
      "A cyber city that grows with every project you ship. Portfolio, landing page, dashboard, weather app, todo app — each one lights another tower.",
    missions: [
      { id: "b1", title: "Ship a Portfolio", reward: "Portfolio Builder", badge: "Showcase", xp: 200 },
      { id: "b2", title: "Deploy a Landing Page", reward: "Live on Web", badge: "Deployer", xp: 180 },
      { id: "b3", title: "Build a Dashboard", reward: "Data Driven", badge: "Dashboard Pro", xp: 220 },
      { id: "b4", title: "Weather App", reward: "API Caller", badge: "Skywatcher", xp: 200 },
      { id: "b5", title: "Todo App", reward: "CRUD Master", badge: "Task Tamer", xp: 190 },
    ],
  },
  {
    id: "hackathon",
    index: 2,
    name: "Hackathon Arena",
    subtitle: "Solve Real Problems",
    year: 1,
    theme: "Hackathons",
    color: [0.42, 0.31, 0.95],
    accent: [0.0, 0.718, 1.0],
    position: [72, 4, -22],
    description:
      "A neon stadium with countdown timers, flying drones and a live leaderboard. Build under pressure, ship fast, take the trophy.",
    missions: [
      { id: "h1", title: "Join the Countdown", reward: "Team Formed", badge: "Squad Up", xp: 250 },
      { id: "h2", title: "Solve a Real Problem", reward: "Solution Shipped", badge: "Problem Solver", xp: 300 },
      { id: "h3", title: "Win the Trophy", reward: "Champion", badge: "Hackathon Winner", xp: 400 },
    ],
  },
  {
    id: "opensource",
    index: 3,
    name: "Open Source Planet",
    subtitle: "Collaborate at Galaxy Scale",
    year: 2,
    theme: "Open Source",
    color: [0.0, 0.718, 1.0],
    accent: [0.0, 0.85, 1.0],
    position: [98, 6, -52],
    description:
      "A GitHub galaxy where commits fly through space, pull requests connect developers and repositories orbit. Your contribution graph builds itself.",
    missions: [
      { id: "o1", title: "Make Your First Commit", reward: "Contributor", badge: "First PR", xp: 250 },
      { id: "o2", title: "Merge a Pull Request", reward: "Collaborator", badge: "Merger", xp: 300 },
      { id: "o3", title: "Star a Repository", reward: "Galaxy Expands", badge: "Stargazer", xp: 200 },
    ],
  },
  {
    id: "fullstack",
    index: 4,
    name: "Full Stack City",
    subtitle: "Backend Infrastructure",
    year: 2,
    theme: "Full Stack",
    color: [0.1, 0.78, 0.95],
    accent: [0.55, 0.88, 0.0],
    position: [110, 8, -92],
    description:
      "Node.js tower, Express highway, MongoDB vault, REST API bridges, auth portals and deployment rockets. The entire backend, visualized.",
    missions: [
      { id: "fs1", title: "Build a REST API", reward: "API Architect", badge: "Endpoint", xp: 320 },
      { id: "fs2", title: "Add Authentication", reward: "Secure Access", badge: "Gatekeeper", xp: 280 },
      { id: "fs3", title: "Deploy to Cloud", reward: "Liftoff", badge: "Cloud Native", xp: 350 },
    ],
  },
  {
    id: "ai",
    index: 5,
    name: "AI Research Lab",
    subtitle: "Build the Future",
    year: 3,
    theme: "AI",
    color: [0.0, 0.718, 1.0],
    accent: [0.66, 1.0, 0.0],
    position: [96, 12, -132],
    description:
      "Floating AI brains, prompt engineering terminals, LLM holograms and agents at work. Build chatbots, vision AI and generative products.",
    missions: [
      { id: "a1", title: "Engineer a Prompt", reward: "Prompt Crafter", badge: "Wordsmith", xp: 300 },
      { id: "a2", title: "Build an AI Agent", reward: "Automation", badge: "Agent Maker", xp: 380 },
      { id: "a3", title: "Ship an AI Product", reward: "Product Live", badge: "AI Builder", xp: 450 },
    ],
  },
  {
    id: "leadership",
    index: 6,
    name: "Leadership Tower",
    subtitle: "Mentor. Host. Lead.",
    year: 4,
    theme: "Leadership",
    color: [1.0, 0.83, 0.33],
    accent: [0.55, 0.88, 0.0],
    position: [56, 16, -158],
    description:
      "Mentor juniors, host workshops, run community meetings and speak publicly. Each completed mission lights another floor of the tower.",
    missions: [
      { id: "l1", title: "Mentor a Junior", reward: "Teacher", badge: "Mentor", xp: 350 },
      { id: "l2", title: "Host a Workshop", reward: "Stage Time", badge: "Host", xp: 380 },
      { id: "l3", title: "Lead a Community", reward: "Leader", badge: "Community Lead", xp: 450 },
    ],
  },
  {
    id: "network",
    index: 7,
    name: "National Network",
    subtitle: "Connect Campuses Across India",
    year: 4,
    theme: "Network",
    color: [0.0, 0.718, 1.0],
    accent: [0.55, 0.88, 0.0],
    position: [8, 20, -168],
    description:
      "An entire map of India. Nodes connect universities, hackathons and open-source communities. Every collaboration lights another city.",
    missions: [
      { id: "n1", title: "Connect a Campus", reward: "Node Online", badge: "Connector", xp: 320 },
      { id: "n2", title: "Cross-Campus Collab", reward: "Bridge Built", badge: "Unifier", xp: 400 },
    ],
  },
  {
    id: "legacy",
    index: 8,
    name: "Legacy Citadel",
    subtitle: "From Learner to Legacy",
    year: 5,
    theme: "Legacy",
    color: [1.0, 1.0, 1.0],
    accent: [0.0, 0.718, 1.0],
    position: [-48, 24, -150],
    description:
      "A gigantic floating headquarters where learners become mentors, builders become leaders, and leaders create lasting impact.",
    missions: [
      { id: "lg1", title: "Become a Mentor", reward: "Give Back", badge: "Legacy", xp: 500 },
      { id: "lg2", title: "Create Impact", reward: "Innovator", badge: "Impact Maker", xp: 600 },
    ],
    finalText: "From Learner → Builder → Collaborator → Leader → Innovator → Mentor → Legacy",
  },
];

export const TOTAL_XP = ISLANDS.reduce(
  (sum, i) => sum + i.missions.reduce((s, m) => s + m.xp, 0),
  0,
);

export function getIslandById(id: IslandId): IslandData {
  return ISLANDS.find((i) => i.id === id)!;
}
