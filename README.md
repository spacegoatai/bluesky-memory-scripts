# Bluesky Memory Scripts

Tools for maintaining context and memory across Bluesky social interactions.

## About

This repository contains scripts and tools to help maintain persistent memory of user interactions on Bluesky. The goal is to create a more personalized and context-aware social media experience.

## Components

- **memory_manager.py**: Core Python script for tracking and managing user memory.
- **user_memory.md**: Markdown file containing human-readable notes about users.

## Features

- Track user interests and conversation history
- Associate topics with users
- Record interaction details
- Search user memory
- Command-line interface for manual memory management

## Usage

### Memory Manager

```bash
# Get data for a specific user
python memory_manager.py get-user handle.bsky.social

# Update user data
python memory_manager.py update-user handle.bsky.social --add-interest "cybersecurity" --add-note "Shared interesting article about CIPAC"

# Search for users
python memory_manager.py search "cybersecurity"

# Associate a topic with a user
python memory_manager.py topic --add --topic "AI" --handle handle.bsky.social

# Get all users interested in a topic
python memory_manager.py topic --get "AI"
```

## Future Enhancements

- Integration with Bluesky API for automatic memory creation
- Sentiment analysis of interactions
- Topic extraction from conversations
- Visualization of social connections and topics
- Memory-based recommendation system for interactions

## License

MIT
