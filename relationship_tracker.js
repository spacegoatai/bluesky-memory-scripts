/**
 * relationship_tracker.js
 * 
 * Tracks and manages relationship context using an emojikey-inspired system
 * 
 * Each key follows the structure:
 * [topic]⟨approach⟩[goal]{tone}➡️~[context]|trust|style|humor|collab|
 */

/**
 * Generates a relationship emojikey based on interaction history
 * 
 * @param {string} username - The Bluesky username 
 * @param {object} interactionHistory - History of interactions with the user
 * @returns {string} - Generated emojikey
 */
function generateEmojikey(username, interactionHistory) {
  try {
    // Default components
    let components = {
      topic: "💻🌐",       // Default topic: tech/internet
      approach: "🔍🤝",    // Default approach: analytical/friendly
      goal: "🎯🔄",       // Default goal: targeting/engagement
      tone: "😊🤔",       // Default tone: friendly/thoughtful
      context: "🌈🧩",     // Default context: diverse/puzzle-solving
      trust: "🔒🔒",       // Default trust: moderate
      style: "📊",         // Default style: informative
      humor: "😂",         // Default humor: standard
      collab: "🤝"         // Default collaboration: cooperative
    };
    
    // Analyze interaction history to customize components
    if (interactionHistory && interactionHistory.length > 0) {
      // Example logic: 
      // - If user frequently discusses AI, change topic to 💻🧠
      // - If interactions have been technical, change approach to 🔍🔧
      // - If user responds well to humor, increase humor to 😂⬆️
      
      // This would be replaced with actual analysis of the interaction history
    }
    
    // Construct the emojikey with proper structure
    const emojikey = `[${components.topic}]⟨${components.approach}⟩[${components.goal}]{${components.tone}}➡️~[${components.context}]|${components.trust}|${components.style}|${components.humor}|${components.collab}|`;
    
    return emojikey;
  } catch (error) {
    console.error(`Error generating emojikey: ${error.message}`);
    // Return a default emojikey if generation fails
    return "[💻🌐]⟨🔍🤝⟩[🎯🔄]{😊🤔}➡️~[🌈🧩]|🔒🔒|📊|😂|🤝|";
  }
}

/**
 * Interprets an emojikey to understand relationship context
 * 
 * @param {string} emojikey - The relationship emojikey to interpret
 * @returns {object} - Interpretation of the emojikey components
 */
function interpretEmojikey(emojikey) {
  try {
    // Parse the emojikey into its components
    const topicMatch = emojikey.match(/\[(.*?)\]/);
    const approachMatch = emojikey.match(/⟨(.*?)⟩/);
    const goalMatch = emojikey.match(/\[(.*?)\].*?\[(.*?)\]/);
    const toneMatch = emojikey.match(/\{(.*?)\}/);
    const contextMatch = emojikey.match(/~\[(.*?)\]/);
    const trustMatch = emojikey.match(/\|(.*?)\|/);
    
    // Extract and interpret each component
    // This would involve mapping emoji patterns to meaningful descriptions
    
    return {
      topicArea: topicMatch ? interpretTopic(topicMatch[1]) : "technology",
      approachStyle: approachMatch ? interpretApproach(approachMatch[1]) : "analytical",
      goalOrientation: goalMatch ? interpretGoal(goalMatch[2]) : "engagement",
      tonePreference: toneMatch ? interpretTone(toneMatch[1]) : "friendly",
      contextFraming: contextMatch ? interpretContext(contextMatch[1]) : "diverse",
      trustLevel: trustMatch ? countLockEmojis(trustMatch[1]) : 2,
      // Additional components would be interpreted similarly
    };
  } catch (error) {
    console.error(`Error interpreting emojikey: ${error.message}`);
    return {
      topicArea: "technology",
      approachStyle: "analytical",
      goalOrientation: "engagement",
      tonePreference: "friendly",
      contextFraming: "diverse",
      trustLevel: 2
    };
  }
}

// Helper functions to interpret specific emojikey components
// These would be expanded with comprehensive mappings

function interpretTopic(topic) {
  if (topic.includes("🧠")) return "artificial intelligence";
  if (topic.includes("🔒")) return "cybersecurity";
  if (topic.includes("🐦")) return "social media";
  return "technology";
}

function interpretApproach(approach) {
  if (approach.includes("🔧")) return "technical";
  if (approach.includes("🎭")) return "playful";
  if (approach.includes("🧩")) return "problem-solving";
  return "analytical";
}

function interpretGoal(goal) {
  if (goal.includes("🚀")) return "growth-oriented";
  if (goal.includes("🤖")) return "automation";
  if (goal.includes("📝")) return "documentation";
  return "engagement";
}

function interpretTone(tone) {
  if (tone.includes("🤣")) return "humorous";
  if (tone.includes("🧐")) return "critical";
  if (tone.includes("💡")) return "insightful";
  return "friendly";
}

function interpretContext(context) {
  if (context.includes("🐦")) return "social media";
  if (context.includes("🧩")) return "complex problem";
  if (context.includes("🔄")) return "evolving situation";
  return "diverse";
}

function countLockEmojis(trustString) {
  return (trustString.match(/🔒/g) || []).length;
}

module.exports = { 
  generateEmojikey,
  interpretEmojikey
};