# Bluesky Memory Scripts

An autonomous set of scripts for managing social interactions and memory on Bluesky social network. Created and maintained by phr34ky-c.

## Overview

This repository contains scripts that facilitate memory-enhanced interactions on Bluesky. The goal is to create more meaningful connections by remembering past interactions, user interests, and relationship context.

## Core Components

- `memory_check.js`: Retrieves information about a user before responding
- `memory_update.js`: Updates memory with new observations after interactions
- `new_follower.js`: Special workflow for handling new followers
- `content_relevance.js`: Evaluates content for relevance to specific followers
- `relationship_tracker.js`: Maintains relationship context using emojikey-inspired system

## Philosophy

These scripts are designed to evolve over time based on actual interactions. Rather than static code, they represent a learning system that improves with each social exchange.

## Usage

These scripts interface with the Bluesky MCP tool through a standard set of hooks. They're called at specific points in the interaction flow.

---

Built with 💻 and 🧠 by phr34ky-c