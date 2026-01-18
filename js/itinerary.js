// Smart Itinerary Planner for VietTravelGuide

class ItineraryPlanner {
    constructor() {
        this.places = [];
        this.itinerary = [];
        this.constraints = {
            maxDays: 7,
            budget: 5000000, // VND
            interests: [],
            travelStyle: 'balanced' // relaxed, adventurous, cultural
        };
    }

    // Load places from data
    async loadPlaces() {
        // Sample data - in real app, this would come from API
        this.places = [
            {
                id: 1,
                name: "Hà Nội",
                type: "city",
                duration: 2, // days
                cost: 1500000,
                tags: ["history", "food", "culture"],
                coordinates: [21.0285, 105.8542]
            },
            {
                id: 2,
                name: "Vịnh Hạ Long",
                type: "nature",
                duration: 1,
                cost: 2000000,
                tags: ["unesco", "boat", "scenic"],
                coordinates: [20.9101, 107.1839]
            },
            {
                id: 3,
                name: "Huế",
                type: "cultural",
                duration: 2,
                cost: 1200000,
                tags: ["history", "royal", "architecture"],
                coordinates: [16.4637, 107.5909]
            },
            {
                id: 4,
                name: "Hội An",
                type: "cultural",
                duration: 2,
                cost: 1400000,
                tags: ["unesco", "ancient", "shopping"],
                coordinates: [15.8801, 108.3380]
            },
            {
                id: 5,
                name: "Sapa",
                type: "mountain",
                duration: 3,
                cost: 1800000,
                tags: ["trekking", "ethnic", "scenic"],
                coordinates: [22.3364, 103.8441]
            }
        ];
        return this.places;
    }

    // Generate itinerary based on preferences
    generateItinerary(preferences) {
        const { days, budget, interests, startLocation } = preferences;
        
        // Filter places by interests
        let filteredPlaces = this.places.filter(place => 
            interests.some(interest => place.tags.includes(interest))
        );
        
        // Sort by distance from start location (if provided)
        if (startLocation) {
            filteredPlaces.sort((a, b) => {
                const distA = this.calculateDistance(startLocation, a.coordinates);
                const distB = this.calculateDistance(startLocation, b.coordinates);
                return distA - distB;
            });
        }
        
        // Optimize for days and budget
        let remainingDays = days;
        let remainingBudget = budget;
        this.itinerary = [];
        
        for (const place of filteredPlaces) {
            if (place.duration <= remainingDays && place.cost <= remainingBudget) {
                this.itinerary.push({
                    ...place,
                    day: days - remainingDays + 1
                });
                remainingDays -= place.duration;
                remainingBudget -= place.cost;
                
                if (remainingDays <= 0) break;
            }
        }
        
        return this.itinerary;
    }

    // Calculate distance between two coordinates (simplified)
    calculateDistance(coord1, coord2) {
        const [lat1, lon1] = coord1;
        const [lat2, lon2] = coord2;
        
        // Haversine formula (simplified)
        const R = 6371; // Earth radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    // Get itinerary statistics
    getStats() {
        const totalDays = this.itinerary.reduce((sum, place) => sum + place.duration, 0);
        const totalCost = this.itinerary.reduce((sum, place) => sum + place.cost, 0);
        const types = {};
        
        this.itinerary.forEach(place => {
            types[place.type] = (types[place.type] || 0) + 1;
        });
        
        return {
            totalDays,
            totalCost,
            placeCount: this.itinerary.length,
            types,
            places: this.itinerary.map(p => p.name)
        };
    }

    // Export itinerary
    exportItinerary(format = 'json') {
        switch(format) {
            case 'json':
                return JSON.stringify({
                    itinerary: this.itinerary,
                    stats: this.getStats(),
                    generated: new Date().toISOString()
                }, null, 2);
                
            case 'text':
                return this.itinerary.map(place => 
                    `Ngày ${place.day}: ${place.name} (${place.duration} ngày) - ${place.cost.toLocaleString('vi-VN')} VND`
                ).join('\n');
                
            default:
                return this.itinerary;
        }
    }
}

// UI Functions
function showItineraryPlanner() {
    const html = `
        <div style="background: white; padding: 30px; border-radius: 15px; max-width: 500px; margin: 20px auto;">
            <h3 style="color: #1e3c72;">🧠 Tạo lộ trình thông minh</h3>
            
            <div style="margin: 20px 0;">
                <label>Số ngày:</label>
                <input type="number" id="days" min="1" max="30" value="5" style="width: 100%; padding: 10px; margin: 5px 0;">
            </div>
            
            <div style="margin: 20px 0;">
                <label>Ngân sách (VND):</label>
                <input type="number" id="budget" value="5000000" style="width: 100%; padding: 10px; margin: 5px 0;">
            </div>
            
            <div style="margin: 20px 0;">
                <label>Sở thích:</label>
                <div style="display: flex; flex-wrap: wrap; gap: 10px; margin: 10px 0;">
                    <label><input type="checkbox" value="history"> Lịch sử</label>
                    <label><input type="checkbox" value="nature"> Thiên nhiên</label>
                    <label><input type="checkbox" value="food"> Ẩm thực</label>
                    <label><input type="checkbox" value="culture"> Văn hóa</label>
                    <label><input type="checkbox" value="beach"> Biển</label>
                    <label><input type="checkbox" value="mountain"> Núi</label>
                </div>
            </div>
            
            <button onclick="generateSmartItinerary()" 
                    style="background: #4CAF50; color: white; padding: 15px 30px; border: none; border-radius: 5px; width: 100%; cursor: pointer;">
                🧠 Tạo lộ trình
            </button>
        </div>
    `;
    
    // Show modal or update DOM
    document.getElementById('planner-container').innerHTML = html;
}

async function generateSmartItinerary() {
    const days = parseInt(document.getElementById('days').value);
    const budget = parseInt(document.getElementById('budget').value);
    const interestCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const interests = Array.from(interestCheckboxes).map(cb => cb.value);
    
    const planner = new ItineraryPlanner();
    await planner.loadPlaces();
    
    const itinerary = planner.generateItinerary({ days, budget, interests });
    const stats = planner.getStats();
    
    // Display results
    let resultHTML = `
        <h4>📋 Lộ trình ${stats.totalDays} ngày</h4>
        <p>${stats.placeCount} điểm đến | ${stats.totalCost.toLocaleString('vi-VN')} VND</p>
        <ul style="text-align: left; margin: 20px;">
    `;
    
    itinerary.forEach(item => {
        resultHTML += `
            <li style="margin: 10px 0; padding: 10px; background: #f5f7fa; border-radius: 5px;">
                <strong>${item.name}</strong> (${item.duration} ngày)<br>
                <small>${item.tags.join(', ')} | ${item.cost.toLocaleString('vi-VN')} VND</small>
            </li>
        `;
    });
    
    resultHTML += `
        </ul>
        <button onclick="saveItinerary()" style="background: #2196F3; color: white; padding: 10px 20px; border: none; border-radius: 5px; margin: 10px;">
            💾 Lưu lộ trình
        </button>
        <button onclick="exportItinerary('json')" style="background: #FF9800; color: white; padding: 10px 20px; border: none; border-radius: 5px; margin: 10px;">
            📥 Xuất JSON
        </button>
    `;
    
    document.getElementById('planner-results').innerHTML = resultHTML;
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Add planner UI to page
    const plannerHTML = `
        <div id="planner-container"></div>
        <div id="planner-results" style="margin-top: 30px;"></div>
    `;
    
    // Add to existing content or create new section
    const mainContainer = document.querySelector('.container');
    if (mainContainer) {
        const plannerSection = document.createElement('section');
        plannerSection.className = 'planner-section';
        plannerSection.innerHTML = `
            <div style="text-align: center; margin: 60px 0;">
                <h2><i class="fas fa-route"></i> Tạo lộ trình thông minh</h2>
                <p style="margin-bottom: 30px;">AI sẽ giúp bạn lên kế hoạch du lịch hoàn hảo</p>
                <button onclick="showItineraryPlanner()" class="btn btn-primary">
                    <i class="fas fa-magic"></i> Bắt đầu tạo lộ trình
                </button>
            </div>
            ${plannerHTML}
        `;
        mainContainer.appendChild(plannerSection);
    }
});
