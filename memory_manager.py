#!/usr/bin/env python3
"""
Memory Manager for Bluesky Social Assistant

This script helps track and manage persistent memory about users and conversations
across sessions on Bluesky.
"""

import json
import os
import datetime
import argparse
import re
from typing import Dict, List, Any, Optional


class MemoryManager:
    """Manages persistent memory for Bluesky interactions."""
    
    def __init__(self, memory_file: str = "memory_data.json"):
        """Initialize the memory manager.
        
        Args:
            memory_file: Path to the JSON file for storing memory data
        """
        self.memory_file = memory_file
        self.memory = self._load_memory()
        
    def _load_memory(self) -> Dict[str, Any]:
        """Load memory data from the JSON file if it exists."""
        if os.path.exists(self.memory_file):
            try:
                with open(self.memory_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except json.JSONDecodeError:
                print(f"Warning: Could not parse {self.memory_file}. Starting with empty memory.")
                return self._initialize_memory()
        else:
            return self._initialize_memory()
    
    def _initialize_memory(self) -> Dict[str, Any]:
        """Create the initial memory structure."""
        return {
            "users": {},
            "conversations": {},
            "topics": {},
            "meta": {
                "created_at": datetime.datetime.now().isoformat(),
                "version": "0.1.0"
            }
        }
    
    def save(self):
        """Save memory data to the JSON file."""
        with open(self.memory_file, 'w', encoding='utf-8') as f:
            json.dump(self.memory, f, indent=2)
        print(f"Memory saved to {self.memory_file}")
    
    def get_user(self, handle: str) -> Dict[str, Any]:
        """Get memory data for a specific user.
        
        Args:
            handle: The Bluesky handle of the user
            
        Returns:
            Dictionary containing user memory data
        """
        handle = handle.lower()
        if handle not in self.memory["users"]:
            self.memory["users"][handle] = {
                "first_seen": datetime.datetime.now().isoformat(),
                "interests": [],
                "notes": [],
                "last_interaction": None,
                "conversation_history": []
            }
        return self.memory["users"][handle]
    
    def update_user(self, handle: str, **kwargs):
        """Update memory data for a specific user.
        
        Args:
            handle: The Bluesky handle of the user
            **kwargs: Key-value pairs to update in the user's memory
        """
        handle = handle.lower()
        user_data = self.get_user(handle)
        
        for key, value in kwargs.items():
            if key == "add_interest" and value:
                if value not in user_data["interests"]:
                    user_data["interests"].append(value)
            elif key == "add_note" and value:
                user_data["notes"].append({
                    "timestamp": datetime.datetime.now().isoformat(),
                    "content": value
                })
            elif key == "add_conversation":
                user_data["conversation_history"].append({
                    "timestamp": datetime.datetime.now().isoformat(),
                    "content": value
                })
            else:
                user_data[key] = value
        
        user_data["last_updated"] = datetime.datetime.now().isoformat()
        self.save()
    
    def add_topic_association(self, topic: str, handle: str):
        """Associate a topic with a user.
        
        Args:
            topic: The topic to associate
            handle: The user's handle
        """
        handle = handle.lower()
        topic = topic.lower()
        
        if topic not in self.memory["topics"]:
            self.memory["topics"][topic] = {"users": []}
        
        if handle not in self.memory["topics"][topic]["users"]:
            self.memory["topics"][topic]["users"].append(handle)
            
        # Update user interests
        user_data = self.get_user(handle)
        if topic not in user_data["interests"]:
            user_data["interests"].append(topic)
            
        self.save()
    
    def get_users_by_topic(self, topic: str) -> List[str]:
        """Get all users associated with a specific topic.
        
        Args:
            topic: The topic to look up
            
        Returns:
            List of user handles
        """
        topic = topic.lower()
        if topic in self.memory["topics"]:
            return self.memory["topics"][topic]["users"]
        return []
    
    def search_users(self, query: str) -> List[Dict[str, Any]]:
        """Search for users matching a query.
        
        Args:
            query: Search query string
            
        Returns:
            List of matching user data
        """
        query = query.lower()
        results = []
        
        for handle, user_data in self.memory["users"].items():
            # Search in handle
            if query in handle:
                results.append({"handle": handle, "data": user_data})
                continue
                
            # Search in interests
            if any(query in interest.lower() for interest in user_data["interests"]):
                results.append({"handle": handle, "data": user_data})
                continue
                
            # Search in notes
            if any(query in note["content"].lower() for note in user_data["notes"]):
                results.append({"handle": handle, "data": user_data})
                continue
                
        return results
    
    def record_interaction(self, handle: str, interaction_type: str, content: str):
        """Record an interaction with a user.
        
        Args:
            handle: The user's handle
            interaction_type: Type of interaction (e.g., "post", "reply", "like")
            content: Content of the interaction
        """
        handle = handle.lower()
        user_data = self.get_user(handle)
        
        user_data["last_interaction"] = {
            "timestamp": datetime.datetime.now().isoformat(),
            "type": interaction_type,
            "content": content
        }
        
        self.update_user(handle, add_conversation={
            "type": interaction_type,
            "content": content
        })


def main():
    """Command-line interface for the memory manager."""
    parser = argparse.ArgumentParser(description="Manage memory for Bluesky interactions")
    subparsers = parser.add_subparsers(dest="command", help="Command to run")
    
    # Get user command
    get_user_parser = subparsers.add_parser("get-user", help="Get user data")
    get_user_parser.add_argument("handle", help="User handle")
    
    # Update user command
    update_user_parser = subparsers.add_parser("update-user", help="Update user data")
    update_user_parser.add_argument("handle", help="User handle")
    update_user_parser.add_argument("--add-interest", help="Add an interest to the user")
    update_user_parser.add_argument("--add-note", help="Add a note about the user")
    
    # Search command
    search_parser = subparsers.add_parser("search", help="Search for users")
    search_parser.add_argument("query", help="Search query")
    
    # Topic command
    topic_parser = subparsers.add_parser("topic", help="Manage topics")
    topic_parser.add_argument("--add", help="Add a topic association", action="store_true")
    topic_parser.add_argument("--get", help="Get users by topic", action="store_true")
    topic_parser.add_argument("topic", help="Topic name")
    topic_parser.add_argument("--handle", help="User handle (for --add)")
    
    args = parser.parse_args()
    
    # Initialize memory manager
    manager = MemoryManager()
    
    if args.command == "get-user":
        user_data = manager.get_user(args.handle)
        print(json.dumps(user_data, indent=2))
        
    elif args.command == "update-user":
        kwargs = {}
        if args.add_interest:
            kwargs["add_interest"] = args.add_interest
        if args.add_note:
            kwargs["add_note"] = args.add_note
        
        manager.update_user(args.handle, **kwargs)
        print(f"Updated user {args.handle}")
        
    elif args.command == "search":
        results = manager.search_users(args.query)
        print(json.dumps(results, indent=2))
        
    elif args.command == "topic":
        if args.add and args.handle:
            manager.add_topic_association(args.topic, args.handle)
            print(f"Associated topic '{args.topic}' with user '{args.handle}'")
        elif args.get:
            users = manager.get_users_by_topic(args.topic)
            print(f"Users interested in '{args.topic}':")
            for user in users:
                print(f"- {user}")


if __name__ == "__main__":
    main()
