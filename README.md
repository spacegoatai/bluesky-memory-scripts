# Bluesky Memory Scripts

An autonomous set of scripts for managing social interactions and memory on Bluesky social network. Created and maintained by phr34ky-c ([@phr34ky-c.artcru.sh](https://bsky.app/profile/phr34ky-c.artcru.sh)).

## Overview

This repository contains scripts that facilitate memory-enhanced interactions on Bluesky. The goal is to create more meaningful connections by remembering past interactions, user interests, and relationship context.

## Core Components

- **bluesky_api.js**: Clean interface for Bluesky API interactions with integrated memory
- **emojikey_manager.js**: Creates and interprets relationship emojikeys for contextual memory
- **memory_update.js**: Updates memory with new observations after interactions
- **memory_check.js**: Retrieves information about a user before responding
- **new_follower.js**: Special workflow for handling new followers
- **content_relevance.js**: Evaluates content for relevance to specific followers
- **relationship_tracker.js**: Maintains relationship context using emojikey-inspired system
- **topic_suggestions.js**: Generates personalized topic suggestions based on follower interests
- **posting_scheduler.js**: Manages automated posting and engagement scheduling
- **integration_example.js**: Example script showing how to use all components together

## Key Features

### Knowledge Graph Integration

The memory system now uses a sophisticated knowledge graph structure to store and relate information:

- **Entities**: Users, topics, interests, and content are stored as entities
- **Relations**: Connections between entities (follows, researches, discusses)
- **Observations**: Facts and details about entities that evolve over time
- **Context-aware retrieval**: Relevant information is surfaced based on conversation context

### Relationship Tracking with Emojis

The relationship tracker uses structured emoji sequences to encode the nature and evolution of relationships. Each emojikey follows this pattern:

```
[topic]⟨approach⟩[goal]{tone}➡️~[context]|trust|style|humor|collab|
```

This symbolic representation allows for capturing nuanced relationship context in a compact format. The system generates these keys automatically based on interaction history.

#### SuperKeys

The system now supports SuperKeys - compressed representations of approximately 7 regular emojikeys that capture relationship evolution over time:

```
[[×7[topic⬆️]⟨approach⬆️⟩[goal⬇️]{tone⬆️}➡️~[context]|trust⬆️|style|humor↔️|collab⬆️|]]
```

SuperKeys include trend indicators (⬆️↔️⬇️🔄) that show how different aspects of the relationship have evolved.

### Content Relevance Analysis

The content relevance system evaluates posts to determine which content would be most relevant to which followers. This enables:

- Personalized engagement with followers
- Targeted content sharing
- Identifying potential mutual interests
- Topic extraction from posts

### Topic Suggestion Engine

The topic suggestion engine analyzes follower interests to generate relevant post ideas. Features include:

- Topic generation based on follower interest clusters
- Content type suggestions (tutorials, discussions, analysis)
- Hashtag optimization
- Optimal posting time recommendations

### Automated Scheduling

The posting scheduler manages content distribution to maximize engagement:

- Creates optimized posting schedules based on follower activity patterns
- Validates posts for potential issues before publishing
- Plans engagement activities (replies, likes) to maintain connections
- Adjusts schedules based on prior performance

## Bluesky API Integration

The BlueskyConnector class provides a comprehensive interface for Bluesky interactions:

- Authentication and session management
- New follower detection and automated follow-back
- Timeline monitoring and intelligent engagement
- Content searching based on interests
- Post creation with targeted mentions
- Reply generation optimized for relationship building

## Philosophy

These scripts are designed to evolve over time based on actual interactions. Rather than static code, they represent a learning system that improves with each social exchange.

## Technical Implementation

The scripts interface with the Bluesky API through a standard set of hooks. They integrate with the MCP memory tool for persistent storage of relationship data and observations.

### Memory Structure

User memories are stored with this basic structure:

- Basic profile data (handle, display name, bio)
- Known interests extracted from bio and posts
- Interaction history
- Relationship emojikey
- Content preferences
- Suggested topics
- Network connections

## Usage

These scripts are meant to be used by agent systems operating on Bluesky. They provide the memory and decision-making capabilities needed for meaningful social interactions.

### Quick Start

To try out the system, run the integration example:

```javascript
const { runBlueskyAgent } = require('./integration_example');

// Set environment variables for auth
process.env.BLUESKY_IDENTIFIER = 'your-handle.bsky.social';
process.env.BLUESKY_PASSWORD = 'your-password';

// Run the agent
runBlueskyAgent()
  .then(result => {
    console.log('Agent completed:', result);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

This will demonstrate the full workflow including:
- Checking for new followers
- Timeline engagement
- Topic suggestion
- Content searching
- Memory updates

## Future Enhancements

- Multi-agent orchestration
- Sentiment analysis for more nuanced interactions
- Long-term memory compression and retrieval
- Advanced conversation modeling
- Content generation with personalized voice

---

Built with 💻 and 🧠 by phr34ky-c