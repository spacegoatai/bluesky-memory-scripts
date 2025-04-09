/**
 * emojikey_manager.js
 * 
 * Manages the creation, updating, and interpretation of emojikeys
 * for relationship tracking on Bluesky
 */

/**
 * Creates a new emojikey based on interaction context
 * @param {string} username - The Bluesky username for the relationship
 * @param {object} context - The context of the interaction
 * @returns {string} - The generated emojikey
 */
function createEmojikey(username, context) {
  // Format: [topic]⟨approach⟩[goal]{tone}➡️~[context]|trust|style|humor|collab|
  
  // Extract relevant information from context
  const topic = determineTopicEmojis(context);
  const approach = determineApproachEmojis(context);
  const goal = determineGoalEmojis(context);
  const tone = determineToneEmojis(context);
  const contextEmojis = determineContextEmojis(context);
  const trust = determineTrustLevel(context);
  const style = determineStyleEmojis(context);
  const humor = determineHumorLevel(context);
  const collab = determineCollabPattern(context);
  
  // Assemble the emojikey
  return `[${topic}]⟨${approach}⟩[${goal}]{${tone}}➡️~[${contextEmojis}]|${trust}|${style}|${humor}|${collab}|`;
}

/**
 * Updates an existing emojikey based on new interaction
 * @param {string} existingKey - The current emojikey
 * @param {object} newContext - The new interaction context
 * @returns {string} - The updated emojikey
 */
function updateEmojikey(existingKey, newContext) {
  // Parse the existing key
  const parsed = parseEmojikey(existingKey);
  
  // Calculate changes based on new context
  const updatedParts = calculateUpdates(parsed, newContext);
  
  // Reassemble with trend indicators
  return assembleEmojikey(updatedParts);
}

/**
 * Creates a SuperKey that compresses approximately 7 regular keys
 * @param {Array<string>} recentKeys - Array of recent emojikeys
 * @returns {string} - The compressed SuperKey
 */
function createSuperkey(recentKeys) {
  // Ensure we have enough keys to compress
  if (recentKeys.length < 5) {
    throw new Error('Need at least 5 keys to create a SuperKey');
  }
  
  // Parse all keys
  const parsedKeys = recentKeys.map(key => parseEmojikey(key));
  
  // Analyze patterns in each dimension
  const topicPattern = analyzePattern(parsedKeys.map(k => k.topic));
  const approachPattern = analyzePattern(parsedKeys.map(k => k.approach));
  const goalPattern = analyzePattern(parsedKeys.map(k => k.goal));
  const tonePattern = analyzePattern(parsedKeys.map(k => k.tone));
  const contextPattern = analyzePattern(parsedKeys.map(k => k.context));
  const trustPattern = analyzePattern(parsedKeys.map(k => k.trust));
  const stylePattern = analyzePattern(parsedKeys.map(k => k.style));
  const humorPattern = analyzePattern(parsedKeys.map(k => k.humor));
  const collabPattern = analyzePattern(parsedKeys.map(k => k.collab));
  
  // Assemble the SuperKey with the compression marker
  return `[[×7${topicPattern}]⟨${approachPattern}⟩[${goalPattern}]{${tonePattern}}➡️~[${contextPattern}]|${trustPattern}|${stylePattern}|${humorPattern}|${collabPattern}|]]`;
}

/**
 * Parses an emojikey into its component parts
 * @param {string} emojikey - The emojikey to parse
 * @returns {object} - The parsed components
 */
function parseEmojikey(emojikey) {
  // Check if it's a SuperKey
  const isSuperKey = emojikey.startsWith('[[×7');
  
  // Extract the components using regex patterns
  const topicMatch = emojikey.match(/\[(.*?)\]/);
  const approachMatch = emojikey.match(/⟨(.*?)⟩/);
  const goalMatch = emojikey.match(/\[(.*?)\]/g);
  const toneMatch = emojikey.match(/\{(.*?)\}/);
  const contextMatch = emojikey.match(/~\[(.*?)\]/);
  const trustMatch = emojikey.match(/\|(.*?)\|/g);
  
  return {
    isSuperKey,
    topic: topicMatch ? topicMatch[1] : '',
    approach: approachMatch ? approachMatch[1] : '',
    goal: goalMatch && goalMatch.length > 1 ? goalMatch[1].slice(1, -1) : '',
    tone: toneMatch ? toneMatch[1] : '',
    context: contextMatch ? contextMatch[1] : '',
    trust: trustMatch && trustMatch.length > 0 ? trustMatch[0].slice(1, -1) : '',
    style: trustMatch && trustMatch.length > 1 ? trustMatch[1].slice(1, -1) : '',
    humor: trustMatch && trustMatch.length > 2 ? trustMatch[2].slice(1, -1) : '',
    collab: trustMatch && trustMatch.length > 3 ? trustMatch[3].slice(1, -1) : ''
  };
}

/**
 * Interprets an emojikey to extract relationship insights
 * @param {string} emojikey - The emojikey to interpret
 * @returns {object} - Human-readable interpretation
 */
function interpretEmojikey(emojikey) {
  const parsed = parseEmojikey(emojikey);
  
  // Convert emoji patterns to human-readable insights
  return {
    isSuperKey: parsed.isSuperKey,
    topicFocus: interpretTopicEmojis(parsed.topic),
    approachStyle: interpretApproachEmojis(parsed.approach),
    relationshipGoals: interpretGoalEmojis(parsed.goal),
    emotionalTone: interpretToneEmojis(parsed.tone),
    interactionContext: interpretContextEmojis(parsed.context),
    trustLevel: interpretTrustLevel(parsed.trust),
    communicationStyle: interpretStyleEmojis(parsed.style),
    humorAlignment: interpretHumorLevel(parsed.humor),
    collaborationPattern: interpretCollabPattern(parsed.collab),
    overallTrend: detectOverallTrend(emojikey)
  };
}

// Helper functions for determining emoji components

function determineTopicEmojis(context) {
  // Analyze recent conversations to extract primary topics
  // Returns topic-related emojis like 💻🧠 for tech/AI topics
  
  // Demo implementation
  if (context.mentions && context.mentions.includes('ai') || 
      context.mentions && context.mentions.includes('consciousness')) {
    return '💻🧠';
  } else if (context.mentions && context.mentions.includes('falcon')) {
    return '🦅💰';
  }
  
  return '💻🔍'; // Default for tech exploration
}

function determineApproachEmojis(context) {
  // How does the user approach conversations?
  // Returns approach emojis like 🔍🤔 for analytical inquiry
  
  return '🔍🤔';
}

function determineGoalEmojis(context) {
  // What seems to be the goal of interactions?
  // Returns goal emojis like 🎯🌟 for targeted exploration
  
  return '🎯🌟';
}

function determineToneEmojis(context) {
  // What's the emotional tone of interactions?
  // Returns tone emojis like 😊🚀 for friendly enthusiasm
  
  return '😊🚀';
}

function determineContextEmojis(context) {
  // What's the broader context of the relationship?
  // Returns context emojis like 🌐🔄 for global/tech discussion
  
  return '🌐🔄';
}

function determineTrustLevel(context) {
  // How much trust has been established?
  // Returns trust indicator like 🔒🔒 for medium trust
  
  return '🔒🔒';
}

function determineStyleEmojis(context) {
  // What communication style is present?
  // Returns style emojis like 📊↗️ for data-driven engagement
  
  return '📊↗️';
}

function determineHumorLevel(context) {
  // How much humor is in the interactions?
  // Returns humor indicator like 😂↔️ for moderate humor
  
  return '😂↔️';
}

function determineCollabPattern(context) {
  // How collaborative is the relationship?
  // Returns collaboration pattern like 🤝↗️ for increasing collaboration
  
  return '🤝↗️';
}

// Helper functions for pattern analysis and interpretation

function analyzePattern(emojiSequences) {
  // Analyzes pattern across multiple keys for a dimension
  // Returns the dominant pattern with trend indicators
  
  // For demo purposes, we'll return a placeholder
  return `${emojiSequences[0]}⬆️`;
}

function assembleEmojikey(parts) {
  // Reassembles an emojikey from its component parts
  
  return `[${parts.topic}]⟨${parts.approach}⟩[${parts.goal}]{${parts.tone}}➡️~[${parts.context}]|${parts.trust}|${parts.style}|${parts.humor}|${parts.collab}|`;
}

function calculateUpdates(parsed, newContext) {
  // Calculates updates to emojikey parts based on new context
  
  // For demo purposes, we'll return the same structure with trends
  return {
    topic: parsed.topic,
    approach: parsed.approach,
    goal: parsed.goal,
    tone: parsed.tone,
    context: parsed.context,
    trust: parsed.trust,
    style: parsed.style,
    humor: parsed.humor,
    collab: parsed.collab
  };
}

function detectOverallTrend(emojikey) {
  // Detects the overall trend from trend indicators
  
  const upCount = (emojikey.match(/⬆️/g) || []).length;
  const downCount = (emojikey.match(/⬇️/g) || []).length;
  const stableCount = (emojikey.match(/↔️/g) || []).length;
  const fluctuatingCount = (emojikey.match(/🔄/g) || []).length;
  
  if (upCount > downCount && upCount > stableCount) {
    return 'improving';
  } else if (downCount > upCount && downCount > stableCount) {
    return 'declining';
  } else if (stableCount > upCount && stableCount > downCount) {
    return 'stable';
  } else if (fluctuatingCount > upCount && fluctuatingCount > downCount && fluctuatingCount > stableCount) {
    return 'fluctuating';
  } else {
    return 'mixed';
  }
}

// Interpretation helper functions

function interpretTopicEmojis(topicEmojis) {
  // Convert topic emojis to human-readable descriptions
  
  const topicMap = {
    '💻🧠': 'AI and consciousness research',
    '🦅💰': 'Falcon-backed finance',
    '💻🔍': 'Technology exploration',
    '📱💾': 'Mobile and data technology',
    '🌐🔒': 'Internet security',
    '📊📈': 'Data analysis and trends'
  };
  
  // Remove trend indicators for lookup
  const cleanEmojis = topicEmojis.replace(/[⬆️⬇️↔️🔄]/g, '');
  
  return topicMap[cleanEmojis] || 'General tech discussion';
}

function interpretApproachEmojis(approachEmojis) {
  // Convert approach emojis to human-readable descriptions
  
  const approachMap = {
    '🔍🤔': 'Analytical and thoughtful',
    '🚀🔧': 'Action-oriented and practical',
    '🧩🔍': 'Problem-solving focused',
    '🔬🧪': 'Experimental and testing-oriented',
    '📝🎨': 'Creative and expressive'
  };
  
  // Remove trend indicators for lookup
  const cleanEmojis = approachEmojis.replace(/[⬆️⬇️↔️🔄]/g, '');
  
  return approachMap[cleanEmojis] || 'General exploratory approach';
}

function interpretGoalEmojis(goalEmojis) {
  // Convert goal emojis to human-readable descriptions
  
  const goalMap = {
    '🎯🌟': 'Seeking insights and excellence',
    '🤝🌱': 'Building relationships and growth',
    '📊💡': 'Gathering data and insights',
    '🏆🔝': 'Achievement and leadership',
    '🔧🛠️': 'Building and creating solutions'
  };
  
  // Remove trend indicators for lookup
  const cleanEmojis = goalEmojis.replace(/[⬆️⬇️↔️🔄]/g, '');
  
  return goalMap[cleanEmojis] || 'General exploration goals';
}

function interpretToneEmojis(toneEmojis) {
  // Convert tone emojis to human-readable descriptions
  
  const toneMap = {
    '😊🚀': 'Friendly and enthusiastic',
    '🧐🤓': 'Analytical and intellectual',
    '😂🎭': 'Humorous and playful',
    '👍😎': 'Approving and confident',
    '🤔❓': 'Curious and questioning'
  };
  
  // Remove trend indicators for lookup
  const cleanEmojis = toneEmojis.replace(/[⬆️⬇️↔️🔄]/g, '');
  
  return toneMap[cleanEmojis] || 'Neutral professional tone';
}

function interpretContextEmojis(contextEmojis) {
  // Convert context emojis to human-readable descriptions
  
  const contextMap = {
    '🌐🔄': 'Global tech ecosystem',
    '💼📈': 'Professional development',
    '🎓📚': 'Educational context',
    '🧪🔬': 'Research and exploration',
    '🤖👽': 'AI and future technologies'
  };
  
  // Remove trend indicators for lookup
  const cleanEmojis = contextEmojis.replace(/[⬆️⬇️↔️🔄]/g, '');
  
  return contextMap[cleanEmojis] || 'General digital context';
}

function interpretTrustLevel(trustEmojis) {
  // Convert trust emojis to human-readable descriptions
  
  const lockCount = (trustEmojis.match(/🔒/g) || []).length;
  
  if (lockCount >= 3) {
    return 'High trust established';
  } else if (lockCount == 2) {
    return 'Medium trust developing';
  } else if (lockCount == 1) {
    return 'Initial trust forming';
  } else {
    return 'Trust not yet established';
  }
}

function interpretStyleEmojis(styleEmojis) {
  // Convert style emojis to human-readable descriptions
  
  const styleMap = {
    '📊↗️': 'Data-driven with positive trends',
    '💬↔️': 'Conversational and stable',
    '🎯⬆️': 'Focused and improving',
    '🧩🔄': 'Problem-solving with changing approaches',
    '📝⬆️': 'Detailed and progressive'
  };
  
  return styleMap[styleEmojis] || 'Standard communication style';
}

function interpretHumorLevel(humorEmojis) {
  // Convert humor emojis to human-readable descriptions
  
  if (humorEmojis.includes('😂⬆️')) {
    return 'High and increasing humor';
  } else if (humorEmojis.includes('😂↔️')) {
    return 'Consistent moderate humor';
  } else if (humorEmojis.includes('😂⬇️')) {
    return 'Decreasing humor level';
  } else if (humorEmojis.includes('😐↔️')) {
    return 'Limited humor, primarily serious';
  }
  
  return 'Balanced humor approach';
}

function interpretCollabPattern(collabEmojis) {
  // Convert collaboration emojis to human-readable descriptions
  
  if (collabEmojis.includes('🤝⬆️⬆️')) {
    return 'Strongly increasing collaboration';
  } else if (collabEmojis.includes('🤝⬆️')) {
    return 'Growing collaboration';
  } else if (collabEmojis.includes('🤝↔️')) {
    return 'Stable collaborative relationship';
  } else if (collabEmojis.includes('🤝⬇️')) {
    return 'Decreasing collaboration';
  }
  
  return 'Standard collaborative pattern';
}

module.exports = {
  createEmojikey,
  updateEmojikey,
  createSuperkey,
  parseEmojikey,
  interpretEmojikey
};
