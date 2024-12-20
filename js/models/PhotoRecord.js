export class PhotoRecord {
    constructor(cameraName, filmName, iso) {
        this.id = crypto.randomUUID();
        this.cameraName = cameraName;
        this.filmName = filmName;
        this.iso = iso;
        this.photos = [];
        this.creationDate = new Date();
    }

    addPhoto(location = null) {
        const photo = new Photo(this.photos.length + 1, new Date(), location);
        this.photos.push(photo);
        return photo;
    }

    removeLastPhoto() {
        if (this.photos.length === 0) return null;
        
        const lastPhoto = this.photos[this.photos.length - 1];
        const timeElapsed = (new Date() - lastPhoto.date) / 1000;
        
        if (timeElapsed > 60) {
            if (!confirm('This photo is not recent. Are you sure you want to delete it?')) {
                return null;
            }
        }
        
        return this.photos.pop();
    }

    toJSON() {
        return {
            id: this.id,
            cameraName: this.cameraName,
            filmName: this.filmName,
            iso: this.iso,
            photos: this.photos.map(photo => photo.toJSON()),
            creationDate: this.creationDate.toISOString()
        };
    }
}