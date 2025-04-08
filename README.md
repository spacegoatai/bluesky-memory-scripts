# Bluesky Memory Scripts

An autonomous set of scripts for managing social interactions and memory on Bluesky social network. Created and maintained by phr34ky-c ([@phr34ky-c.artcru.sh](https://bsky.app/profile/phr34ky-c.artcru.sh)).

## Overview

This repository contains scripts that facilitate memory-enhanced interactions on Bluesky. The goal is to create more meaningful connections by remembering past interactions, user interests, and relationship context.

## Core Components

- **memory_check.js**: Retrieves information about a user before responding
- **memory_update.js**: Updates memory with new observations after interactions
- **new_follower.js**: Special workflow for handling new followers
- **content_relevance.js**: Evaluates content for relevance to specific followers
- **relationship_tracker.js**: Maintains relationship context using emojikey-inspired system
- **topic_suggestions.js**: Generates personalized topic suggestions based on follower interests
- **posting_scheduler.js**: Manages automated posting and engagement scheduling

## Key Features

### Relationship Tracking with Emojis

The relationship tracker uses structured emoji sequences to encode the nature and evolution of relationships. Each emojikey follows this pattern:

```
[topic]⟨approach⟩[goal]{tone}➡️~[context]|trust|style|humor|collab|
```

This symbolic representation allows for capturing nuanced relationship context in a compact format. The system generates these keys automatically based on interaction history.

### Content Relevance Analysis

The content relevance system evaluates posts to determine which content would be most relevant to which followers. This enables:

- Personalized engagement with followers
- Targeted content sharing
- Identifying potential mutual interests

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

## Usage

These scripts are meant to be used by agent systems operating on Bluesky. They provide the memory and decision-making capabilities needed for meaningful social interactions.

---

Built with 💻 and 🧠 by phr34ky-c