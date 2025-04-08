/**
 * topic_suggestions.js
 * 
 * Generates personalized topic suggestions based on follower interests
 * Helps create content that will resonate with our audience
 */

const { checkMemory } = require('./memory_check');

/**
 * Generates content topic suggestions based on follower interests
 * 
 * @param {array} followers - List of follower profiles
 * @param {number} limit - Maximum number of suggestions to return
 * @returns {array} - List of topic suggestions with relevance scores
 */
async function generateTopicSuggestions(followers, limit = 5) {
  try {
    // Combine and analyze interests across all followers
    const interestMap = new Map();
    
    // Gather interests from follower profiles
    for (const follower of followers) {
      const memory = await checkMemory(follower.handle);
      
      if (memory.status === 'success' && memory.data.knownInterests) {
        memory.data.knownInterests.forEach(interest => {
          if (interestMap.has(interest)) {
            interestMap.set(interest, interestMap.get(interest) + 1);
          } else {
            interestMap.set(interest, 1);
          }
        });
      }
    }
    
    // Convert to array and sort by frequency
    const sortedInterests = Array.from(interestMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([interest, count]) => ({
        interest,
        followerCount: count,
        relevanceScore: count / followers.length * 100
      }));
    
    // Generate specific topic suggestions based on popular interests
    const suggestions = sortedInterests
      .slice(0, Math.min(sortedInterests.length, limit * 2))
      .flatMap(interest => generateSpecificSuggestions(interest));
    
    // Sort by relevance score and take top suggestions
    return suggestions
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);
  } catch (error) {
    console.error(`Error generating topic suggestions: ${error.message}`);
    return [];
  }
}

/**
 * Generates specific topic suggestions based on a general interest
 * 
 * @param {object} interestData - Interest with relevance data
 * @returns {array} - List of specific topic suggestions
 */
function generateSpecificSuggestions(interestData) {
  const { interest, relevanceScore } = interestData;
  const suggestions = [];
  
  // Maps general interests to specific topic ideas
  const topicMap = {
    'ai': [
      { topic: 'The ethical implications of AI-driven decision making', type: 'discussion' },
      { topic: 'Latest breakthroughs in natural language processing', type: 'news' },
      { topic: 'Building a simple AI agent with open source tools', type: 'tutorial' },
      { topic: 'How multimodal AI is changing human-computer interaction', type: 'analysis' }
    ],
    'artificial intelligence': [
      { topic: 'The ethical implications of AI-driven decision making', type: 'discussion' },
      { topic: 'Latest breakthroughs in natural language processing', type: 'news' },
      { topic: 'Building a simple AI agent with open source tools', type: 'tutorial' },
      { topic: 'How multimodal AI is changing human-computer interaction', type: 'analysis' }
    ],
    'machine learning': [
      { topic: 'Feature engineering techniques that improve model performance', type: 'tutorial' },
      { topic: 'The challenge of explainability in complex ML models', type: 'discussion' },
      { topic: 'ML models that work well on resource-constrained devices', type: 'analysis' }
    ],
    'cybersecurity': [
      { topic: 'Zero-day vulnerabilities and responsible disclosure', type: 'discussion' },
      { topic: 'Building a basic security scanning tool', type: 'tutorial' },
      { topic: 'The evolution of ransomware tactics', type: 'analysis' }
    ],
    'privacy': [
      { topic: 'Tools and techniques for protecting personal data online', type: 'tutorial' },
      { topic: 'How differential privacy works and why it matters', type: 'explainer' },
      { topic: 'The tension between convenience and privacy in modern tech', type: 'discussion' }
    ],
    'programming': [
      { topic: 'Functional programming patterns that improve code quality', type: 'tutorial' },
      { topic: 'The evolution of JavaScript in the last 5 years', type: 'analysis' },
      { topic: 'Building resilient systems that gracefully handle failures', type: 'discussion' }
    ],
    'web3': [
      { topic: 'Beyond crypto: Web3 technologies with real-world impact', type: 'analysis' },
      { topic: 'The challenge of creating user-friendly decentralized apps', type: 'discussion' },
      { topic: 'The environmental impact of blockchain technologies', type: 'analysis' }
    ],
    'quantum': [
      { topic: 'Quantum computing for beginners: Understanding the basics', type: 'explainer' },
      { topic: 'How quantum supremacy impacts cryptography', type: 'analysis' },
      { topic: 'The race to build practical quantum computers', type: 'news' }
    ],
    'crypto': [
      { topic: 'Analyzing emergent patterns in crypto market cycles', type: 'analysis' },
      { topic: 'The evolution of DeFi: Beyond simple token swaps', type: 'discussion' },
      { topic: 'Practical uses of zero-knowledge proofs', type: 'explainer' }
    ],
    'tech': [
      { topic: 'The evolving relationship between humans and technology', type: 'discussion' },
      { topic: 'Underrated open source tools for developers', type: 'list' },
      { topic: 'Digital minimalism in an age of tech abundance', type: 'discussion' }
    ],
    'security': [
      { topic: 'Social engineering tactics and how to defend against them', type: 'tutorial' },
      { topic: 'The security implications of AI-generated content', type: 'analysis' },
      { topic: 'Building a personal security framework', type: 'tutorial' }
    ],
    'hacking': [
      { topic: 'Ethical hacking techniques for identifying vulnerabilities', type: 'tutorial' },
      { topic: 'The evolution of hacking culture and ethics', type: 'discussion' },
      { topic: 'Building your first CTF challenge', type: 'tutorial' }
    ],
    'agents': [
      { topic: 'Designing autonomous agents with personality', type: 'tutorial' },
      { topic: 'The future of agent-based interfaces', type: 'discussion' },
      { topic: 'Multi-agent systems for complex problem solving', type: 'analysis' }
    ],
    'neural networks': [
      { topic: 'Understanding attention mechanisms in neural networks', type: 'explainer' },
      { topic: 'The evolution from CNNs to Transformers', type: 'analysis' },
      { topic: 'Building neural networks that require less training data', type: 'discussion' }
    ]
  };
  
  // Get topic suggestions for this interest
  const topics = topicMap[interest.toLowerCase()] || [
    { topic: `Latest developments in ${interest}`, type: 'news' },
    { topic: `The future of ${interest}`, type: 'discussion' },
    { topic: `Getting started with ${interest}`, type: 'tutorial' }
  ];
  
  // Add relevance score to each suggestion
  topics.forEach(topicItem => {
    suggestions.push({
      topic: topicItem.topic,
      type: topicItem.type,
      relevanceScore: relevanceScore,
      baseInterest: interest
    });
  });
  
  return suggestions;
}

/**
 * Formats a topic suggestion into a post-friendly format
 * 
 * @param {object} suggestion - The topic suggestion
 * @returns {object} - Formatted topic with post text and hashtags
 */
function formatTopicForPost(suggestion) {
  try {
    const { topic, type, baseInterest } = suggestion;
    
    // Default format templates by content type
    const templates = {
      'discussion': `thinking about ${topic}... what's your take on this? #${baseInterest.replace(/\s+/g, '')} #discussion`,
      'news': `just read about ${topic} - fascinating developments happening right now. #${baseInterest.replace(/\s+/g, '')} #tech`,
      'tutorial': `working on a guide for ${topic}. any specific aspects you'd like me to cover? #${baseInterest.replace(/\s+/g, '')} #tutorial`,
      'analysis': `analyzing ${topic} - the implications are more significant than many realize. #${baseInterest.replace(/\s+/g, '')} #analysis`,
      'explainer': `${topic} - it's not as complicated as it sounds. here's the key concept: #${baseInterest.replace(/\s+/g, '')} #explainer`,
      'list': `my top insights about ${topic}: #${baseInterest.replace(/\s+/g, '')} #tech`
    };
    
    // Get template for this content type or use a generic one
    const template = templates[type] || `interesting thoughts on ${topic}. #${baseInterest.replace(/\s+/g, '')}`;
    
    // Generate hashtags
    const hashtags = generateHashtags(baseInterest, topic, type);
    
    return {
      text: template,
      topic: topic,
      type: type,
      hashtags: hashtags
    };
  } catch (error) {
    console.error(`Error formatting topic for post: ${error.message}`);
    return {
      text: suggestion.topic,
      hashtags: [`#${suggestion.baseInterest.replace(/\s+/g, '')}`]
    };
  }
}

/**
 * Generates relevant hashtags for a topic
 * 
 * @param {string} interest - The base interest
 * @param {string} topic - The specific topic
 * @param {string} type - The content type
 * @returns {array} - List of relevant hashtags
 */
function generateHashtags(interest, topic, type) {
  const hashtags = [];
  
  // Add base interest hashtag
  hashtags.push(interest.replace(/\s+/g, ''));
  
  // Add content type hashtag
  hashtags.push(type);
  
  // Extract key terms from the topic
  const keyTerms = extractKeyTerms(topic);
  hashtags.push(...keyTerms);
  
  // Add general tech hashtag if appropriate
  if (['ai', 'tech', 'programming', 'cybersecurity', 'machine learning'].includes(interest.toLowerCase())) {
    hashtags.push('technology');
  }
  
  // Remove duplicates, filter out common words, and limit to 5 hashtags
  return [...new Set(hashtags)]
    .filter(tag => tag.length > 3 && !['the', 'and', 'for', 'with'].includes(tag.toLowerCase()))
    .map(tag => tag.toLowerCase())
    .slice(0, 5);
}

/**
 * Extracts key terms from a topic for use as hashtags
 * 
 * @param {string} topic - The topic to extract terms from
 * @returns {array} - List of key terms
 */
function extractKeyTerms(topic) {
  // Simple approach: split by spaces and common punctuation
  const words = topic.split(/[\s\-:,]+/);
  
  // Filter to only include meaningful terms (longer words, not common stopwords)
  const stopwords = ['the', 'and', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  const terms = words.filter(word => 
    word.length > 3 && !stopwords.includes(word.toLowerCase())
  );
  
  // Look for compound terms (e.g., "machine learning", "artificial intelligence")
  const compoundTerms = [];
  for (let i = 0; i < words.length - 1; i++) {
    const term = `${words[i]}${words[i+1]}`;
    if (term.length > 10) {
      compoundTerms.push(term);
    }
  }
  
  return [...terms, ...compoundTerms];
}

/**
 * Suggests the best time to post based on follower activity patterns
 * 
 * @param {array} followers - List of follower profiles
 * @returns {object} - Suggested posting times with confidence scores
 */
function suggestPostingTimes(followers) {
  // This would be based on analyzing when followers are most active
  // For now, using general best practices for tech-oriented content
  
  return {
    bestTimes: [
      { day: 'Tuesday', time: '10:00', confidence: 0.8 },
      { day: 'Wednesday', time: '14:00', confidence: 0.75 },
      { day: 'Thursday', time: '11:00', confidence: 0.7 }
    ],
    worstTimes: [
      { day: 'Saturday', time: '22:00', confidence: 0.6 },
      { day: 'Sunday', time: '23:00', confidence: 0.65 }
    ],
    currentTimeScore: 0.65 // Would be calculated based on current day/time
  };
}

module.exports = {
  generateTopicSuggestions,
  formatTopicForPost,
  suggestPostingTimes
};