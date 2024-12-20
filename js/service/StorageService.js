export class StorageService {
    constructor() {
        this.storageKey = 'photoRecords';
    }

    saveRecords(records) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(records));
            return true;
        } catch (error) {
            console.error('Error saving records:', error);
            return false;
        }
    }

    loadRecords() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (!data) return [];

            return JSON.parse(data, (key, value) => {
                if (key === 'date' || key === 'creationDate') {
                    return new Date(value);
                }
                return value;
            });
        } catch (error) {
            console.error('Error loading records:', error);
            return [];
        }
    }

    exportRecord(record) {
        let text = `Film Roll: ${record.cameraName}_${record.filmName}\n`;
        text += "----------------------------------------\n\n";

        record.photos.forEach(photo => {
            text += `Photo #${photo.photoNumber}\n`;
            text += `Camera Model: ${record.cameraName}\n`;
            text += `Film: ${record.filmName}\n`;
            text += `ISO: ${record.iso}\n`;
            text += `Date/Time Original: ${new Date(photo.date).toLocaleString()}\n`;
            
            if (photo.location) {
                text += `GPS Latitude: ${photo.location.latitude}\n`;
                text += `GPS Longitude: ${photo.location.longitude}\n`;
                if (photo.location.name) {
                    text += `Location: ${photo.location.name}\n`;
                }
            }
            
            if (photo.comment) {
                text += `Notes: ${photo.comment}\n`;
            }
            text += "----------------------------------------\n\n";
        });

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${record.cameraName}_${record.filmName}_metadata.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}