export class Photo {
    constructor(photoNumber, date = new Date(), location = null, comment = null) {
        this.id = crypto.randomUUID();
        this.date = date;
        this.photoNumber = photoNumber;
        this.location = location;
        this.comment = comment;
    }

    toJSON() {
        return {
            id: this.id,
            date: this.date.toISOString(),
            photoNumber: this.photoNumber,
            location: this.location,
            comment: this.comment
        };
    }
}