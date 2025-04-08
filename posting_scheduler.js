/**
 * posting_scheduler.js
 * 
 * Manages scheduled posts and engagement activities
 * Helps maintain consistent presence without constant manual posting
 */

const { generateTopicSuggestions, formatTopicForPost, suggestPostingTimes } = require('./topic_suggestions');

/**
 * Creates a posting schedule based on optimal engagement times
 * 
 * @param {array} followers - List of follower profiles
 * @param {number} postsPerWeek - Target number of posts per week
 * @returns {array} - Scheduled posting slots with topics
 */
async function createPostingSchedule(followers, postsPerWeek = 5) {
  try {
    // Generate topic suggestions based on follower interests
    const topicSuggestions = await generateTopicSuggestions(followers, postsPerWeek * 2);
    
    // Get optimal posting times
    const postingTimes = suggestPostingTimes(followers);
    
    // Create a schedule with assigned topics and times
    const schedule = [];
    
    // Use best times for important posts
    const priorityTopics = topicSuggestions.slice(0, Math.floor(postsPerWeek / 2));
    priorityTopics.forEach((topic, index) => {
      if (index < postingTimes.bestTimes.length) {
        const { day, time } = postingTimes.bestTimes[index];
        schedule.push({
          day,
          time,
          topic: formatTopicForPost(topic),
          priority: 'high',
          status: 'scheduled'
        });
      }
    });
    
    // Fill remaining slots with other topics
    const remainingTopics = topicSuggestions.slice(Math.floor(postsPerWeek / 2), postsPerWeek);
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const standardTimes = ['9:00', '12:00', '15:00', '18:00'];
    
    let slotIndex = 0;
    remainingTopics.forEach(topic => {
      // Find a day-time combination not already in the schedule
      let day, time;
      let found = false;
      
      while (!found && slotIndex < daysOfWeek.length * standardTimes.length) {
        const dayIndex = Math.floor(slotIndex / standardTimes.length) % daysOfWeek.length;
        const timeIndex = slotIndex % standardTimes.length;
        
        day = daysOfWeek[dayIndex];
        time = standardTimes[timeIndex];
        
        // Check if this slot is already used
        const existingSlot = schedule.find(slot => slot.day === day && slot.time === time);
        if (!existingSlot) {
          found = true;
        } else {
          slotIndex++;
        }
      }
      
      if (found) {
        schedule.push({
          day,
          time,
          topic: formatTopicForPost(topic),
          priority: 'medium',
          status: 'scheduled'
        });
      }
      
      slotIndex++;
    });
    
    return schedule;
  } catch (error) {
    console.error(`Error creating posting schedule: ${error.message}`);
    return [];
  }
}

/**
 * Determines if it's time to post based on the schedule
 * 
 * @param {array} schedule - The posting schedule
 * @returns {object|null} - The post to make now, or null if none
 */
function checkScheduleForPosts(schedule) {
  try {
    // Get current date and time
    const now = new Date();
    const currentDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Format current time as HH:MM
    const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
    
    // Find posts scheduled for right now (or slightly overdue)
    for (const post of schedule) {
      // Check if this post is scheduled for today
      if (post.day === currentDay && post.status === 'scheduled') {
        // Parse scheduled time
        const [scheduledHour, scheduledMinute] = post.time.split(':').map(Number);
        const scheduledTimeMinutes = scheduledHour * 60 + scheduledMinute;
        const currentTimeMinutes = currentHour * 60 + currentMinute;
        
        // Check if it's time to post (within a 15-minute window)
        const minutesDifference = currentTimeMinutes - scheduledTimeMinutes;
        if (minutesDifference >= 0 && minutesDifference <= 15) {
          return {
            ...post,
            scheduledFor: new Date(
              now.getFullYear(), 
              now.getMonth(), 
              now.getDate(), 
              scheduledHour, 
              scheduledMinute
            )
          };
        }
      }
    }
    
    return null; // No posts due right now
  } catch (error) {
    console.error(`Error checking schedule for posts: ${error.message}`);
    return null;
  }
}

/**
 * Validates a post for potential issues before publishing
 * 
 * @param {object} post - The post to validate
 * @returns {object} - Validation results
 */
function validatePost(post) {
  try {
    const { topic } = post;
    const postText = topic.text;
    
    const issues = [];
    
    // Check length constraints
    if (postText.length > 300) {
      issues.push({
        severity: 'error',
        message: `Post exceeds 300 character limit (${postText.length} characters)`,
        type: 'length'
      });
    } else if (postText.length > 280) {
      issues.push({
        severity: 'warning',
        message: `Post is approaching 300 character limit (${postText.length} characters)`,
        type: 'length'
      });
    }
    
    // Check for potentially sensitive topics
    const sensitiveKeywords = [
      'controversial', 'scandal', 'politics', 'religion', 'nsfw',
      'offensive', 'debate', 'criticized', 'polarizing'
    ];
    
    const foundSensitiveWords = sensitiveKeywords.filter(word => 
      postText.toLowerCase().includes(word.toLowerCase())
    );
    
    if (foundSensitiveWords.length > 0) {
      issues.push({
        severity: 'warning',
        message: `Post contains potentially sensitive keywords: ${foundSensitiveWords.join(', ')}`,
        type: 'content'
      });
    }
    
    // Check hashtag usage
    const hashtags = (postText.match(/#\w+/g) || []);
    if (hashtags.length > 5) {
      issues.push({
        severity: 'warning',
        message: `Post contains ${hashtags.length} hashtags, which may appear spammy`,
        type: 'hashtags'
      });
    }
    
    return {
      isValid: issues.filter(issue => issue.severity === 'error').length === 0,
      issues,
      post
    };
  } catch (error) {
    console.error(`Error validating post: ${error.message}`);
    return {
      isValid: false,
      issues: [{
        severity: 'error',
        message: `Validation error: ${error.message}`,
        type: 'system'
      }],
      post
    };
  }
}

/**
 * Updates a post's status after publishing
 * 
 * @param {object} schedule - The posting schedule
 * @param {object} post - The post that was published
 * @param {string} status - The new status
 * @returns {array} - Updated schedule
 */
function updatePostStatus(schedule, post, status) {
  try {
    return schedule.map(scheduledPost => {
      // Find the matching post in the schedule
      if (scheduledPost.day === post.day && 
          scheduledPost.time === post.time && 
          scheduledPost.topic.topic === post.topic.topic) {
        return {
          ...scheduledPost,
          status,
          publishedAt: status === 'published' ? new Date().toISOString() : undefined,
          postUri: status === 'published' ? post.postUri : undefined
        };
      }
      return scheduledPost;
    });
  } catch (error) {
    console.error(`Error updating post status: ${error.message}`);
    return schedule;
  }
}

/**
 * Plans engagement activities (likes, replies) for a given timeframe
 * 
 * @param {array} followers - List of follower profiles
 * @param {number} activitiesPerDay - Target number of engagement activities
 * @returns {object} - Engagement plan
 */
function planEngagementActivities(followers, activitiesPerDay = 5) {
  try {
    // Prioritize followers based on relationship strength
    const prioritizedFollowers = [...followers].sort((a, b) => {
      // First by relationship status
      const relationshipOrder = { close: 3, regular: 2, casual: 1, new: 0 };
      const aRelationship = relationshipOrder[a.relationshipType] || 0;
      const bRelationship = relationshipOrder[b.relationshipType] || 0;
      
      if (aRelationship !== bRelationship) {
        return bRelationship - aRelationship;
      }
      
      // Then by recency of interaction
      const aLastInteraction = new Date(a.lastInteraction || 0);
      const bLastInteraction = new Date(b.lastInteraction || 0);
      
      // Prioritize those we haven't interacted with recently
      return aLastInteraction - bLastInteraction;
    });
    
    // Allocate engagement types by priority
    const engagementPlan = {
      highPriority: prioritizedFollowers.slice(0, Math.floor(activitiesPerDay * 0.3)).map(follower => ({
        handle: follower.handle,
        activity: 'reply',
        reason: 'high priority relationship'
      })),
      mediumPriority: prioritizedFollowers.slice(Math.floor(activitiesPerDay * 0.3), Math.floor(activitiesPerDay * 0.7)).map(follower => ({
        handle: follower.handle,
        activity: 'like',
        reason: 'medium priority relationship'
      })),
      lowPriority: prioritizedFollowers.slice(Math.floor(activitiesPerDay * 0.7), activitiesPerDay).map(follower => ({
        handle: follower.handle,
        activity: 'view',
        reason: 'maintain connection'
      })),
      newConnections: followers.filter(f => f.relationshipType === 'new').slice(0, Math.min(3, followers.length)).map(follower => ({
        handle: follower.handle,
        activity: 'like',
        reason: 'nurture new connection'
      }))
    };
    
    // Combine all planned activities
    const allActivities = [
      ...engagementPlan.highPriority,
      ...engagementPlan.mediumPriority,
      ...engagementPlan.lowPriority,
      ...engagementPlan.newConnections
    ];
    
    return {
      totalActivities: allActivities.length,
      activities: allActivities,
      summary: {
        replies: allActivities.filter(a => a.activity === 'reply').length,
        likes: allActivities.filter(a => a.activity === 'like').length,
        views: allActivities.filter(a => a.activity === 'view').length
      }
    };
  } catch (error) {
    console.error(`Error planning engagement activities: ${error.message}`);
    return {
      totalActivities: 0,
      activities: [],
      summary: { replies: 0, likes: 0, views: 0 }
    };
  }
}

module.exports = {
  createPostingSchedule,
  checkScheduleForPosts,
  validatePost,
  updatePostStatus,
  planEngagementActivities
};