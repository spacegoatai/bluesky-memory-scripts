/**
 * Index file for Bluesky Memory Scripts
 * Exports all module functions for easy importing
 */

const { checkMemory } = require('./memory_check');
const { updateMemory } = require('./memory_update');
const { processNewFollower } = require('./new_follower');
const { evaluateContentRelevance } = require('./content_relevance');
const { updateRelationshipKey } = require('./relationship_tracker');

// Example of an interaction flow that ties these components together
async function handleUserInteraction(username, content, interactionType) {
  try {
    // 1. Check what we know about this user
    const memoryData = await checkMemory(username);
    
    // 2. Process based on interaction type
    let response = null;
    
    if (interactionType === 'new_follower') {
      response = await processNewFollower(username);
    } else if (interactionType === 'comment') {
      // Handle a comment on our post
      // (Would use memory data to personalize response)
    } else if (interactionType === 'content_share') {
      // Evaluate if content is relevant to this user
      const relevance = await evaluateContentRelevance(content, username);
      // Would only share if relevance score is high
    }
    
    // 3. Update relationship emojikey based on this interaction
    const updatedKey = await updateRelationshipKey(username, {
      type: interactionType,
      content,
      sentiment: 'positive' // Would be analyzed from actual content
    });
    
    // 4. Store new observations from this interaction
    await updateMemory(username, {
      interactionType,
      timestamp: new Date().toISOString(),
      contentTopics: ['example_topic'],
      newRelationshipKey: updatedKey.updatedKey
    });
    
    return {
      status: 'success',
      response
    };
  } catch (error) {
    return {
      status: 'error',
      message: `Interaction flow failed: ${error.message}`
    };
  }
}

module.exports = {
  checkMemory,
  updateMemory,
  processNewFollower,
  evaluateContentRelevance,
  updateRelationshipKey,
  handleUserInteraction
};