export class PhotoList {
    constructor(container) {
        this.container = container;
    }

    render(record, onCommentClick) {
        return record.photos.map(photo => `
            <div class="photo-record" onclick="photoList.handleCommentClick('${record.id}', '${photo.id}')">
                <div>Photo #${photo.photoNumber} - ${new Date(photo.date).toLocaleString()}</div>
                ${photo.location ? `
                    <div class="location-info">
                        📍 ${photo.location.name || `${photo.location.latitude.toFixed(6)}, ${photo.location.longitude.toFixed(6)}`}
                    </div>
                ` : ''}
                ${photo.comment ? `
                    <div class="comment">💭 ${photo.comment}</div>
                ` : ''}
            </div>
        `).join('');
    }

    handleCommentClick(recordId, photoId) {
        if (this.onCommentClick) {
            this.onCommentClick(recordId, photoId);
        }
    }
}

