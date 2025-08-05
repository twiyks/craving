# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Craving Tracker** - a Progressive Web App (PWA) for tracking smoking cessation progress. It's a single-page application built with vanilla HTML, CSS, and JavaScript that helps users log cravings and smoking incidents.

## Architecture

**Single-File Application**: The entire application is contained in `index.html` which includes:
- HTML structure for the UI
- Embedded CSS for styling and responsive design
- Inline JavaScript for all functionality
- Service Worker code embedded as a blob for PWA functionality

**Key Components**:
- `QuitTracker` class: Main application logic
- `DataStore` class: Handles persistent storage using IndexedDB with localStorage fallback
- Service Worker: Provides offline capability and caching
- PWA manifest: Embedded as base64 data URL for installability

**Data Storage Strategy**:
- Primary: IndexedDB for robust client-side persistence
- Fallback: localStorage for compatibility
- Migration: Automatically migrates data from localStorage to IndexedDB
- Update Recovery: Automatically restores data after app updates from GitHub

## Development

**No Build Process**: This is a static HTML file that can be opened directly in a browser or served by any web server.

**Testing**: Open `index.html` in a browser. For PWA features, serve via HTTP/HTTPS (e.g., `python -m http.server` or Live Server extension).

**Development Server**: Use any static file server like:
- `python -m http.server 8000`
- VS Code Live Server extension
- `npx serve .`

## Key Features

- Track smoking cravings and smoking incidents
- Add historical entries with custom dates/times
- Export/import data as JSON
- **Auto-update from GitHub**: Updates app while preserving user data
- PWA with offline support and installability
- Real-time smoke-free time calculation
- Responsive design for mobile devices

## File Structure

```
/
├── index.html          # Complete application (HTML/CSS/JS/PWA)
└── CLAUDE.md           # This file
```