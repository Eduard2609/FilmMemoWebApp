export class LocationService {
    constructor() {
        this.currentLocation = null;
        this.locationCallbacks = new Set();
        this.initializeGeolocation();
    }

    initializeGeolocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.watchPosition(
                position => this.handlePositionUpdate(position),
                error => console.error('Location error:', error),
                { enableHighAccuracy: true }
            );
        }
    }

    async handlePositionUpdate(position) {
        const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${location.latitude}&lon=${location.longitude}&format=json`
            );
            const data = await response.json();
            location.name = `${data.address.city || data.address.town || ''}, ${data.address.state || ''}`.trim();
        } catch (error) {
            console.error('Geocoding error:', error);
        }

        this.currentLocation = location;
        this.notifyLocationUpdate();
    }

    onLocationUpdate(callback) {
        this.locationCallbacks.add(callback);
    }

    removeLocationCallback(callback) {
        this.locationCallbacks.delete(callback);
    }

    notifyLocationUpdate() {
        for (const callback of this.locationCallbacks) {
            callback(this.currentLocation);
        }
    }

    getCurrentLocation() {
        return this.currentLocation;
    }
}

