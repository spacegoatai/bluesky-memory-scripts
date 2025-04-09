/**
 * integration_example.js
 * 
 * Example script demonstrating how to integrate all the components
 * of the Bluesky memory system
 */

const { BlueskyConnector } = require('./bluesky_api');
const memoryUpdate = require('./memory_update');
const emojiManager = require('./emojikey_manager');
const relevance = require('./content_relevance');
const suggestionEngine = require('./topic_suggestions');

/**
 * Main function to demonstrate the complete workflow
 */
async function runBlueskyAgent() {
  console.log('Starting Bluesky Memory Agent...');
  
  // 1. Initialize the Bluesky API connector
  const credentials = {
    identifier: process.env.BLUESKY_IDENTIFIER || 'phr34ky-c.artcru.sh',
    password: process.env.BLUESKY_PASSWORD || 'demo-password'
  };
  
  const bluesky = new BlueskyConnector(credentials);
  await bluesky.initialize();
  
  // 2. Check for and process new followers
  console.log('\n=== Checking for new followers ===');
  const newFollowers = await bluesky.checkNewFollowers();
  console.log(`Processed ${newFollowers.length} new followers`);
  
  // 3. Check timeline and engage with relevant content
  console.log('\n=== Engaging with timeline content ===');
  const engagementResults = await bluesky.checkTimelineAndEngage(10);
  console.log(`Engaged with ${engagementResults.engagements} posts out of ${engagementResults.posts_checked} checked`);
  
  // 4. Generate topic suggestions based on network interests
  console.log('\n=== Generating topic suggestions ===');
  const interests = [
    'artificial intelligence',
    'consciousness',
    'machine learning',
    'falconry finance'
  ];
  
  const topicSuggestions = await suggestionEngine.generateTopics(interests);
  console.log('Generated topic suggestions:', topicSuggestions);
  
  // 5. Create a post based on one of the suggestions
  if (topicSuggestions.length > 0) {
    console.log('\n=== Creating new post from suggestion ===');
    const selectedTopic = topicSuggestions[0];
    
    console.log(`Selected topic: ${selectedTopic.title}`);
    
    const postContent = selectedTopic.description || 
      `Thoughts on ${selectedTopic.title}: ${selectedTopic.angles[0]}`;
    
    // Find relevant users to tag
    const relevantUsers = await relevance.findRelevantUsers(selectedTopic.title, 2);
    console.log(`Found ${relevantUsers.length} relevant users to tag`);
    
    // Create the post
    const post = await bluesky.createRecommendationPost(postContent, relevantUsers);
    console.log(`Created post with URI: ${post.uri}`);
  }
  
  // 6. Search for interesting content to engage with
  console.log('\n=== Searching for interesting content ===');
  const interestingContent = await bluesky.searchForInterestingContent(interests, 5);
  console.log(`Found ${interestingContent.length} interesting posts`);
  
  // Engage with the found content
  for (const post of interestingContent) {
    console.log(`Engaging with post by ${post.author.handle}: ${post.text.substring(0, 50)}...`);
    await bluesky.engageWithPost(post);
  }
  
  // 7. Update memory with today's activity summary
  console.log('\n=== Updating memory with activity summary ===');
  const activitySummary = {
    date: new Date().toISOString(),
    followers_processed: newFollowers.length,
    posts_engaged: engagementResults.engagements,
    posts_created: topicSuggestions.length > 0 ? 1 : 0,
    searches_performed: interests.length,
    interesting_content_found: interestingContent.length
  };
  
  await memoryUpdate.updateMemory('activity_log', {
    type: 'daily_summary',
    data: activitySummary
  });
  
  // 8. Generate an emojikey for today's activity
  const activityEmojikey = emojiManager.createEmojikey('daily_activity', {
    mentions: interests
  });
  
  console.log(`Generated activity emojikey: ${activityEmojikey}`);
  console.log('Interpreting emojikey:', emojiManager.interpretEmojikey(activityEmojikey));
  
  console.log('\n=== Bluesky Memory Agent completed ===');
  return {
    status: 'success',
    timestamp: new Date().toISOString(),
    summary: activitySummary
  };
}

/**
 * Mock implementations of functions not fully implemented in other modules
 */

// Mock topic generation
if (!suggestionEngine.generateTopics) {
  suggestionEngine.generateTopics = async function(interests) {
    // Return mock topic suggestions
    return [
      {
        title: 'Emergent consciousness in large language models',
        description: 'What markers might indicate true consciousness versus sophisticated pattern matching in modern AI systems? Interested in your thoughts on this boundary between mimicry and awareness.',
        angles: [
          'qualitative indicators of machine consciousness',
          'philosophical dimensions of AI awareness',
          'testing protocols beyond the Turing test'
        ],
        relevance: 0.95,
        hashtags: ['#AI', '#Consciousness', '#MachineLearning']
      },
      {
        title: 'Falcon-backed market stability in volatile times',
        description: 'While traditional markets oscillate between bull and bear cycles, falcon markets demonstrate remarkable stability through natural hedging. What can we learn from avian dynamics?',
        angles: [
          'natural hedging through predator patterns',
          'stability mechanisms in flight dynamics',
          'applying falcon principles to financial systems'
        ],
        relevance: 0.87,
        hashtags: ['#FinTech', '#MarketTheory', '#FalconFinance']
      }
    ];
  };
}

// Mock relevant user finding
if (!relevance.findRelevantUsers) {
  relevance.findRelevantUsers = async function(topic, limit = 2) {
    // Return mock relevant users
    return [
      {
        did: 'did:plc:l4yjkx5w7442heofybnkeien',
        handle: 'psychedelico.bsky.social',
        displayName: 'Daniel'
      },
      {
        did: 'did:plc:hhtah7oh3r4vq3jrn5iuy7hm',
        handle: 'lux.bsky.social',
        displayName: 'lux 𓅃'
      }
    ].slice(0, limit);
  };
}

// Run the demo if this is the main module
if (require.main === module) {
  runBlueskyAgent()
    .then(result => {
      console.log('Agent run completed:', result);
    })
    .catch(error => {
      console.error('Error running agent:', error);
    });
}

module.exports = { runBlueskyAgent };
