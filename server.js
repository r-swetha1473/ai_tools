const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const app = express();
const PORT = process.env.PORT || 8080;
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// AI Tools data structure
const aiToolsData = {
  categories: [
    {
      id: 'text-generation',
      name: 'Text Generation',
      description: 'AI tools for generating and editing text content',
      color: '#3B82F6',
      icon: '✍️',
      tools: [
        { id: 'chatgpt', name: 'ChatGPT', description: 'Conversational AI assistant by OpenAI', url: 'https://chat.openai.com', popularity: 95 },
        { id: 'claude', name: 'Claude', description: 'AI assistant by Anthropic', url: 'https://claude.ai', popularity: 85 },
        { id: 'gemini', name: 'Gemini', description: 'Google\'s advanced AI assistant', url: 'https://gemini.google.com', popularity: 80 },
        { id: 'jasper', name: 'Jasper', description: 'AI content creation platform', url: 'https://jasper.ai', popularity: 70 }
      ]
    },
    {
      id: 'image-generation',
      name: 'Image Generation',
      description: 'AI tools for creating and editing images',
      color: '#EC4899',
      icon: '🎨',
      tools: [
        { id: 'dalle', name: 'DALL·E', description: 'OpenAI\'s image generation model', url: 'https://openai.com/dall-e-3', popularity: 90 },
        { id: 'midjourney', name: 'Midjourney', description: 'AI art generation platform', url: 'https://midjourney.com', popularity: 88 },
        { id: 'stable-diffusion', name: 'Stable Diffusion', description: 'Open-source image generation', url: 'https://stability.ai', popularity: 85 },
        { id: 'firefly', name: 'Adobe Firefly', description: 'Creative generative AI', url: 'https://firefly.adobe.com', popularity: 75 }
      ]
    },
    {
      id: 'code-generation',
      name: 'Code Generation',
      description: 'AI tools for programming and code assistance',
      color: '#10B981',
      icon: '💻',
      tools: [
        { id: 'copilot', name: 'GitHub Copilot', description: 'AI pair programmer', url: 'https://copilot.github.com', popularity: 92 },
        { id: 'cursor', name: 'Cursor', description: 'AI code editor', url: 'https://cursor.sh', popularity: 78 },
        { id: 'replit', name: 'Replit Ghostwriter', description: 'AI coding assistant', url: 'https://replit.com', popularity: 65 },
        { id: 'tabnine', name: 'Tabnine', description: 'AI code completion', url: 'https://tabnine.com', popularity: 60 }
      ]
    },
    {
      id: 'audio-processing',
      name: 'Audio Processing',
      description: 'AI tools for audio and music generation',
      color: '#F59E0B',
      icon: '🎵',
      tools: [
        { id: 'elevenlabs', name: 'ElevenLabs', description: 'AI voice cloning and synthesis', url: 'https://elevenlabs.io', popularity: 85 },
        { id: 'mubert', name: 'Mubert', description: 'AI music generation', url: 'https://mubert.com', popularity: 70 },
        { id: 'speechify', name: 'Speechify', description: 'Text-to-speech AI', url: 'https://speechify.com', popularity: 75 },
        { id: 'descript', name: 'Descript', description: 'AI audio editing', url: 'https://descript.com', popularity: 68 }
      ]
    },
    {
      id: 'video-generation',
      name: 'Video Generation',
      description: 'AI tools for video creation and editing',
      color: '#8B5CF6',
      icon: '🎬',
      tools: [
        { id: 'runway', name: 'Runway ML', description: 'AI video generation platform', url: 'https://runwayml.com', popularity: 80 },
        { id: 'synthesia', name: 'Synthesia', description: 'AI video creation with avatars', url: 'https://synthesia.io', popularity: 75 },
        { id: 'luma', name: 'Luma AI', description: 'AI-powered video tools', url: 'https://lumalabs.ai', popularity: 70 },
        { id: 'pika', name: 'Pika Labs', description: 'AI video generation', url: 'https://pika.art', popularity: 65 }
      ]
    },
    {
      id: 'data-analysis',
      name: 'Data Analysis',
      description: 'AI tools for data processing and analysis',
      color: '#06B6D4',
      icon: '📊',
      tools: [
        { id: 'tableau-gpt', name: 'Tableau GPT', description: 'AI-powered data visualization', url: 'https://tableau.com', popularity: 85 },
        { id: 'julius', name: 'Julius AI', description: 'AI data analyst', url: 'https://julius.ai', popularity: 70 },
        { id: 'datarobot', name: 'DataRobot', description: 'Automated machine learning', url: 'https://datarobot.com', popularity: 75 },
        { id: 'h2o', name: 'H2O.ai', description: 'AI and ML platform', url: 'https://h2o.ai', popularity: 65 }
      ]
    },
    {
      id: 'design-tools',
      name: 'Design Tools',
      description: 'AI-powered design and creative tools',
      color: '#EF4444',
      icon: '🎯',
      tools: [
        { id: 'canva-ai', name: 'Canva AI', description: 'AI-powered design platform', url: 'https://canva.com', popularity: 90 },
        { id: 'figma-ai', name: 'Figma AI', description: 'AI design assistance', url: 'https://figma.com', popularity: 85 },
        { id: 'framer-ai', name: 'Framer AI', description: 'AI web design tool', url: 'https://framer.com', popularity: 75 },
        { id: 'uizard', name: 'Uizard', description: 'AI UI design tool', url: 'https://uizard.io', popularity: 60 }
      ]
    },
    {
      id: 'productivity',
      name: 'Productivity',
      description: 'AI tools for enhancing productivity',
      color: '#84CC16',
      icon: '⚡',
      tools: [
        { id: 'notion-ai', name: 'Notion AI', description: 'AI-powered workspace', url: 'https://notion.so', popularity: 88 },
        { id: 'grammarly', name: 'Grammarly', description: 'AI writing assistant', url: 'https://grammarly.com', popularity: 85 },
        { id: 'otter', name: 'Otter.ai', description: 'AI meeting transcription', url: 'https://otter.ai', popularity: 78 },
        { id: 'zapier-ai', name: 'Zapier AI', description: 'AI automation platform', url: 'https://zapier.com', popularity: 70 }
      ]
    }
  ]
};

// API Routes
app.get('/api/categories', (req, res) => {
  const categories = aiToolsData.categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    description: cat.description,
    color: cat.color,
    icon: cat.icon,
    toolCount: cat.tools.length
  }));
  res.json(categories);
});

app.get('/api/tool/:id', (req, res) => {
  for (const category of aiToolsData.categories) {
    const tool = category.tools.find(t => t.id === req.params.id);
    if (tool) {
      return res.json({
        type: 'tool',
        ...tool,
        category: category.name,
        categoryId: category.id,
        categoryColor: category.color
      });
    }
  }
  res.status(404).json({ error: 'Tool not found' });
});

app.get('/api/categories/:id', (req, res) => {
  const category = aiToolsData.categories.find(cat => cat.id === req.params.id);
  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }
  res.json(category);
});

app.get('/api/categories/:id/tools', (req, res) => {
  const category = aiToolsData.categories.find(cat => cat.id === req.params.id);
  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }
  res.json(category.tools);
});

app.get('/api/search', (req, res) => {
  const query = req.query.q?.toLowerCase() || '';
  const results = [];
  
  aiToolsData.categories.forEach(category => {
    if (category.name.toLowerCase().includes(query) || 
        category.description.toLowerCase().includes(query)) {
      results.push({
        type: 'category',
        ...category,
        toolCount: category.tools.length
      });
    }
    
    category.tools.forEach(tool => {
      if (tool.name.toLowerCase().includes(query) || 
          tool.description.toLowerCase().includes(query)) {
        results.push({
          type: 'tool',
          ...tool,
          category: category.name,
          categoryId: category.id,
          categoryColor: category.color
        });
      }
    });
  });
  
  res.json(results.slice(0, 10));
});

app.get('/api/sunburst-data', (req, res) => {
  const sunburstData = {
    name: 'AI Tools',
    children: aiToolsData.categories.map(category => ({
      name: category.name,
      description: category.description,
      color: category.color,
      id: category.id,
      children: category.tools.map(tool => ({
        name: tool.name,
        description: tool.description,
        url: tool.url,
        value: tool.popularity,
        id: tool.id,
        color: category.color
      }))
    }))
  };
  res.json(sunburstData);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});