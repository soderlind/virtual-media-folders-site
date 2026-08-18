/**
 * Canonical add-on catalog — the source of truth for marketing copy.
 * Live figures (stars, latest release) are merged in at build time by lib/data.ts,
 * keyed by `repo`.
 */

export type AddonCategory =
  | 'AI'
  | 'Workflow'
  | 'Maintenance'
  | 'Import/Export'
  | 'Discovery';

export interface Addon {
  /** URL slug for /add-ons/<slug> */
  slug: string;
  /** Display name (user-facing) */
  name: string;
  /** GitHub repo under the soderlind org */
  repo: string;
  /** One-line hook */
  tagline: string;
  /** Short paragraph for cards */
  summary: string;
  /** Longer copy for the detail page */
  description: string;
  category: AddonCategory;
  /** Bulleted highlights on the detail page */
  features: string[];
  /** True when the add-on needs external services / keys */
  requiresApiKey?: boolean;
}

export const CATEGORIES: {
  id: AddonCategory;
  label: string;
  blurb: string;
}[] = [
  { id: 'AI', label: 'AI', blurb: 'Let AI agents read and organize your media.' },
  {
    id: 'Workflow',
    label: 'Workflow',
    blurb: 'Rules and roles that keep a team’s library tidy.',
  },
  {
    id: 'Maintenance',
    label: 'Maintenance',
    blurb: 'Find and clear the clutter weighing your library down.',
  },
  {
    id: 'Import/Export',
    label: 'Import / Export',
    blurb: 'Move folders in from other plugins, or out as archives.',
  },
  {
    id: 'Discovery',
    label: 'Discovery',
    blurb: 'Find any file in the library, fast.',
  },
];

export const ADDONS: Addon[] = [
  {
    slug: 'ai-ability',
    name: 'AI Ability',
    repo: 'vmfa-ai-ability',
    category: 'AI',
    tagline: 'Give AI agents safe, structured access to your folders.',
    summary:
      'Registers MCP tools for AI agents through the WordPress Abilities API — list, create, and fill folders.',
    description:
      'AI Ability exposes Virtual Media Folders to AI agents and MCP clients through the WordPress Abilities API. Agents can resolve folder names to stable IDs, create folders, and assign attachments — all behind WordPress capability checks, so nothing happens that the user isn’t already allowed to do.',
    features: [
      'MCP tools: vmfo/list-folders, vmfo/create-folder, vmfo/add-to-folder',
      'Works with Claude, GitHub Copilot, Cursor and any MCP adapter',
      'Capability-gated: respects upload_files and manage_categories',
      'Stable folder IDs avoid ambiguity across duplicate folder names',
    ],
  },
  {
    slug: 'ai-organizer',
    name: 'AI Organizer',
    repo: 'vmfa-ai-organizer',
    category: 'AI',
    tagline: 'Let vision AI sort your library for you.',
    summary:
      'Uses vision-capable AI models to analyze what’s actually in each image and auto-file it into virtual folders.',
    description:
      'AI Organizer looks at the real content of your images — not just filenames — using a vision-capable model, then automatically sorts them into virtual folders. Point it at your library and let it propose or apply an organization scheme. Bring your own API key from a supported provider, or run a local LLM.',
    features: [
      'Content-aware foldering from actual image analysis',
      'Bring your own API key, or use a local LLM',
      'Review suggestions before applying, or run it hands-off',
      'Built on the same virtual-folder model — no files are moved',
    ],
    requiresApiKey: true,
  },
  {
    slug: 'editorial-workflow',
    name: 'Editorial Workflow',
    repo: 'vmfa-editorial-workflow',
    category: 'Workflow',
    tagline: 'Roles, restrictions, and an Inbox for teams.',
    summary:
      'Role-based folder access, move restrictions, and an Inbox workflow for editorial teams.',
    description:
      'Editorial Workflow adds team controls on top of Virtual Media Folders: decide which roles can see or move media in which folders, restrict moves, and route new uploads through an Inbox so nothing lands in the wrong place. Ideal for multi-author sites and agencies.',
    features: [
      'Role-based access to specific folders',
      'Move restrictions to protect curated folders',
      'Inbox workflow for triaging new uploads',
      'Keeps large, multi-author libraries under control',
    ],
  },
  {
    slug: 'rules-engine',
    name: 'Rules Engine',
    repo: 'vmfa-rules-engine',
    category: 'Workflow',
    tagline: 'Auto-file uploads by metadata, type, or EXIF.',
    summary:
      'Rule-based automatic folder assignment for uploads, driven by metadata, file type, and EXIF/IPTC data.',
    description:
      'Rules Engine assigns uploads to folders automatically using rules you define — match on file type, metadata, or embedded EXIF/IPTC data, and route each file to the right folder the moment it lands. Set it up once and new media organizes itself.',
    features: [
      'Match on file type, metadata, EXIF and IPTC',
      'Automatic folder assignment on upload',
      'Chain multiple rules for precise routing',
      'Works with the vmfo_upload_folder filter under the hood',
    ],
  },
  {
    slug: 'media-cleanup',
    name: 'Media Cleanup',
    repo: 'vmfa-media-cleanup',
    category: 'Maintenance',
    tagline: 'Find and clear unused, duplicate, oversized media.',
    summary:
      'Detects unused, duplicate, and oversized media — then archive, trash, or flag it for review.',
    description:
      'Media Cleanup surfaces the media that’s quietly bloating your library — files nothing links to, duplicates, and oversized images — and lets you archive, trash, or flag them for review. Reclaim space and keep the library lean without guesswork.',
    features: [
      'Detect unused, duplicate, and oversized files',
      'Archive, trash, or flag for review',
      'Review before you delete — nothing is removed silently',
      'Keeps your library (and backups) lean',
    ],
  },
  {
    slug: 'migrate',
    name: 'Migrate',
    repo: 'vmfa-migrate',
    category: 'Import/Export',
    tagline: 'Bring folders over from your old plugin.',
    summary:
      'Migrate folder structures from other media folder plugins into Virtual Media Folders.',
    description:
      'Switching from another media folder plugin? Migrate imports your existing folder structure into Virtual Media Folders so you keep your organization and lose the lock-in. Built after a user request for Enhanced Media Library, it also supports FileBird, Real Media Library, HappyFiles, WP Media Folder, Media Library Assistant, and CatFolders.',
    features: [
      'Enhanced Media Library, FileBird, Real Media Library',
      'HappyFiles, WP Media Folder, Media Library Assistant, CatFolders',
      'Preserves your existing hierarchy',
      'One-way import into clean, lock-in-free virtual folders',
    ],
  },
  {
    slug: 'folder-exporter',
    name: 'Folder Exporter',
    repo: 'vmfa-folder-exporter',
    category: 'Import/Export',
    tagline: 'Export folders as ZIP archives with manifests.',
    summary:
      'Export folders (or whole subtrees) as ZIP archives, with optional CSV manifests.',
    description:
      'Folder Exporter packages a folder — or an entire subtree — into a ZIP archive, optionally with a CSV manifest listing every file. Handy for handoffs, backups, or moving a set of assets to another project.',
    features: [
      'Export a single folder or a full subtree',
      'ZIP archives ready to hand off or back up',
      'Optional CSV manifest of every exported file',
      'Respects the virtual hierarchy you built',
    ],
  },
  {
    slug: 'search',
    name: 'Search',
    repo: 'vmfa-search',
    category: 'Discovery',
    tagline: 'Fast, typo-tolerant Media Library search.',
    summary:
      'Fast, typo-tolerant search for the WordPress Media Library, powered by the Loupe engine.',
    description:
      'Search adds instant, typo-tolerant search to the WordPress Media Library, powered by the Loupe search engine. Find the file you mean even when you don’t spell it right — no external service required.',
    features: [
      'Instant, typo-tolerant results',
      'Powered by the self-contained Loupe search engine',
      'No external search service to configure',
      'Searches the whole library, folders and all',
    ],
  },
];
