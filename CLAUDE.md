# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Craving Tracker** - a Progressive Web App (PWA) for addiction cessation progress. It's a two-page application built with vanilla HTML, CSS, and JavaScript that helps users log cravings and consumption incidents for both vaping and alcohol with comprehensive timeline analytics.

## Architecture

**Two-Page Application**:
- `index.html`: Main tracking interface with modal-based entry creation
- `timeline.html`: Analytics dashboard with multiple time period views

**Key Components**:
- `QuitTracker` class: Main application logic with modal-based entry system
- `TimelineView` class: Data visualization and analytics
- `DataStore` class: Handles persistent storage using IndexedDB with localStorage fallback
- Service Worker: Provides offline capability and caching (shared between pages)
- PWA manifest: Embedded as base64 data URL for installability

**Data Storage Strategy**:
- Primary: IndexedDB for robust client-side persistence
- Fallback: localStorage for compatibility
- Migration: Automatically migrates data from localStorage to IndexedDB
- Update Recovery: Automatically restores data after app updates from GitHub
- Cross-page sharing: Both pages access same DataStore instance

## Development

**No Build Process**: Static HTML files that can be opened directly in a browser or served by any web server.

**Testing**: Open `index.html` in a browser. For PWA features, serve via HTTP/HTTPS (e.g., `python -m http.server` or Live Server extension).

**Development Server**: Use any static file server like:
- `python -m http.server 8000`
- VS Code Live Server extension  
- `npx serve .`

## Key Features

### Main Interface (index.html)
- **Dual category support**: Tab-based interface for vaping (💨) and alcohol (🍷) tracking
- **Modal-based entry creation**: All entries created through modal with date/time/note fields
- **Craving intensity slider**: 3-level intensity scale (Mild, Medium, Strong) for cravings
- **Entry editing**: Edit any previous entry (date, time, type, note, intensity)
- **Entry deletion**: Delete entries with confirmation dialog
- **Navigation**: Seamless switching between Today and Timeline views
- **Export/import data**: JSON backup and restore functionality
- **Auto-update from GitHub**: Updates app while preserving user data
- **Mobile optimized**: Responsive design with proper touch targets

### Timeline Analytics (timeline.html)
- **Multiple time views**: Day (hourly), Week (daily), Month (monthly), Year (yearly)
- **Dual visualization modes**: Bar charts for most views, line graph for week view
- **Category filtering**: Toggle buttons for vaping, alcohol, or both categories
- **Proportional bar charts**: Bar heights accurately reflect data quantities
- **Fixed y-axis**: Numerical scale stays visible during horizontal scrolling
- **Data aggregation**: Smart grouping by time periods with accurate filtering
- **Interactive charts**: Hover values and scrollable day view
- **Entry management**: Edit and delete entries directly from timeline day view

### Technical Features
- **PWA capabilities**: Offline support, installable, cached resources
- **Data persistence**: IndexedDB primary, localStorage fallback
- **Real-time calculations**: Vape-free time tracking
- **Cross-browser compatibility**: Works on mobile browsers (Chrome, DuckDuckGo, etc.)

## Important Implementation Details

### Timeline Chart Rendering
- **Pixel-based heights**: Uses pixel calculations instead of percentages for accurate scaling
- **Bar height formula**: `(dataValue / maxValue) * chartHeight` where chartHeight = 220px
- **Chart structure**: Fixed y-axis + scrollable chart container for horizontal scrolling
- **Data filtering**: Uses `new Date(entry.timestamp).toDateString()` for consistent date comparison

### Entry Data Structure
```javascript
{
  id: timestamp,                    // Unique identifier
  type: 'craving'|'smoked',         // Entry type
  category: 'vaping'|'alcohol',     // Entry category
  timestamp: ISO_string,            // Full date/time
  note: string,                     // Optional user note
  date: date_string,                // Cached toDateString() for filtering
  intensity: 1|2|3                  // Craving intensity (1=Mild, 2=Medium, 3=Strong) - only for cravings
}
```

### Mobile Considerations
- **Samsung S20FE tested**: 412x914 viewport specifically optimized
- **Button layout**: Prevents wrapping with flexbox entry-actions container
- **Touch targets**: Minimum button sizes maintained
- **Responsive text**: Smaller fonts on mobile while maintaining readability

### Dual Category System
- **Category tabs**: Main interface uses tabs to switch between vaping and alcohol tracking
- **Category persistence**: Selected category is maintained across sessions
- **Automatic categorization**: All entries automatically tagged with active category
- **Legacy migration**: Existing entries without category default to 'vaping'

### Craving Intensity System
- **3-level scale**: Mild (1), Medium (2), Strong (3) intensity ratings
- **Visual slider**: Range input with labeled scale for easy selection
- **Default values**: New cravings default to Medium (2), legacy cravings auto-migrated
- **Conditional display**: Intensity slider only shown for craving entries

### Timeline Filtering & Visualization
- **Category filters**: Toggle buttons for All, Vaping, Alcohol with active state styling
- **Dual chart types**: Bar charts for day/month/year views, line graph for week view
- **Color coding**: Each category has distinct color scheme (vaping: blue/red, alcohol: purple/orange)
- **Dynamic switching**: Chart type changes automatically based on selected time period

### Navigation Pattern
- Both pages share identical header with navigation buttons
- `window.location.href` for page switching (simple and reliable)
- Active state styling shows current page

## File Structure

```
/
├── index.html          # Main tracking interface
├── timeline.html       # Analytics dashboard
├── shared-modal.js     # Shared modal utility functions
└── CLAUDE.md           # This file
```

## Common Development Tasks

### Adding New Categories
1. Add new category option to tab buttons in index.html
2. Update category validation in entry creation logic
3. Add color scheme to timeline.html CSS for new category
4. Update filtering logic in `TimelineView` class

### Adding New Time Periods to Timeline
1. Add case to `aggregateData()` switch statement
2. Update `titles` object in `renderChart()`
3. Add button to timeline controls if needed
4. Consider if new period should use bar chart or line graph

### Modifying Chart Scaling
- Bar heights calculated in `renderChart()` method
- Key formula: `(item.count / maxValue) * 220` for pixel heights
- Y-axis labels generated in `renderYAxis()` with smart step sizes
- Week view uses `renderLineGraph()` instead of bar chart

### Working with Intensity Data
- Intensity values: 1 (Mild), 2 (Medium), 3 (Strong)
- Only applies to craving entries (`type: 'craving'`)
- Legacy entries auto-migrate to intensity 2
- Slider component has CSS classes: `.intensity-slider`, `.intensity-labels`, `.intensity-value`

### Entry Management
- **Edit functionality**: Both pages support full entry editing via shared modal system
- **Delete functionality**: Confirmation dialog ("Are you sure you want to delete this entry?")
- **Shared utilities**: `shared-modal.js` provides common modal operations and validation
- **Consistent UX**: Edit (✏️) and delete (×) buttons with consistent styling across pages

### Data Migration
- Check `initializeApp()` methods in both classes for auto-migration logic
- Update backup/restore logic handles new data fields (category, intensity)
- Test import/export maintains data integrity
- Legacy entries get default category 'vaping' and intensity 2 for cravings