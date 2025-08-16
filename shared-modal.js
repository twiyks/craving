/**
 * Shared Modal Utility Functions
 * Helper functions for managing entry modals
 * Used by both index.html and timeline.html
 */

class ModalUtils {
    // Update intensity label display
    static updateIntensityLabel(value, labelElement) {
        const labels = ['', 'Mild', 'Medium', 'Strong'];
        if (labelElement) {
            labelElement.textContent = labels[parseInt(value)];
        }
    }

    // Update cost label display
    static updateCostLabel(value, labelElement) {
        if (labelElement) {
            // Convert from 0-40 range to £0-£10 in £0.25 increments
            const cost = (parseInt(value) * 0.25).toFixed(2);
            labelElement.textContent = `£${cost}`;
        }
    }

    // Update type select options based on category
    static updateTypeOptions(selectElement, category) {
        if (category === 'vaping') {
            selectElement.innerHTML = `
                <option value="craving">Had a Craving</option>
                <option value="smoked">I Vaped</option>
            `;
        } else if (category === 'alcohol') {
            selectElement.innerHTML = `
                <option value="craving">Had a Craving</option>
                <option value="smoked">I Drank</option>
            `;
        }
    }

    // Toggle intensity visibility based on entry type
    static toggleIntensityVisibility(intensityGroup, type) {
        if (intensityGroup) {
            intensityGroup.style.display = type === 'craving' ? 'block' : 'none';
        }
    }

    // Toggle cost visibility based on entry type and category
    static toggleCostVisibility(costGroup, type, category) {
        if (costGroup) {
            costGroup.style.display = (type === 'smoked' && category === 'alcohol') ? 'block' : 'none';
        }
    }

    // Validate entry data
    static validateEntry(date, time) {
        const timestamp = new Date(`${date}T${time}`);
        
        if (timestamp > new Date()) {
            alert('Cannot set future date/time!');
            return false;
        }
        
        if (isNaN(timestamp.getTime())) {
            alert('Invalid date/time!');
            return false;
        }
        
        return true;
    }

    // Create entry data object from form inputs
    static createEntryData(type, date, time, note, category, intensityValue = null, costValue = null) {
        const timestamp = new Date(`${date}T${time}`);
        
        return {
            id: timestamp.getTime(),
            type: type,
            category: category,
            timestamp: timestamp.toISOString(),
            note: note,
            date: timestamp.toDateString(),
            intensity: type === 'craving' ? intensityValue : null,
            cost: (type === 'smoked' && category === 'alcohol' && costValue !== null) ? costValue : null
        };
    }

    // Set up common modal event handlers
    static setupModalEvents(modal, cancelBtn, overlayClose = true) {
        // Close on cancel button
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        // Close on outside click
        if (overlayClose) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
    }

    // Setup intensity slider event handler
    static setupIntensitySlider(slider, valueDisplay) {
        if (slider && valueDisplay) {
            slider.addEventListener('input', (e) => {
                this.updateIntensityLabel(e.target.value, valueDisplay);
            });
        }
    }

    // Setup cost slider event handler
    static setupCostSlider(slider, valueDisplay) {
        if (slider && valueDisplay) {
            slider.addEventListener('input', (e) => {
                this.updateCostLabel(e.target.value, valueDisplay);
            });
        }
    }

    // Populate edit form with entry data
    static populateEditForm(entry, elements) {
        const entryDate = new Date(entry.timestamp);
        
        // Update type options based on entry category
        this.updateTypeOptions(elements.typeSelect, entry.category);
        
        // Fill form fields
        elements.typeSelect.value = entry.type;
        elements.dateInput.value = entryDate.toISOString().split('T')[0];
        elements.timeInput.value = entryDate.toTimeString().slice(0, 5);
        elements.noteInput.value = entry.note || '';
        
        // Handle intensity
        this.toggleIntensityVisibility(elements.intensityGroup, entry.type);
        if (entry.type === 'craving' && elements.intensitySlider) {
            const intensity = entry.intensity || 2;
            elements.intensitySlider.value = intensity;
            this.updateIntensityLabel(intensity, elements.intensityValue);
        }
        
        // Handle cost
        if (elements.costGroup) {
            this.toggleCostVisibility(elements.costGroup, entry.type, entry.category);
            if (entry.type === 'smoked' && entry.category === 'alcohol' && elements.costSlider) {
                const costValue = entry.cost ? Math.round(entry.cost / 0.25) : 0; // Convert back to slider range (0-40)
                elements.costSlider.value = costValue;
                this.updateCostLabel(costValue, elements.costValue);
            }
        }
    }

    // Show success message (if message elements exist)
    static showMessage(type, text, successElement, warningElement) {
        const messageEl = type === 'success' ? successElement : warningElement;
        if (messageEl) {
            messageEl.textContent = text;
            messageEl.classList.add('show');
            setTimeout(() => {
                messageEl.classList.remove('show');
            }, 4000);
        }
    }
}

// Make available globally
if (typeof window !== 'undefined') {
    window.ModalUtils = ModalUtils;
}