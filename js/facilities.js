// Facilities finder for VietTravelGuide

class FacilityFinder {
    constructor() {
        this.facilities = {
            hotels: [
                { name: "Khách sạn 5 sao", type: "luxury", price: "2,000,000+", rating: 4.5 },
                { name: "Khách sạn 3-4 sao", type: "mid-range", price: "800,000-1,500,000", rating: 4.0 },
                { name: "Nhà nghỉ", type: "budget", price: "200,000-500,000", rating: 3.5 },
                { name: "Homestay", type: "local", price: "300,000-800,000", rating: 4.2 }
            ],
            restaurants: [
                { name: "Nhà hàng cao cấp", type: "fine-dining", cuisine: "Đa dạng", rating: 4.3 },
                { name: "Nhà hàng địa phương", type: "local", cuisine: "Đặc sản", rating: 4.5 },
                { name: "Quán ăn đường phố", type: "street-food", cuisine: "Bình dân", rating: 4.7 },
                { name: "Quán cà phê", type: "cafe", cuisine: "Đồ uống", rating: 4.4 }
            ],
            medical: [
                { name: "Bệnh viện đa khoa", type: "hospital", emergency: true },
                { name: "Phòng khám", type: "clinic", emergency: false },
                { name: "Nhà thuốc", type: "pharmacy", emergency: false }
            ],
            services: [
                { name: "ATM", type: "banking" },
                { name: "Trạm xăng", type: "fuel" },
                { name: "WiFi công cộng", type: "internet" },
                { name: "Bến xe", type: "transport" }
            ]
        };
    }

    findNearby(location, type = 'all', radius = 5) {
        // In real app, this would use Google Maps API or similar
        // For demo, return sample data
        return {
            location,
            radius: radius + 'km',
            results: this.facilities[type] || Object.values(this.facilities).flat(),
            timestamp: new Date().toLocaleString()
        };
    }

    showFacilitiesModal(type) {
        const facilities = this.facilities[type] || [];
        
        let html = `
            <div style="background: white; padding: 20px; border-radius: 10px; max-width: 400px;">
                <h4 style="color: #1e3c72; margin-bottom: 20px;">
                    <i class="fas fa-${this.getIcon(type)}"></i> ${this.getTypeName(type)}
                </h4>
        `;
        
        facilities.forEach(facility => {
            html += `
                <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                    <strong>${facility.name}</strong>
                    ${facility.price ? `<br><small>Giá: ${facility.price} VND</small>` : ''}
                    ${facility.rating ? `<br><small>Đánh giá: ${'★'.repeat(Math.floor(facility.rating))} ${facility.rating}</small>` : ''}
                </div>
            `;
        });
        
        html += `
                <button onclick="closeModal()" style="margin-top: 20px; padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; width: 100%;">
                    Đóng
                </button>
            </div>
        `;
        
        // Show modal
        document.getElementById('facility-modal').innerHTML = html;
        document.getElementById('facility-modal').style.display = 'block';
    }

    getIcon(type) {
        const icons = {
            hotels: 'hotel',
            restaurants: 'utensils',
            medical: 'first-aid',
            services: 'concierge-bell'
        };
        return icons[type] || 'info-circle';
    }

    getTypeName(type) {
        const names = {
            hotels: 'Khách sạn & Nhà nghỉ',
            restaurants: 'Nhà hàng & Ăn uống',
            medical: 'Y tế & Sức khỏe',
            services: 'Dịch vụ tiện ích'
        };
        return names[type] || 'Tiện ích';
    }
}

// Add to index.html
function showFacilitiesFinder() {
    const html = `
        <div style="background: white; padding: 30px; border-radius: 15px; margin: 30px 0;">
            <h3 style="color: #1e3c72; text-align: center;">
                <i class="fas fa-concierge-bell"></i> Tìm tiện ích xung quanh
            </h3>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0;">
                <button onclick="finder.showFacilitiesModal('hotels')" class="facility-btn">
                    <i class="fas fa-hotel"></i><br>Khách sạn
                </button>
                <button onclick="finder.showFacilitiesModal('restaurants')" class="facility-btn">
                    <i class="fas fa-utensils"></i><br>Nhà hàng
                </button>
                <button onclick="finder.showFacilitiesModal('medical')" class="facility-btn">
                    <i class="fas fa-first-aid"></i><br>Y tế
                </button>
                <button onclick="finder.showFacilitiesModal('services')" class="facility-btn">
                    <i class="fas fa-concierge-bell"></i><br>Dịch vụ
                </button>
            </div>
        </div>
        
        <!-- Modal container -->
        <div id="facility-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;">
        </div>
        
        <style>
        .facility-btn {
            padding: 30px 20px;
            background: #f8f9fa;
            border: 2px solid #e9ecef;
            border-radius: 15px;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 16px;
            color: #1e3c72;
        }
        .facility-btn:hover {
            background: #1e3c72;
            color: white;
            transform: translateY(-5px);
        }
        .facility-btn i {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        </style>
    `;
    
    document.getElementById('facilities-section').innerHTML = html;
}

// Initialize
const finder = new FacilityFinder();
