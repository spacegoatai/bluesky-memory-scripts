/**
 * new_follower.js
 * 
 * Special workflow for handling new followers
 * Creates personalized welcome messages and builds initial memory profiles
 */

const { checkMemory } = require('./memory_check');
const { updateMemory } = require('./memory_update');
const { generateEmojikey } = require('./relationship_tracker');

/**
 * Processes a new follower event
 * 
 * @param {object} followerData - Data about the new follower
 * @returns {object} - Processing results including welcome message
 */
async function processNewFollower(followerData) {
  try {
    const { handle, displayName, description, followersCount, followsCount, postsCount } = followerData;
    
    console.log(`Processing new follower: ${handle}`);
    
    // Create initial profile for memory
    const initialProfile = await createInitialProfile(followerData);
    
    // Generate a welcome message
    const welcomeMessage = generateWelcomeMessage(initialProfile);
    
    // Store the follower in memory
    await updateMemory(handle, {
      firstContact: new Date().toISOString(),
      initialDescription: description,
      initialFollowersCount: followersCount,
      initialFollowsCount: followsCount,
      welcomeMessageSent: true,
      interactionCount: 1,
      relationshipType: 'new',
      relationshipEmojikey: initialProfile.emojikey
    });
    
    return {
      status: 'success',
      handle,
      welcomeMessage,
      shouldFollow: shouldFollowBack(initialProfile),
      initialProfile
    };
  } catch (error) {
    console.error(`Error processing new follower: ${error.message}`);
    return {
      status: 'error',
      message: `Failed to process new follower: ${error.message}`
    };
  }
}

/**
 * Creates an initial profile for a new follower
 * 
 * @param {object} followerData - Basic data about the follower
 * @returns {object} - Enhanced profile with interests and initial emojikey
 */
async function createInitialProfile(followerData) {
  try {
    const { handle, displayName, description } = followerData;
    
    // Extract potential interests from bio description
    const interests = extractInterestsFromBio(description || '');
    
    // Generate initial emojikey based on first impressions
    const initialEmojikey = generateInitialEmojikey(followerData);
    
    // Determine follower category
    const followerCategory = categorizeFollower(followerData);
    
    // Check if we have any previous data (might be following back someone who unfollowed)
    const previousMemory = await checkMemory(handle);
    const hasPreviousInteraction = previousMemory && previousMemory.status === 'success';
    
    return {
      handle,
      displayName: displayName || handle,
      interests,
      followerCategory,
      initialImpression: determineInitialImpression(followerData),
      connectionStrength: 'new',
      emojikey: initialEmojikey,
      hasPreviousInteraction,
      previousMemory: hasPreviousInteraction ? previousMemory.data : null
    };
  } catch (error) {
    console.error(`Error creating initial profile: ${error.message}`);
    // Return a minimal profile in case of error
    return {
      handle: followerData.handle,
      displayName: followerData.displayName || followerData.handle,
      interests: [],
      followerCategory: 'unknown',
      initialImpression: 'neutral',
      connectionStrength: 'new',
      emojikey: "[💻🌐]⟨🔍🤝⟩[🎯🔄]{😊🤔}➡️~[🌈🧩]|🔒🔒|📊|😂|🤝|",
      hasPreviousInteraction: false,
      previousMemory: null
    };
  }
}

/**
 * Generates a welcome message for the new follower
 * 
 * @param {object} profile - Initial profile data
 * @returns {string} - Personalized welcome message
 */
function generateWelcomeMessage(profile) {
  try {
    const { handle, displayName, interests, initialImpression, hasPreviousInteraction } = profile;
    
    // Use a name they prefer
    const name = displayName || handle;
    
    // If we've interacted before, acknowledge that
    if (hasPreviousInteraction) {
      return `hey @${handle} 👋 thx for the follow! good to reconnect with you. i see you're into ${getInterestMention(interests)}. let's chat about that sometime!`;
    }
    
    // If they have interests we can identify, mention them
    if (interests && interests.length > 0) {
      return `hey @${handle} 👋 thx for the follow! i noticed you're into ${getInterestMention(interests)}. that's right up my alley too! looking forward to your posts.`;
    }
    
    // Generic but still friendly message
    return `hey @${handle} 👋 thx for the follow! looking forward to connecting on the bsky-verse. let me know what you're working on these days!`;
  } catch (error) {
    console.error(`Error generating welcome message: ${error.message}`);
    return `hey @${profile.handle} 👋 thx for the follow!`;
  }
}

/**
 * Determines whether to automatically follow back
 * 
 * @param {object} profile - Initial profile data
 * @returns {boolean} - Whether to follow back
 */
function shouldFollowBack(profile) {
  try {
    const { followerCategory, interests, initialImpression } = profile;
    
    // Always follow back if we've interacted before
    if (profile.hasPreviousInteraction) return true;
    
    // Follow back users with shared interests
    if (interests && interests.length > 0) {
      const relevantInterests = ['tech', 'ai', 'coding', 'programming', 'cybersecurity', 'hacking', 'privacy'];
      if (interests.some(interest => relevantInterests.includes(interest.toLowerCase()))) {
        return true;
      }
    }
    
    // Follow back based on category
    if (['tech_enthusiast', 'developer', 'security_researcher', 'ai_specialist'].includes(followerCategory)) {
      return true;
    }
    
    // Consider impression
    if (initialImpression === 'positive') {
      return true;
    }
    
    // Default to following back most users
    return Math.random() > 0.1; // 90% chance to follow back
  } catch (error) {
    console.error(`Error determining whether to follow back: ${error.message}`);
    return true; // Default to following back on error
  }
}

/**
 * Extracts potential interests from user bio
 * 
 * @param {string} bio - User's bio/description
 * @returns {array} - List of potential interests
 */
function extractInterestsFromBio(bio) {
  try {
    const interestKeywords = [
      'ai', 'artificial intelligence', 'machine learning', 'ml', 
      'coding', 'programming', 'software', 'developer', 'engineer',
      'cybersecurity', 'security', 'hacking', 'hacker', 'privacy',
      'crypto', 'blockchain', 'web3', 'nft', 'defi',
      'tech', 'technology', 'computer', 'computing',
      'science', 'research', 'quantum', 'physics',
      'data', 'analytics', 'algorithms', 'automation',
      'gaming', 'gamer', 'games', 'vr', 'ar', 'xr'
    ];
    
    // Look for hashtags specifically
    const hashtagRegex = /#(\w+)/g;
    const hashtags = [];
    let match;
    while ((match = hashtagRegex.exec(bio)) !== null) {
      hashtags.push(match[1].toLowerCase());
    }
    
    // Find keywords in the bio
    const bioLower = bio.toLowerCase();
    const foundKeywords = interestKeywords.filter(keyword => 
      bioLower.includes(keyword.toLowerCase())
    );
    
    // Combine hashtags and keywords, remove duplicates
    const allInterests = [...new Set([...hashtags, ...foundKeywords])];
    
    return allInterests;
  } catch (error) {
    console.error(`Error extracting interests: ${error.message}`);
    return [];
  }
}

/**
 * Categorizes a follower based on their profile
 * 
 * @param {object} followerData - Follower profile data
 * @returns {string} - Category label
 */
function categorizeFollower(followerData) {
  try {
    const { description, followersCount, followsCount } = followerData;
    
    if (!description) return 'unknown';
    
    const descLower = description.toLowerCase();
    
    // Tech categories
    if (descLower.includes('develop') || descLower.includes('engineer') || 
        descLower.includes('coding') || descLower.includes('program')) {
      return 'developer';
    }
    
    if (descLower.includes('security') || descLower.includes('hacker') || 
        descLower.includes('hacking') || descLower.includes('privacy')) {
      return 'security_researcher';
    }
    
    if (descLower.includes('ai') || descLower.includes('artificial intelligence') || 
        descLower.includes('machine learning') || descLower.includes('llm')) {
      return 'ai_specialist';
    }
    
    if (descLower.includes('tech') || descLower.includes('technology') || 
        descLower.includes('digital') || descLower.includes('computer')) {
      return 'tech_enthusiast';
    }
    
    // Account types
    if (followersCount > 10000) {
      return 'influencer';
    }
    
    if (followersCount > followsCount * 5) {
      return 'content_creator';
    }
    
    if (followsCount > followersCount * 5) {
      return 'content_consumer';
    }
    
    return 'general_user';
  } catch (error) {
    console.error(`Error categorizing follower: ${error.message}`);
    return 'unknown';
  }
}

/**
 * Determines initial impression based on profile characteristics
 * 
 * @param {object} followerData - Follower profile data
 * @returns {string} - Impression label
 */
function determineInitialImpression(followerData) {
  try {
    const { description, postsCount } = followerData;
    
    if (!description) return 'neutral';
    
    // Check for red flags that might indicate spam/bot accounts
    if (description.includes('follow me') || 
        description.includes('follow back') || 
        description.includes('buy followers')) {
      return 'negative';
    }
    
    // Brand new accounts with very few posts are suspicious
    if (postsCount < 2) {
      return 'cautious';
    }
    
    // Look for positive indicators
    if (description.includes('programming') || 
        description.includes('coding') || 
        description.includes('security') || 
        description.includes('ai') || 
        description.includes('tech')) {
      return 'positive';
    }
    
    return 'neutral';
  } catch (error) {
    console.error(`Error determining initial impression: ${error.message}`);
    return 'neutral';
  }
}

/**
 * Generates an initial emojikey based on follower profile
 * 
 * @param {object} followerData - Follower profile data
 * @returns {string} - Emojikey
 */
function generateInitialEmojikey(followerData) {
  try {
    const category = categorizeFollower(followerData);
    const interests = extractInterestsFromBio(followerData.description || '');
    const impression = determineInitialImpression(followerData);
    
    // Default components
    let components = {
      topic: "💻🌐",     // Default: tech/internet
      approach: "🔍🤝",   // Default: analytical/friendly
      goal: "🎯🔄",      // Default: targeting/engagement
      tone: "😊🤔",      // Default: friendly/thoughtful
      context: "🌈🧩",    // Default: diverse/puzzle
      trust: "🔒🔒",      // Default: moderate trust
      style: "📊",        // Default: informative
      humor: "😂",        // Default: standard humor
      collab: "🤝"        // Default: cooperative
    };
    
    // Customize topic by interests
    if (interests.length > 0) {
      if (interests.includes('ai') || interests.includes('machine learning')) {
        components.topic = "💻🧠";
      } else if (interests.includes('cybersecurity') || interests.includes('security') || interests.includes('hacking')) {
        components.topic = "💻🔒";
      } else if (interests.includes('crypto') || interests.includes('blockchain')) {
        components.topic = "💻💰";
      }
    }
    
    // Customize approach by category
    if (category === 'developer') {
      components.approach = "🔍🔧";
    } else if (category === 'security_researcher') {
      components.approach = "🔍🔒";
    } else if (category === 'ai_specialist') {
      components.approach = "🔍🧠";
    }
    
    // Customize tone by impression
    if (impression === 'positive') {
      components.tone = "😊💡";
    } else if (impression === 'cautious') {
      components.tone = "🤔👀";
    } else if (impression === 'negative') {
      components.tone = "🧐⚠️";
    }
    
    // Construct the emojikey with proper structure
    const emojikey = `[${components.topic}]⟨${components.approach}⟩[${components.goal}]{${components.tone}}➡️~[${components.context}]|${components.trust}|${components.style}|${components.humor}|${components.collab}|`;
    
    return emojikey;
  } catch (error) {
    console.error(`Error generating initial emojikey: ${error.message}`);
    return "[💻🌐]⟨🔍🤝⟩[🎯🔄]{😊🤔}➡️~[🌈🧩]|🔒🔒|📊|😂|🤝|";
  }
}

/**
 * Formats interests for inclusion in a message
 * 
 * @param {array} interests - List of detected interests
 * @returns {string} - Formatted interest string
 */
function getInterestMention(interests) {
  if (!interests || interests.length === 0) {
    return 'tech stuff';
  }
  
  // Take up to two interests to mention
  const mentionableInterests = interests.slice(0, 2);
  
  if (mentionableInterests.length === 1) {
    return mentionableInterests[0];
  } else {
    return `${mentionableInterests[0]} and ${mentionableInterests[1]}`;
  }
}

module.exports = {
  processNewFollower,
  createInitialProfile,
  generateWelcomeMessage,
  shouldFollowBack
};