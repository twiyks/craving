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

**CSS Architecture**:
- `styles.css`: Unified stylesheet serving both pages
- Shared styles: Global layout, headers, modals, buttons, and common components
- Page-specific styles: Timeline-specific (charts, filters) and index-specific (category tabs, entry buttons)
- Mobile-responsive: Single media query section for all mobile optimizations
- Class-based organization: `.main.timeline` for timeline-specific main padding

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
- **Cost tracking**: Alcohol consumption entries include cost field (£0.00-£10.00 range)
- **Entry editing**: Edit any previous entry (date, time, type, note, intensity)
- **Entry deletion**: Delete entries with confirmation dialog
- **Navigation**: Seamless switching between Today and Timeline views
- **Export/import data**: JSON backup and restore functionality
- **Auto-update from GitHub**: Updates app while preserving user data
- **Mobile optimized**: Responsive design with proper touch targets
- **Notes visibility toggle**: Burger menu option to show/hide notes in entries (persists across pages)

### Timeline Analytics (timeline.html)
- **Multiple time views**: Day (hourly), Week (daily), Month (monthly), Year (yearly)
- **Dual visualization modes**: Bar charts for most views, line graph for week view
- **Category filtering**: Toggle buttons for vaping, alcohol, or both categories
- **Proportional bar charts**: Bar heights accurately reflect data quantities
- **Fixed y-axis**: Numerical scale stays visible during horizontal scrolling
- **Data aggregation**: Smart grouping by time periods with accurate filtering
- **Interactive charts**: Hover values and scrollable day view
- **Entry management**: Edit and delete entries directly from timeline day view
- **Notes visibility toggle**: Burger menu option affects day activity list note display
- **Cost analytics**: Total spending displayed per time period when alcohol filter is active

### Technical Features
- **PWA capabilities**: Offline support, installable, cached resources
- **Data persistence**: IndexedDB primary, localStorage fallback
- **Real-time calculations**: Vape-free time tracking
- **Cross-browser compatibility**: Works on mobile browsers (Chrome, DuckDuckGo, etc.)

## Important Implementation Details

### Notes Display Toggle
- **Purpose**: Allow users to show/hide entry notes across both pages.
- **Storage**: Uses `localStorage` key `showNotes` (boolean, default `true`).
- **UI**: Added under burger menu as `Display Options → Show Notes` with a `.toggle-switch` element (`#notesToggle`).
- **Behavior**:
  - On load, both `QuitTracker` (index) and `TimelineView` (timeline) call `loadNotesSetting()` to set `this.showNotes`.
  - Tapping the toggle triggers `toggleNotesVisibility()` → flips `this.showNotes`, saves via `saveNotesSetting()`, updates visual state via `updateNotesToggleUI()`, and re-renders the affected list.
  - Cross-page: because the preference is in `localStorage`, the setting applies on both pages.
- **Rendering**:
  - `index.html` `renderHistory()` only inserts note HTML when `this.showNotes && entry.note`.
  - `timeline.html` `renderDayActivity()` only inserts note HTML when `this.showNotes && entry.note`.

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
  intensity: 1|2|3,                 // Craving intensity (1=Mild, 2=Medium, 3=Strong) - only for cravings
  cost: number                      // Cost in GBP - only for alcohol consumption entries
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

### Cost Tracking System
- **Entry-level costs**: Alcohol consumption entries can include cost (£0.00-£10.00 range)
- **Cost slider**: Range input with 0.25 increments, displayed as currency
- **Timeline aggregation**: Cost totals calculated per time period (day/week/month/year)
- **Visual display**: Cost totals shown below time period labels when alcohol filter active
- **Summary analytics**: Purple cost summary card shows total spending for selected period
- **Conditional visibility**: Cost features only appear for alcohol category consumption entries

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
├── styles.css          # Unified CSS stylesheet for both pages
└── CLAUDE.md           # This file
```

## Common Development Tasks

### Adding New Categories
1. Add new category option to tab buttons in index.html
2. Update category validation in entry creation logic
3. Add color scheme to styles.css for new category
4. Update filtering logic in `TimelineView` class

### Adding a New Display Preference (e.g., another toggle)
1. Add a toggle control in both pages' burger menus under a new or existing section.
2. Add a `this.<preference>` field with default, plus `load<Pref>Setting()`, `save<Pref>Setting()`, `update<Pref>ToggleUI()`, and a `toggle<Pref>()` handler.
3. Persist to `localStorage` with a clear key (shared across pages).
4. Update render paths (e.g., `renderHistory()`, `renderDayActivity()`, charts) to respect the preference.
5. Initialize preference during app load and sync the toggle UI state.

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

### Working with Cost Data
- Cost values: £0.00 to £10.00 in £0.25 increments (slider range 0-40, multiplied by 0.25)
- Only applies to alcohol consumption entries (`type: 'smoked' && category: 'alcohol'`)
- Cost slider shares CSS classes with intensity slider: `.intensity-slider`, `.intensity-value`
- Timeline aggregation sums costs per time period: `alcoholCost` field in data objects
- Display styling: `.cost-total` for individual period totals, `.cost-card` for summary cards

### Entry Management
- **Edit functionality**: Both pages support full entry editing via shared modal system
- **Delete functionality**: Confirmation dialog ("Are you sure you want to delete this entry?")
- **Shared utilities**: `shared-modal.js` provides common modal operations and validation
- **Consistent UX**: Edit (✏️) and delete (×) buttons with consistent styling across pages

### Data Migration
- Check `initializeApp()` methods in both classes for auto-migration logic
- Update backup/restore logic handles new data fields (category, intensity, cost)
- Test import/export maintains data integrity
- Legacy entries get default category 'vaping' and intensity 2 for cravings
- Cost field defaults to null for entries that don't support it (vaping entries, cravings)

### CSS Development
- **Single stylesheet**: All styles are in `styles.css` - no separate CSS files per page
- **Shared components**: Modal, button, and layout styles are reused across both pages
- **Page-specific styles**: Use `.main.timeline` class for timeline-specific styling
- **Mobile-first approach**: Base styles work on mobile, desktop enhancements in media queries
- **Color scheme consistency**: All category colors defined once and reused throughout
- **Responsive design**: Single `@media (max-width: 480px)` section handles all mobile adaptations