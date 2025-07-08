export interface AITool {
  name: string;
  description: string;
  category: string;
  url?: string;
  popularity: number;
}

export interface AICategory {
  name: string;
  description: string;
  color: string;
  tools: AITool[];
}

export interface SunburstNode {
  name: string;
  value?: number;
  children?: SunburstNode[];
  category?: string;
  description?: string;
  url?: string;
  color?: string;
  parent?: SunburstNode;
  depth?: number;
}