// Google Maps Integration for Elite Mobile Detailing
class EliteMaps {
    constructor() {
        this.map = null;
        this.markers = [];
        this.serviceArea = null;
        this.apiKey = null;
        this.init();
    }

    init() {
        this.loadApiKey();
        this.createMapSection();
        this.setupEventListeners();
    }

    loadApiKey() {
        // In production, load from secure backend or environment
        this.apiKey = localStorage.getItem('google_maps_api_key') || 'AIzaSyBt8aZxVz9x9dYxJzJzJzJzJzJzJzJzJzJ'; // Replace with actual key
    }

    createMapSection() {
        const mapSection = document.createElement('section');
        mapSection.id = 'location-section';
        mapSection.className = 'w-full bg-obsidian py-32';
        mapSection.innerHTML = `
            <div class="max-w-[1400px] mx-auto px-6 md:px-20">
                <div class="text-center mb-20">
                    <span class="text-primary font-bold uppercase tracking-[0.5em] text-[10px]">Service Area</span>
                    <h2 class="text-white text-5xl md:text-6xl font-serif mb-8">We Come To You</h2>
                    <p class="text-white/60 text-lg max-w-3xl mx-auto font-light">
                        Serving the most prestigious neighborhoods in Los Angeles with our mobile detailing service.
                    </p>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div class="space-y-8">
                        <div class="glass-effect p-8 rounded-lg border border-white/10">
                            <h3 class="text-white text-2xl font-serif mb-6">Primary Service Areas</h3>
                            <div class="space-y-4">
                                <div class="flex items-center gap-4">
                                    <div class="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                                        <span class="material-symbols-outlined text-primary">location_on</span>
                                    </div>
                                    <div>
                                        <h4 class="text-white font-semibold">Beverly Hills</h4>
                                        <p class="text-white/60 text-sm">90210, 90211, 90212</p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-4">
                                    <div class="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                                        <span class="material-symbols-outlined text-primary">location_on</span>
                                    </div>
                                    <div>
                                        <h4 class="text-white font-semibold">Malibu</h4>
                                        <p class="text-white/60 text-sm">90263, 90265</p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-4">
                                    <div class="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                                        <span class="material-symbols-outlined text-primary">location_on</span>
                                    </div>
                                    <div>
                                        <h4 class="text-white font-semibold">West Hollywood</h4>
                                        <p class="text-white/60 text-sm">90046, 90048, 90069</p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-4">
                                    <div class="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                                        <span class="material-symbols-outlined text-primary">location_on</span>
                                    </div>
                                    <div>
                                        <h4 class="text-white font-semibold">Bel Air & Holmby Hills</h4>
                                        <p class="text-white/60 text-sm">90077, 90024</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="glass-effect p-8 rounded-lg border border-white/10">
                            <h3 class="text-white text-2xl font-serif mb-6">Service Radius</h3>
                            <div class="space-y-4">
                                <div class="flex items-center gap-4">
                                    <span class="material-symbols-outlined text-primary text-2xl">directions_car</span>
                                    <div>
                                        <h4 class="text-white font-semibold">30 Mile Radius</h4>
                                        <p class="text-white/60 text-sm">From our West Hollywood headquarters</p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-4">
                                    <span class="material-symbols-outlined text-primary text-2xl">schedule</span>
                                    <div>
                                        <h4 class="text-white font-semibold">Same Day Service</h4>
                                        <p class="text-white/60 text-sm">Available for most locations</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="text-center">
                            <p class="text-white/60 mb-4">Don't see your area listed?</p>
                            <button onclick="openContactModal()" class="premium-gradient text-black px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-transform">
                                Check Your Location
                            </button>
                        </div>
                    </div>
                    
                    <div class="relative">
                        <div id="map" class="w-full h-[600px] rounded-lg overflow-hidden border border-white/10"></div>
                        <div class="absolute top-4 right-4 glass-effect p-4 rounded-lg border border-white/10">
                            <h4 class="text-white font-semibold mb-2">Map Legend</h4>
                            <div class="space-y-2">
                                <div class="flex items-center gap-2">
                                    <div class="w-4 h-4 bg-primary rounded-full"></div>
                                    <span class="text-white/60 text-sm">Service Area</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <div class="w-4 h-4 bg-red-500 rounded-full"></div>
                                    <span class="text-white/60 text-sm">Headquarters</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insert before footer
        const footer = document.querySelector('footer');
        footer.parentNode.insertBefore(mapSection, footer);
    }

    setupEventListeners() {
        // Initialize map when section is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.map) {
                    this.initializeMap();
                }
            });
        });

        const mapSection = document.getElementById('location-section');
        if (mapSection) {
            observer.observe(mapSection);
        }
    }

    async initializeMap() {
        if (!window.google || !window.google.maps) {
            await this.loadGoogleMapsScript();
        }

        const mapElement = document.getElementById('map');
        if (!mapElement) return;

        // Map configuration
        const mapOptions = {
            center: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
            zoom: 11,
            styles: this.getMapStyles(),
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_BOTTOM
            }
        };

        this.map = new google.maps.Map(mapElement, mapOptions);

        // Add markers and service area
        this.addMarkers();
        this.addServiceArea();
        this.addCustomControls();
    }

    loadGoogleMapsScript() {
        return new Promise((resolve, reject) => {
            if (window.google && window.google.maps) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=geometry&callback=initMap`;
            script.async = true;
            script.defer = true;

            window.initMap = resolve;
            script.onerror = reject;

            document.head.appendChild(script);
        });
    }

    getMapStyles() {
        return [
            {
                "featureType": "all",
                "elementType": "geometry",
                "stylers": [{"color": "#050505"}]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#ffffff"}]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": [{"color": "#000000"}]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry",
                "stylers": [{"color": "#080808"}]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry",
                "stylers": [{"color": "#050505"}]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [{"color": "#0a0a0a"}]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{"color": "#0a0a0a"}]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{"color": "#0a0a0a"}]
            }
        ];
    }

    addMarkers() {
        // Headquarters marker
        const headquarters = {
            position: { lat: 34.0522, lng: -118.2437 },
            title: "Elite Studio Headquarters",
            address: "9200 Sunset Blvd, West Hollywood, CA 90069"
        };

        const marker = new google.maps.Marker({
            position: headquarters.position,
            map: this.map,
            title: headquarters.title,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#ef4444',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2
            }
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div class="p-4" style="color: #000;">
                    <h3 class="font-bold text-lg mb-2">${headquarters.title}</h3>
                    <p class="text-sm">${headquarters.address}</p>
                    <p class="text-sm mt-2">📞 +1 (310) 555-0198</p>
                </div>
            `
        });

        marker.addListener('click', () => {
            infoWindow.open(this.map, marker);
        });

        this.markers.push(marker);

        // Service area markers
        const serviceAreas = [
            { lat: 34.0736, lng: -118.4004, name: "Beverly Hills" },
            { lat: 34.0211, lng: -118.6976, name: "Malibu" },
            { lat: 34.0901, lng: -118.3617, name: "West Hollywood" },
            { lat: 34.1030, lng: -118.4107, name: "Bel Air" }
        ];

        serviceAreas.forEach(area => {
            const areaMarker = new google.maps.Marker({
                position: { lat: area.lat, lng: area.lng },
                map: this.map,
                title: area.name,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 6,
                    fillColor: '#d4af37',
                    fillOpacity: 0.8,
                    strokeColor: '#ffffff',
                    strokeWeight: 1
                }
            });

            this.markers.push(areaMarker);
        });
    }

    addServiceArea() {
        // Create a circle to show service area
        this.serviceArea = new google.maps.Circle({
            strokeColor: '#d4af37',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#d4af37',
            fillOpacity: 0.1,
            map: this.map,
            center: { lat: 34.0522, lng: -118.2437 },
            radius: 48280 // 30 miles in meters
        });
    }

    addCustomControls() {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'glass-effect p-3 rounded-lg border border-white/10';
        controlDiv.innerHTML = `
            <button onclick="eliteMaps.toggleServiceArea()" class="text-white text-sm hover:text-primary transition-colors">
                <span class="material-symbols-outlined">layers</span>
                Service Area
            </button>
        `;

        this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv);
    }

    toggleServiceArea() {
        if (this.serviceArea) {
            this.serviceArea.setMap(this.serviceArea.getMap() ? null : this.map);
        }
    }
}

// Initialize maps when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.eliteMaps = new EliteMaps();
});
