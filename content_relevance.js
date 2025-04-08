/**
 * content_relevance.js
 * 
 * Evaluates content for relevance to specific followers
 * Helps determine which content to share with which followers
 */

/**
 * Analyzes a post to extract key topics and themes
 * 
 * @param {object} post - The post object to analyze
 * @returns {object} - Extracted topics and relevance scores
 */
function analyzeContent(post) {
  try {
    const text = post.text || '';
    const topics = extractTopics(text);
    const sentiment = analyzeSentiment(text);
    const hashtags = extractHashtags(text);
    const mentions = extractMentions(text);
    
    return {
      topics,
      sentiment,
      hashtags,
      mentions,
      contentType: determineContentType(post),
      complexity: assessComplexity(text),
      timestamp: post.createdAt || new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error analyzing content: ${error.message}`);
    return {
      topics: [],
      sentiment: 'neutral',
      hashtags: [],
      mentions: [],
      contentType: 'unknown',
      complexity: 'medium',
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Determines if content is relevant to a specific user based on their interests
 * 
 * @param {object} contentAnalysis - Analysis of the content
 * @param {object} userProfile - User profile with interests
 * @returns {object} - Relevance assessment with score and reasons
 */
function assessRelevance(contentAnalysis, userProfile) {
  try {
    const { topics, hashtags, mentions, sentiment, contentType } = contentAnalysis;
    const { interests, preferredContentTypes, connectionStrength, interactionHistory } = userProfile;
    
    // Initialize relevance score
    let relevanceScore = 0;
    const relevanceReasons = [];
    
    // Check topic overlap with user interests
    const topicOverlap = topics.filter(topic => 
      interests.some(interest => 
        interest.toLowerCase().includes(topic.toLowerCase()) || 
        topic.toLowerCase().includes(interest.toLowerCase())
      )
    );
    
    if (topicOverlap.length > 0) {
      relevanceScore += topicOverlap.length * 20;
      relevanceReasons.push(`Topic overlap: ${topicOverlap.join(', ')}`);
    }
    
    // Check hashtag overlap with user interests
    const hashtagOverlap = hashtags.filter(tag => 
      interests.some(interest => 
        interest.toLowerCase().includes(tag.toLowerCase()) || 
        tag.toLowerCase().includes(interest.toLowerCase())
      )
    );
    
    if (hashtagOverlap.length > 0) {
      relevanceScore += hashtagOverlap.length * 15;
      relevanceReasons.push(`Hashtag overlap: ${hashtagOverlap.join(', ')}`);
    }
    
    // Check if user is mentioned
    const userMentioned = mentions.some(mention => 
      mention.toLowerCase() === userProfile.username.toLowerCase()
    );
    
    if (userMentioned) {
      relevanceScore += 50;
      relevanceReasons.push('User mentioned directly');
    }
    
    // Check content type preference
    if (preferredContentTypes.includes(contentType)) {
      relevanceScore += 15;
      relevanceReasons.push(`Preferred content type: ${contentType}`);
    }
    
    // Adjust based on relationship strength
    relevanceScore = adjustForRelationshipStrength(relevanceScore, connectionStrength);
    
    // Determine relevance category
    let relevanceCategory;
    if (relevanceScore >= 70) {
      relevanceCategory = 'high';
    } else if (relevanceScore >= 40) {
      relevanceCategory = 'medium';
    } else {
      relevanceCategory = 'low';
    }
    
    return {
      score: relevanceScore,
      category: relevanceCategory,
      reasons: relevanceReasons,
      isRelevant: relevanceScore >= 40 // Threshold for relevance
    };
  } catch (error) {
    console.error(`Error assessing relevance: ${error.message}`);
    return {
      score: 0,
      category: 'unknown',
      reasons: [`Error: ${error.message}`],
      isRelevant: false
    };
  }
}

/**
 * Finds the most relevant followers for a specific piece of content
 * 
 * @param {object} contentAnalysis - Analysis of the content
 * @param {array} followers - List of follower profiles
 * @param {number} limit - Maximum number of followers to return
 * @returns {array} - Sorted list of relevant followers with scores
 */
function findRelevantFollowers(contentAnalysis, followers, limit = 5) {
  try {
    const relevanceAssessments = followers.map(follower => {
      const assessment = assessRelevance(contentAnalysis, follower);
      return {
        username: follower.username,
        displayName: follower.displayName,
        relevance: assessment
      };
    });
    
    // Sort by relevance score descending
    const sortedFollowers = relevanceAssessments
      .sort((a, b) => b.relevance.score - a.relevance.score)
      .slice(0, limit);
    
    return sortedFollowers;
  } catch (error) {
    console.error(`Error finding relevant followers: ${error.message}`);
    return [];
  }
}

// Helper functions

function extractTopics(text) {
  // Simple approach: look for key noun phrases and common topics
  // In a real implementation, this would use NLP techniques
  const potentialTopics = [
    'ai', 'machine learning', 'coding', 'programming', 
    'cybersecurity', 'security', 'hacking', 'crypto',
    'privacy', 'data', 'tech', 'technology', 'software',
    'quantum', 'blockchain', 'web3', 'nft', 'vr', 'ar',
    'neural network', 'algorithm', 'automation', 'bot'
  ];
  
  return potentialTopics.filter(topic => 
    text.toLowerCase().includes(topic.toLowerCase())
  );
}

function analyzeSentiment(text) {
  // Simple heuristic for sentiment analysis
  // Would use a proper NLP library in production
  const positiveWords = ['good', 'great', 'awesome', 'excellent', 'love', 'like', 'amazing'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'disappointing'];
  
  let positiveCount = positiveWords.filter(word => 
    text.toLowerCase().includes(word.toLowerCase())
  ).length;
  
  let negativeCount = negativeWords.filter(word => 
    text.toLowerCase().includes(word.toLowerCase())
  ).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

function extractHashtags(text) {
  const hashtagRegex = /#(\w+)/g;
  const matches = text.match(hashtagRegex);
  
  if (!matches) return [];
  
  return matches.map(tag => tag.substring(1)); // Remove the # symbol
}

function extractMentions(text) {
  const mentionRegex = /@(\w+(\.\w+)*)/g;
  const matches = text.match(mentionRegex);
  
  if (!matches) return [];
  
  return matches.map(mention => mention.substring(1)); // Remove the @ symbol
}

function determineContentType(post) {
  // Determine what kind of content this is based on structure
  if (post.embed && post.embed.external) return 'link';
  if (post.embed && post.embed.images) return 'image';
  if (post.text && post.text.length > 200) return 'long_text';
  return 'short_text';
}

function assessComplexity(text) {
  // Simple complexity assessment based on text length, word length, and sentence structure
  const words = text.split(/\s+/);
  const averageWordLength = words.join('').length / words.length;
  
  if (text.length > 200 && averageWordLength > 6) return 'high';
  if (text.length > 100 || averageWordLength > 5) return 'medium';
  return 'low';
}

function adjustForRelationshipStrength(score, connectionStrength) {
  // Adjust relevance score based on how close the connection is
  switch (connectionStrength) {
    case 'close':
      return score * 1.2;
    case 'regular':
      return score * 1.0;
    case 'casual':
      return score * 0.8;
    case 'new':
      return score * 1.1; // Slightly boost for new connections to encourage engagement
    default:
      return score;
  }
}

module.exports = {
  analyzeContent,
  assessRelevance,
  findRelevantFollowers
};