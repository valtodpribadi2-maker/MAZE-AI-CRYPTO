import { AgentPreset, ChannelItem, ModelRouteStep } from './types';

export const AGENT_PRESETS: AgentPreset[] = [
  {
    id: 'sales-triage',
    name: 'Sales triage agent',
    description: 'Watches inbox for invoicing/pricing inquiries and auto-resolves with HubSpot/Stripe integration.',
    prompt: 'watch our support inbox. When someone asks about an invoice, look them up in HubSpot, check Stripe for the charge, and reply with what actually happened. Escalate refunds to me.',
    avgReplyTime: '9s',
    channels: ['support@', 'Slack', 'Email'],
    tags: ['Slack', 'Web widget', 'Email', 'HubSpot', 'Stripe'],
    nodes: [
      { id: 'n1', label: 'Email In', sublabel: 'support@', type: 'trigger', color: 'border-orange-500 bg-orange-50/10' },
      { id: 'n2', label: 'Triage', sublabel: 'claude-sonnet-4.6', type: 'action', color: 'border-neutral-500 bg-[#E8E3D9]/10' },
      { id: 'n3', label: 'Router', sublabel: 'category', type: 'router', color: 'border-neutral-500 bg-neutral-900/40' },
      { id: 'n4', label: 'Reply', sublabel: 'gpt-5 • JSON', type: 'action', color: 'border-orange-500 bg-[#E8E3D9]/10' },
      { id: 'n5', label: 'To channels', sublabel: 'Slack • Email', type: 'recipient', color: 'border-orange-500/80 bg-orange-500/10' }
    ]
  },
  {
    id: 'customer-care',
    name: 'Customer support agent',
    description: 'Interprets ticket urgency, fetches docs context, drafts responsive emails & updates Slack.',
    prompt: 'Listen for new tickets in Zendesk. Classify urgency. If high, notify the engineering channel on Slack and draft a polite, personalized response using context from Git issues. Standard tickets get direct links to docs.',
    avgReplyTime: '12s',
    channels: ['Zendesk', 'Slack', 'Email'],
    tags: ['Zendesk', 'Slack', 'Email', 'GitHub', 'MD Docs'],
    nodes: [
      { id: 'n1', label: 'Zendesk Incident', sublabel: 'new_ticket', type: 'trigger', color: 'border-teal-500 bg-teal-50/10' },
      { id: 'n2', label: 'Classify Urgency', sublabel: 'llama-3-70b', type: 'action', color: 'border-neutral-500 bg-[#E8E3D9]/10' },
      { id: 'n3', label: 'Slack Alert / Doc Pull', sublabel: 'branching', type: 'router', color: 'border-neutral-500 bg-neutral-900/40' },
      { id: 'n4', label: 'Formulate Answer', sublabel: 'claude-3.5-haiku', type: 'action', color: 'border-teal-500 bg-[#E8E3D9]/10' },
      { id: 'n5', label: 'Zendesk Close', sublabel: 'Webhook Update', type: 'recipient', color: 'border-teal-500/80 bg-teal-500/10' }
    ]
  },
  {
    id: 'lead-enricher',
    name: 'Lead Enrichment Bot',
    description: 'Enriches lead details from internet sources, scores them, and pushes them to Salesforce.',
    prompt: 'When a new lead fills the signup form, look up their company on LinkedIn, crunch their employee count and funding, and assign a priority score. Send premium leads to Salesforce and write a warm intro greeting to the rep.',
    avgReplyTime: '15s',
    channels: ['Web widget', 'Salesforce'],
    tags: ['LinkedIn', 'Salesforce', 'Apollo', 'Gmail'],
    nodes: [
      { id: 'n1', label: 'Web Form Sign', sublabel: 'user_active', type: 'trigger', color: 'border-indigo-500 bg-indigo-50/10' },
      { id: 'n2', label: 'Search Company', sublabel: 'linkedin-bot', type: 'action', color: 'border-neutral-500 bg-[#E8E3D9]/10' },
      { id: 'n3', label: 'Enrichment Router', sublabel: 'score > 75', type: 'router', color: 'border-neutral-500 bg-neutral-900/40' },
      { id: 'n4', label: 'Salesforce Push', sublabel: 'api_write', type: 'action', color: 'border-indigo-500 bg-[#E8E3D9]/10' },
      { id: 'n5', label: 'Intro Draft', sublabel: 'gpt-4o', type: 'recipient', color: 'border-indigo-500/80 bg-indigo-500/10' }
    ]
  }
];

export const CHANNELS: ChannelItem[] = [
  {
    id: 'c1',
    number: '01',
    category: 'EMBED',
    title: 'Web widget',
    color: 'border-orange-500',
    iconName: 'MessageSquare',
    badgeBg: 'bg-orange-50 text-orange-600 border-orange-200',
    textCol: 'text-orange-500',
    description: 'Inject a beautiful, customizable floating chat icon onto your website with a single snippet of script code.',
    interactiveSnippet: `<script src="https://cdn.mazaal.ai/widget.js" data-agent-id="agent_92hf28s"></script>`
  },
  {
    id: 'c2',
    number: '02',
    category: 'EMBED',
    title: 'Standalone app',
    color: 'border-orange-500',
    iconName: 'Smartphone',
    badgeBg: 'bg-orange-50 text-orange-600 border-orange-200',
    textCol: 'text-orange-500',
    description: 'Host a full-blown responsive chatbot app directly on our fast global CDN under your own brand and domain name.',
    interactiveSnippet: `https://agent.mazaal.ai/app/my-custom-assistant-902`
  },
  {
    id: 'c3',
    number: '03',
    category: 'EMBED',
    title: 'API',
    color: 'border-orange-500',
    iconName: 'Code',
    badgeBg: 'bg-orange-50 text-orange-600 border-orange-200',
    textCol: 'text-orange-500',
    description: 'Call your agents programmatically using our high-performance REST APIs & streaming responses.',
    interactiveSnippet: `curl -X POST "https://api.mazaal.ai/v1/chat" \\
  -H "Authorization: Bearer mzl_..." \\
  -d '{"message": "Hello"}'`
  },
  {
    id: 'c4',
    number: '04',
    category: 'EMBED',
    title: 'Webhook',
    color: 'border-orange-500',
    iconName: 'GitPullRequest',
    badgeBg: 'bg-orange-50 text-orange-600 border-orange-200',
    textCol: 'text-orange-500',
    description: 'Connect events from exterior webhooks and forward payloads automatically into the agent workflow.',
    interactiveSnippet: `POST https://api.mazaal.ai/webhooks/incoming/hook_811hs3`
  },
  {
    id: 'c5',
    number: '05',
    category: 'MESSAGING',
    title: 'Slack',
    color: 'border-emerald-600',
    iconName: 'Slack',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    textCol: 'text-emerald-600',
    description: 'Let your teammates interact with internal agents, ask questions, run reports, and query knowledge directly inside Slack.',
    interactiveSnippet: `Slack Workspace Connected: Mazaal-Agent added to #support-triage and #sales-leads channels.`
  },
  {
    id: 'c6',
    number: '06',
    category: 'MESSAGING',
    title: 'Discord',
    color: 'border-emerald-600',
    iconName: 'Hash',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    textCol: 'text-emerald-600',
    description: 'Integrate into Discord communities for automatic moderation, community assistance, and member roles matching.',
    interactiveSnippet: `Discord bot active in guild: "CyberDevs Community" (ID: 9811). Running 24/7.`
  },
  {
    id: 'c7',
    number: '07',
    category: 'MESSAGING',
    title: 'Telegram',
    color: 'border-emerald-600',
    iconName: 'Send',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    textCol: 'text-emerald-600',
    description: 'Set up instant, cloud-authoritative Telegram assistants delivering fast support to user questions on speed.',
    interactiveSnippet: `Telegram webhook hooked to @MazaalTeammateBot. Automatic inline search active.`
  },
  {
    id: 'c8',
    number: '08',
    category: 'MESSAGING',
    title: 'WhatsApp',
    color: 'border-emerald-600',
    iconName: 'MessageCircle', // fallback
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    textCol: 'text-emerald-600',
    description: 'Communicate with global users via official WhatsApp Business APIs. Send updates, support cards, and schedule calls.',
    interactiveSnippet: `WhatsApp Business verified matching phone +1 (855) 791-2321. Approved template lists activated.`
  },
  {
    id: 'c9',
    number: '09',
    category: 'SOCIAL',
    title: 'Facebook',
    color: 'border-violet-600',
    iconName: 'Facebook',
    badgeBg: 'bg-violet-50 text-violet-700 border-violet-200',
    textCol: 'text-violet-600',
    description: 'Link your Facebook Pages so agents can reply to user direct messages or coordinate reviews.',
    interactiveSnippet: `Meta Business API linked: Page "Mazaal Technologies" auto-response active for user DMs.`
  },
  {
    id: 'c10',
    number: '10',
    category: 'SOCIAL',
    title: 'Instagram',
    color: 'border-violet-600',
    iconName: 'Instagram',
    badgeBg: 'bg-violet-50 text-violet-700 border-violet-200',
    textCol: 'text-violet-600',
    description: 'Reply instantly to Instagram comments, direct message threads, and story mentions.',
    interactiveSnippet: `Instagram Graph connected to account @mazaal_ai. Automated mention tracking turned ON.`
  },
  {
    id: 'c11',
    number: '11',
    category: 'SOCIAL',
    title: 'Twitter / X',
    color: 'border-violet-600',
    iconName: 'Twitter',
    badgeBg: 'bg-violet-50 text-violet-700 border-violet-200',
    textCol: 'text-violet-600',
    description: 'Track mentions of your product on X, write answers to questions, or alert the support group.',
    interactiveSnippet: `X Developer Portal configured: Webhook tracking "@mazaal_ai" and drafts auto-queued for review.`
  },
  {
    id: 'c12',
    number: '12',
    category: 'SOCIAL',
    title: 'LinkedIn',
    color: 'border-violet-600',
    iconName: 'Linkedin',
    badgeBg: 'bg-violet-50 text-violet-700 border-violet-200',
    textCol: 'text-violet-600',
    description: 'Draft articles, schedule posts, and respond to incoming inquiries from potential B2B leads.',
    interactiveSnippet: `LinkedIn corporate API bound. Scheduled update pipeline synced to human editorial calendar.`
  },
  {
    id: 'c13',
    number: '13',
    category: 'COMMS',
    title: 'Email',
    color: 'border-cyan-600',
    iconName: 'Mail',
    badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    textCol: 'text-cyan-600',
    description: 'Connect high-performance IMAP, SMTP, GMail or Outlook inboxes to directly answer requests in natural letters.',
    interactiveSnippet: `Inbound IMAP server: imap.gmail.com (SSL port 993). Sync rate: 5-second polling.`
  },
  {
    id: 'c14',
    number: '14',
    category: 'COMMS',
    title: 'SMS',
    color: 'border-cyan-600',
    iconName: 'Heart', // fallback
    badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    textCol: 'text-cyan-600',
    description: 'Send SMS updates & support replies via Twilio or local integrations. High deliverability guaranteed.',
    interactiveSnippet: `Twilio Service SID: MG91a038f... Phone: +1 (512) 388-2922.`
  },
  {
    id: 'c15',
    number: '15',
    category: 'COMMS',
    title: 'Voice',
    color: 'border-cyan-600',
    iconName: 'Mic',
    badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    textCol: 'text-cyan-600',
    description: 'Synthesize voice responses or listen to inbound voicemail to classify customer satisfaction levels.',
    interactiveSnippet: `Voice interface active: Twilio SIP Trunk connected. Realtime TTS: eleven_labs_multilingual_v2.`
  },
  {
    id: 'c16',
    number: '16',
    category: 'EMBED',
    title: 'Workflow step',
    color: 'border-orange-500',
    iconName: 'Share2',
    badgeBg: 'bg-orange-50 text-orange-600 border-orange-200',
    textCol: 'text-orange-500',
    description: 'Deploy the agent inside a bigger Zapier, Make, or custom automation system flow easily.',
    interactiveSnippet: `Trigger hook registered. Sending prompt attributes as structured JSON outputs to webhooks.`
  }
];

export const ROUTE_STEPS: ModelRouteStep[] = [
  {
    task: 'Classify incoming user query',
    description: 'Read the text and decide if it is support, sales, spam, or follow-up.',
    singleModel: { name: 'GPT-4 (Original)', cost: 0.030, latency: 1.8 },
    mazaalModel: { name: 'GPT-4o-Mini / Llama 3b', cost: 0.0015, latency: 0.4 }
  },
  {
    task: 'Perform database search & vector fetch',
    description: 'Retrieve user details from the database and historical context vectors.',
    singleModel: { name: 'GPT-4 (Original)', cost: 0.045, latency: 2.2 },
    mazaalModel: { name: 'Direct SQL & Pinecone integration', cost: 0.000, latency: 0.1 }
  },
  {
    task: 'Synthesize highly intelligent reply',
    description: 'Conduct deep reasoning on context documents to answer the ticket accurately.',
    singleModel: { name: 'GPT-4 (Original)', cost: 0.090, latency: 4.1 },
    mazaalModel: { name: 'Claude 3.5 Sonnet / o4', cost: 0.035, latency: 1.9 }
  },
  {
    task: 'Structure final response into JSON',
    description: 'Verify fields, set status codes, and wrap details into compliant JSON format.',
    singleModel: { name: 'GPT-4 (Original)', cost: 0.025, latency: 1.5 },
    mazaalModel: { name: 'Structured JSON Mode / Gemini 2.5 Flash', cost: 0.002, latency: 0.5 }
  }
];

export const BRAND_REVIEWS = [
  { text: "Best-in-class orchestration.", publication: "The ABJ", desc: "AUSTRALIAN BUSINESS JOURNAL" },
  { text: "Fastest deployment on the market.", publication: "TECH", desc: "Business News" },
  { text: "Zero boilerplate code required.", publication: "Digital Journal", desc: "" },
  { text: "Innovative model cascading.", publication: "TechBullion", desc: "" }
];

export const PRICING_PLANS = [
  {
    name: 'Free Starter',
    description: 'Perfect for exploring and creating your first intelligent AI teammate.',
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      '1 Active AI Teammate',
      'Up to 3 multi-channel outputs',
      '500 executions per month',
      'Standard LLM Routing',
      'Community assistance support'
    ],
    buttonText: 'Start for Free',
    isPopular: false
  },
  {
    name: 'Growth & Business',
    description: 'For growing teams requiring robust agents, high throughput, and database connectors.',
    priceMonthly: 49,
    priceYearly: 39,
    features: [
      '10 Active AI Teammates',
      'All 16 Channel integrations',
      '15,000 executions per month',
      'Intelligent Cost-Optimizer Flow',
      'Custom database & HubSpot connectors',
      'Priority email & Slack support (12h)'
    ],
    buttonText: 'Start Free Trial',
    isPopular: true
  },
  {
    name: 'Enterprise Scale',
    description: 'Custom setups for high volume operations, custom models, and enterprise security compliance.',
    priceMonthly: 249,
    priceYearly: 199,
    features: [
      'Unlimited AI Teammates',
      'Custom MCP server integrations',
      'Unlimited executions',
      'Dedicated model hosting & Fine-tuning',
      'Custom LLM security gate & PII filter',
      '24/7 dedicated Account Manager support'
    ],
    buttonText: 'Talk to Sales',
    isPopular: false
  }
];
