export interface FlowNode {
  id: string;
  label: string;
  sublabel?: string;
  type: 'trigger' | 'action' | 'router' | 'recipient';
  status?: 'idle' | 'active' | 'completed' | 'error';
  color?: string;
}

export interface AgentPreset {
  id: string;
  name: string;
  description: string;
  prompt: string;
  avgReplyTime: string;
  channels: string[];
  tags: string[];
  nodes: FlowNode[];
}

export interface ChannelItem {
  id: string;
  number: string;
  category: 'EMBED' | 'MESSAGING' | 'SOCIAL' | 'COMMS';
  title: string;
  color: string;
  iconName: string;
  description: string;
  interactiveSnippet: string;
  badgeBg: string;
  textCol: string;
}

export interface ModelRouteStep {
  task: string;
  description: string;
  singleModel: {
    name: string;
    cost: number;
    latency: number;
  };
  mazaalModel: {
    name: string;
    cost: number;
    latency: number;
  };
}
