// Generate dummy data for Craving Tracker app
// Run with: node generate_dummy_data.js

function generateDummyData() {
    const entries = [];
    const now = new Date();
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    
    // Helper function to get random time within a range
    function getRandomTime(startHour, endHour) {
        const hour = Math.floor(Math.random() * (endHour - startHour + 1)) + startHour;
        const minute = Math.floor(Math.random() * 60);
        return { hour, minute };
    }
    
    // Helper function to get random cost around £1
    function getRandomCost() {
        // Random cost between £0.75 and £1.25, rounded to nearest £0.25
        const baseCost = 0.75 + Math.random() * 0.5;
        return Math.round(baseCost * 4) / 4; // Round to nearest 0.25
    }
    
    // Helper function to get random intensity (1-3)
    function getRandomIntensity() {
        // Weight towards medium (2): 30% mild, 50% medium, 20% strong
        const rand = Math.random();
        if (rand < 0.3) return 1; // Mild
        if (rand < 0.8) return 2; // Medium
        return 3; // Strong
    }
    
    // Generate data for each day
    for (let date = new Date(sixMonthsAgo); date <= now; date.setDate(date.getDate() + 1)) {
        const currentDate = new Date(date);
        
        // Generate data for every single day (no skipping)
        
        // Generate vaping entries (~10 per day between 8am-11pm)
        const vapingCount = 8 + Math.floor(Math.random() * 5); // 8-12 entries
        for (let i = 0; i < vapingCount; i++) {
            const time = getRandomTime(8, 23);
            const timestamp = new Date(currentDate);
            timestamp.setHours(time.hour, time.minute, Math.floor(Math.random() * 60));
            
            entries.push({
                id: timestamp.getTime(),
                type: 'smoked',
                category: 'vaping',
                timestamp: timestamp.toISOString(),
                note: '',
                date: timestamp.toDateString()
            });
        }
        
        // Generate drinking entries (~5 per day between 6pm-11pm)
        const drinkingCount = 3 + Math.floor(Math.random() * 4); // 3-6 entries
        for (let i = 0; i < drinkingCount; i++) {
            const time = getRandomTime(18, 23);
            const timestamp = new Date(currentDate);
            timestamp.setHours(time.hour, time.minute, Math.floor(Math.random() * 60));
            
            entries.push({
                id: timestamp.getTime() + i, // Add i to avoid duplicate IDs
                type: 'smoked',
                category: 'alcohol',
                timestamp: timestamp.toISOString(),
                note: '',
                date: timestamp.toDateString(),
                cost: getRandomCost()
            });
        }
        
        // Generate vape cravings (~5 per day, spread throughout waking hours)
        const vapeCravingCount = 3 + Math.floor(Math.random() * 4); // 3-6 cravings
        for (let i = 0; i < vapeCravingCount; i++) {
            const time = getRandomTime(8, 23);
            const timestamp = new Date(currentDate);
            timestamp.setHours(time.hour, time.minute, Math.floor(Math.random() * 60));
            
            entries.push({
                id: timestamp.getTime() + 10000 + i, // Offset to avoid duplicates
                type: 'craving',
                category: 'vaping',
                timestamp: timestamp.toISOString(),
                note: '',
                date: timestamp.toDateString(),
                intensity: getRandomIntensity()
            });
        }
        
        // Generate drink cravings (1-2 per day around 5pm)
        const drinkCravingCount = Math.random() < 0.7 ? 1 : 2; // 70% chance of 1, 30% chance of 2
        for (let i = 0; i < drinkCravingCount; i++) {
            // Time around 5pm (4pm-7pm range)
            const time = getRandomTime(16, 19);
            const timestamp = new Date(currentDate);
            timestamp.setHours(time.hour, time.minute, Math.floor(Math.random() * 60));
            
            entries.push({
                id: timestamp.getTime() + 20000 + i, // Offset to avoid duplicates
                type: 'craving',
                category: 'alcohol',
                timestamp: timestamp.toISOString(),
                note: '',
                date: timestamp.toDateString(),
                intensity: getRandomIntensity()
            });
        }
    }
    
    // Sort entries by timestamp
    entries.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    return entries;
}

// Generate the data
const dummyData = generateDummyData();

// Wrap in the expected format for import
const exportData = {
    entries: dummyData
};

// Output as JSON
console.log(JSON.stringify(exportData, null, 2));

// Also save to file
const fs = require('fs');
fs.writeFileSync('dummy_data.json', JSON.stringify(exportData, null, 2));

console.log(`\nGenerated ${dummyData.length} entries over 6 months`);
console.log('Data saved to dummy_data.json in the correct format');
console.log('You can import this file using the "Import Data" feature in your app.');