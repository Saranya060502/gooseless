import { create } from 'zustand';

export interface Match {
  userId: string;
  name: string;
  age: number;
  city: string;
  score: number;
  sharedChannels: { channelId: string; channelName: string }[];
  avatarGrad: [string, string];
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  match: Match;
  messages: Message[];
}

// ── Demo data ─────────────────────────────────────────────────────────────────

export const DEMO_MATCHES: Match[] = [
  {
    userId: '1', name: 'Alex R.', age: 27, city: 'New York, NY', score: 87,
    avatarGrad: ['#E98110', '#E5C19E'],
    sharedChannels: [
      { channelId: 'c1', channelName: 'Veritasium' },
      { channelId: 'c2', channelName: 'Kurzgesagt' },
      { channelId: 'c3', channelName: 'CGP Grey' },
      { channelId: 'c4', channelName: 'Tom Scott' },
      { channelId: 'c5', channelName: 'Numberphile' },
    ],
  },
  {
    userId: '2', name: 'Mia K.', age: 25, city: 'Austin, TX', score: 74,
    avatarGrad: ['#4caf7d', '#E5C19E'],
    sharedChannels: [
      { channelId: 'c6', channelName: 'Mark Rober' },
      { channelId: 'c7', channelName: 'Tom Scott' },
      { channelId: 'c8', channelName: '3Blue1Brown' },
    ],
  },
  {
    userId: '3', name: 'Jordan L.', age: 29, city: 'Chicago, IL', score: 61,
    avatarGrad: ['#c084fc', '#818cf8'],
    sharedChannels: [
      { channelId: 'c9',  channelName: 'Linus Tech Tips' },
      { channelId: 'c10', channelName: 'Fireship' },
      { channelId: 'c11', channelName: 'MKBHD' },
    ],
  },
  {
    userId: '4', name: 'Sam C.', age: 24, city: 'Seattle, WA', score: 55,
    avatarGrad: ['#38bdf8', '#4caf7d'],
    sharedChannels: [
      { channelId: 'c12', channelName: 'Wendover Productions' },
      { channelId: 'c13', channelName: 'Half as Interesting' },
    ],
  },
];

// ── Store ─────────────────────────────────────────────────────────────────────

interface State {
  // Auth
  userId: string | null;
  isDemo: boolean;
  setUserId: (id: string) => void;
  setDemo: (v: boolean) => void;

  // Matches
  matches: Match[];
  likedIds: string[];
  passedIds: string[];
  setMatches: (m: Match[]) => void;
  likeMatch: (m: Match) => void;
  passMatch: (id: string) => void;

  // Conversations
  conversations: Conversation[];
  activeConvId: string | null;
  addConversation: (match: Match) => void;
  setActiveConv: (id: string) => void;
  sendMessage: (convId: string, text: string) => void;

  // UI
  activeTab: 'discover' | 'liked' | 'messages';
  setTab: (t: 'discover' | 'liked' | 'messages') => void;
  toast: string | null;
  showToast: (msg: string) => void;
}

const DEMO_REPLIES = [
  "Oh wow same!! That video got me last month",
  "No way, I've been watching them for years 😄",
  "Right?? Their content is so underrated",
  "Haha yes!! We clearly have great taste",
  "Wait really? What got you into it?",
];

export const useStore = create<State>((set, get) => ({
  userId: null,
  isDemo: false,
  setUserId: (id) => set({ userId: id }),
  setDemo: (v) => set({ isDemo: v }),

  matches: [],
  likedIds: [],
  passedIds: [],
  setMatches: (matches) => set({ matches }),

  likeMatch: (match) => {
    const { likedIds, matches, conversations } = get();
    if (likedIds.includes(match.userId)) return;

    const conv: Conversation = {
      id: `conv-${match.userId}`,
      match,
      messages: [],
    };

    set({
      likedIds: [...likedIds, match.userId],
      matches:  matches.filter(m => m.userId !== match.userId),
      conversations: [conv, ...conversations],
    });

    get().showToast(`Matched with ${match.name}!`);
  },

  passMatch: (id) => set(s => ({
    passedIds: [...s.passedIds, id],
    matches:   s.matches.filter(m => m.userId !== id),
  })),

  conversations: [],
  activeConvId:  null,

  addConversation: (match) => {
    const existing = get().conversations.find(c => c.match.userId === match.userId);
    if (existing) {
      set({ activeConvId: existing.id });
      return;
    }
    const conv: Conversation = { id: `conv-${match.userId}`, match, messages: [] };
    set(s => ({ conversations: [conv, ...s.conversations], activeConvId: conv.id }));
  },

  setActiveConv: (id) => set({ activeConvId: id }),

  sendMessage: (convId, text) => {
    const myMsg: Message = {
      id: `m-${Date.now()}`,
      senderId: 'me',
      text,
      createdAt: new Date().toISOString(),
    };

    set(s => ({
      conversations: s.conversations.map(c =>
        c.id !== convId ? c : { ...c, messages: [...c.messages, myMsg] }
      ),
    }));

    // Demo auto-reply
    if (get().isDemo) {
      setTimeout(() => {
        const reply: Message = {
          id: `m-${Date.now()}-r`,
          senderId: convId,
          text: DEMO_REPLIES[Math.floor(Math.random() * DEMO_REPLIES.length)]!,
          createdAt: new Date().toISOString(),
        };
        set(s => ({
          conversations: s.conversations.map(c =>
            c.id !== convId ? c : { ...c, messages: [...c.messages, reply] }
          ),
        }));
      }, 1200);
    }
  },

  activeTab: 'discover',
  setTab: (tab) => set({ activeTab: tab }),

  toast: null,
  showToast: (msg) => {
    set({ toast: msg });
    setTimeout(() => set({ toast: null }), 2500);
  },
}));
