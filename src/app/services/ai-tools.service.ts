import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AICategory, AITool, SunburstNode } from '../models/ai-tool.model';

@Injectable({
  providedIn: 'root'
})
export class AIToolsService {
  private aiCategories: AICategory[] = [
    {
      name: 'Text Generation',
      description: 'AI tools for generating and editing text content',
      color: '#3B82F6',
      tools: [
        { name: 'ChatGPT', description: 'Conversational AI assistant', category: 'Text Generation', url: 'https://chat.openai.com', popularity: 95 },
        { name: 'Claude', description: 'AI assistant by Anthropic', category: 'Text Generation', url: 'https://claude.ai', popularity: 85 },
        { name: 'Gemini', description: 'Google\'s AI assistant', category: 'Text Generation', url: 'https://gemini.google.com', popularity: 80 },
        { name: 'Jasper', description: 'AI content creation platform', category: 'Text Generation', url: 'https://jasper.ai', popularity: 70 }
      ]
    },
    {
      name: 'Image Generation',
      description: 'AI tools for creating and editing images',
      color: '#EC4899',
      tools: [
        { name: 'DALL·E', description: 'OpenAI\'s image generation model', category: 'Image Generation', url: 'https://openai.com/dall-e-3', popularity: 90 },
        { name: 'Midjourney', description: 'AI art generation platform', category: 'Image Generation', url: 'https://midjourney.com', popularity: 88 },
        { name: 'Stable Diffusion', description: 'Open-source image generation', category: 'Image Generation', url: 'https://stability.ai', popularity: 85 },
        { name: 'Adobe Firefly', description: 'Creative generative AI', category: 'Image Generation', url: 'https://firefly.adobe.com', popularity: 75 }
      ]
    },
    {
      name: 'Code Generation',
      description: 'AI tools for programming and code assistance',
      color: '#10B981',
      tools: [
        { name: 'GitHub Copilot', description: 'AI pair programmer', category: 'Code Generation', url: 'https://copilot.github.com', popularity: 92 },
        { name: 'Cursor', description: 'AI code editor', category: 'Code Generation', url: 'https://cursor.sh', popularity: 78 },
        { name: 'Replit Ghostwriter', description: 'AI coding assistant', category: 'Code Generation', url: 'https://replit.com', popularity: 65 },
        { name: 'Tabnine', description: 'AI code completion', category: 'Code Generation', url: 'https://tabnine.com', popularity: 60 }
      ]
    },
    {
      name: 'Audio Processing',
      description: 'AI tools for audio and music generation',
      color: '#F59E0B',
      tools: [
        { name: 'ElevenLabs', description: 'AI voice cloning and synthesis', category: 'Audio Processing', url: 'https://elevenlabs.io', popularity: 85 },
        { name: 'Mubert', description: 'AI music generation', category: 'Audio Processing', url: 'https://mubert.com', popularity: 70 },
        { name: 'Speechify', description: 'Text-to-speech AI', category: 'Audio Processing', url: 'https://speechify.com', popularity: 75 },
        { name: 'Descript', description: 'AI audio editing', category: 'Audio Processing', url: 'https://descript.com', popularity: 68 }
      ]
    },
    {
      name: 'Video Generation',
      description: 'AI tools for video creation and editing',
      color: '#8B5CF6',
      tools: [
        { name: 'Runway ML', description: 'AI video generation platform', category: 'Video Generation', url: 'https://runwayml.com', popularity: 80 },
        { name: 'Synthesia', description: 'AI video creation with avatars', category: 'Video Generation', url: 'https://synthesia.io', popularity: 75 },
        { name: 'Luma AI', description: 'AI-powered video tools', category: 'Video Generation', url: 'https://lumalabs.ai', popularity: 70 },
        { name: 'Pika Labs', description: 'AI video generation', category: 'Video Generation', url: 'https://pika.art', popularity: 65 }
      ]
    },
    {
      name: 'Data Analysis',
      description: 'AI tools for data processing and analysis',
      color: '#06B6D4',
      tools: [
        { name: 'Tableau GPT', description: 'AI-powered data visualization', category: 'Data Analysis', url: 'https://tableau.com', popularity: 85 },
        { name: 'Julius AI', description: 'AI data analyst', category: 'Data Analysis', url: 'https://julius.ai', popularity: 70 },
        { name: 'DataRobot', description: 'Automated machine learning', category: 'Data Analysis', url: 'https://datarobot.com', popularity: 75 },
        { name: 'H2O.ai', description: 'AI and ML platform', category: 'Data Analysis', url: 'https://h2o.ai', popularity: 65 }
      ]
    },
    {
      name: 'Design Tools',
      description: 'AI-powered design and creative tools',
      color: '#EF4444',
      tools: [
        { name: 'Canva AI', description: 'AI-powered design platform', category: 'Design Tools', url: 'https://canva.com', popularity: 90 },
        { name: 'Figma AI', description: 'AI design assistance', category: 'Design Tools', url: 'https://figma.com', popularity: 85 },
        { name: 'Framer AI', description: 'AI web design tool', category: 'Design Tools', url: 'https://framer.com', popularity: 75 },
        { name: 'Uizard', description: 'AI UI design tool', category: 'Design Tools', url: 'https://uizard.io', popularity: 60 }
      ]
    },
    {
      name: 'Productivity',
      description: 'AI tools for enhancing productivity',
      color: '#84CC16',
      tools: [
        { name: 'Notion AI', description: 'AI-powered workspace', category: 'Productivity', url: 'https://notion.so', popularity: 88 },
        { name: 'Grammarly', description: 'AI writing assistant', category: 'Productivity', url: 'https://grammarly.com', popularity: 85 },
        { name: 'Otter.ai', description: 'AI meeting transcription', category: 'Productivity', url: 'https://otter.ai', popularity: 78 },
        { name: 'Zapier AI', description: 'AI automation platform', category: 'Productivity', url: 'https://zapier.com', popularity: 70 }
      ]
    },
    {
      name: 'Translation',
      description: 'AI-powered translation and language tools',
      color: '#F97316',
      tools: [
        { name: 'DeepL', description: 'AI translation service', category: 'Translation', url: 'https://deepl.com', popularity: 90 },
        { name: 'Google Translate', description: 'Neural machine translation', category: 'Translation', url: 'https://translate.google.com', popularity: 95 },
        { name: 'Reverso', description: 'AI translation and language learning', category: 'Translation', url: 'https://reverso.net', popularity: 70 },
        { name: 'Lingoda', description: 'AI language learning platform', category: 'Translation', url: 'https://lingoda.com', popularity: 65 }
      ]
    },
    {
      name: 'Customer Support',
      description: 'AI tools for customer service and support',
      color: '#14B8A6',
      tools: [
        { name: 'Intercom', description: 'AI customer messaging', category: 'Customer Support', url: 'https://intercom.com', popularity: 85 },
        { name: 'Zendesk AI', description: 'AI customer support platform', category: 'Customer Support', url: 'https://zendesk.com', popularity: 80 },
        { name: 'Ada', description: 'AI customer service automation', category: 'Customer Support', url: 'https://ada.cx', popularity: 70 },
        { name: 'Freshworks', description: 'AI-powered customer experience', category: 'Customer Support', url: 'https://freshworks.com', popularity: 75 }
      ]
    },
    {
      name: 'Marketing',
      description: 'AI tools for marketing and advertising',
      color: '#A855F7',
      tools: [
        { name: 'HubSpot AI', description: 'AI marketing automation', category: 'Marketing', url: 'https://hubspot.com', popularity: 85 },
        { name: 'Mailchimp AI', description: 'AI email marketing', category: 'Marketing', url: 'https://mailchimp.com', popularity: 80 },
        { name: 'Hootsuite AI', description: 'AI social media management', category: 'Marketing', url: 'https://hootsuite.com', popularity: 75 },
        { name: 'Buffer AI', description: 'AI social media scheduling', category: 'Marketing', url: 'https://buffer.com', popularity: 70 }
      ]
    },
    {
      name: 'Research',
      description: 'AI tools for research and information gathering',
      color: '#64748B',
      tools: [
        { name: 'Perplexity', description: 'AI search and research tool', category: 'Research', url: 'https://perplexity.ai', popularity: 85 },
        { name: 'Semantic Scholar', description: 'AI-powered research tool', category: 'Research', url: 'https://semanticscholar.org', popularity: 75 },
        { name: 'Elicit', description: 'AI research assistant', category: 'Research', url: 'https://elicit.org', popularity: 70 },
        { name: 'Consensus', description: 'AI research consensus tool', category: 'Research', url: 'https://consensus.app', popularity: 65 }
      ]
    },
    {
      name: 'Education',
      description: 'AI tools for learning and education',
      color: '#DC2626',
      tools: [
        { name: 'Khan Academy AI', description: 'AI-powered learning platform', category: 'Education', url: 'https://khanacademy.org', popularity: 85 },
        { name: 'Coursera AI', description: 'AI course recommendations', category: 'Education', url: 'https://coursera.org', popularity: 80 },
        { name: 'Duolingo', description: 'AI language learning', category: 'Education', url: 'https://duolingo.com', popularity: 90 },
        { name: 'Socratic', description: 'AI homework help', category: 'Education', url: 'https://socratic.org', popularity: 75 }
      ]
    },
    {
      name: 'Healthcare',
      description: 'AI tools for healthcare and medical applications',
      color: '#059669',
      tools: [
        { name: 'PathAI', description: 'AI pathology platform', category: 'Healthcare', url: 'https://pathai.com', popularity: 75 },
        { name: 'Babylon Health', description: 'AI health assessment', category: 'Healthcare', url: 'https://babylonhealth.com', popularity: 70 },
        { name: 'Tempus', description: 'AI precision medicine', category: 'Healthcare', url: 'https://tempus.com', popularity: 65 },
        { name: 'Buoy Health', description: 'AI symptom checker', category: 'Healthcare', url: 'https://buoyhealth.com', popularity: 60 }
      ]
    },
    {
      name: 'Finance',
      description: 'AI tools for financial analysis and trading',
      color: '#7C3AED',
      tools: [
        { name: 'Kensho', description: 'AI financial analytics', category: 'Finance', url: 'https://kensho.com', popularity: 75 },
        { name: 'Alpaca', description: 'AI trading platform', category: 'Finance', url: 'https://alpaca.markets', popularity: 70 },
        { name: 'Zest AI', description: 'AI credit underwriting', category: 'Finance', url: 'https://zest.ai', popularity: 65 },
        { name: 'Kavout', description: 'AI investment analytics', category: 'Finance', url: 'https://kavout.com', popularity: 60 }
      ]
    },
    {
      name: 'Legal Tech',
      description: 'AI tools for legal research and document analysis',
      color: '#B45309',
      tools: [
        { name: 'Harvey', description: 'AI legal assistant', category: 'Legal Tech', url: 'https://harvey.ai', popularity: 75 },
        { name: 'Westlaw Edge', description: 'AI legal research', category: 'Legal Tech', url: 'https://westlaw.com', popularity: 80 },
        { name: 'Casetext', description: 'AI legal research platform', category: 'Legal Tech', url: 'https://casetext.com', popularity: 70 },
        { name: 'Lawgeex', description: 'AI contract review', category: 'Legal Tech', url: 'https://lawgeex.com', popularity: 65 }
      ]
    }
  ];

  private searchQuery$ = new BehaviorSubject<string>('');
  
  getAICategories(): AICategory[] {
    return this.aiCategories;
  }

  getSunburstData(): SunburstNode {
    const root: SunburstNode = {
      name: 'AI Tools',
      children: this.aiCategories.map(category => ({
        name: category.name,
        description: category.description,
        color: category.color,
        category: category.name,
        children: category.tools.map(tool => ({
          name: tool.name,
          description: tool.description,
          url: tool.url,
          value: tool.popularity,
          category: category.name,
          color: category.color
        }))
      }))
    };
    return root;
  }

  searchTools(query: string): Observable<(AITool | AICategory)[]> {
    const results: (AITool | AICategory)[] = [];
    
    if (!query.trim()) {
      return new BehaviorSubject([]).asObservable();
    }

    const lowerQuery = query.toLowerCase();
    
    // Search categories
    this.aiCategories.forEach(category => {
      if (category.name.toLowerCase().includes(lowerQuery) || 
          category.description.toLowerCase().includes(lowerQuery)) {
        results.push(category);
      }
      
      // Search tools within categories
      category.tools.forEach(tool => {
        if (tool.name.toLowerCase().includes(lowerQuery) || 
            tool.description.toLowerCase().includes(lowerQuery)) {
          results.push(tool);
        }
      });
    });

    return new BehaviorSubject(results).asObservable();
  }

  setSearchQuery(query: string): void {
    this.searchQuery$.next(query);
  }

  getSearchQuery(): Observable<string> {
    return this.searchQuery$.asObservable();
  }
}