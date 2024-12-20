// app.js
import { PhotoRecord } from './models/PhotoRecord.js';
import { LocationService } from './services/LocationService.js';
import { StorageService } from './services/StorageService.js';
import { Modal } from './components/Modal.js';
import { PhotoList } from './components/PhotoList.js';
import { Toolbar } from './components/Toolbar.js';

class App {
    constructor() {
        this.locationService = new LocationService();
        this.storageService = new StorageService();
        this.photoList = new PhotoList(document.getElementById('folders'));
        this.toolbar = new Toolbar();
        
        this.photoRecords = this.storageService.loadRecords();
        this.initializeModals();
        this.initializeEventListeners();
        this.render();
    }

    initializeModals() {
        this.newRollModal = new Modal('newRollModal', 'New Film Roll');
        this.commentModal = new Modal('commentModal', 'Add Comment');
        
        this.newRollModal.setContent(`
            <form id="newRollForm">
                <label>Camera Name:
                    <input type="text" id="cameraName" required>
                </label>
                <label>Film Name:
                    <input type="text" id="filmName" required>
                </label>
                <label>ISO:
                    <select id="iso" required>
                        <option value="">Select ISO</option>
                        <option>50</option>
                        <option>100</option>
                        <option>200</option>
                        <option>400</option>
                        <option>800</option>
                        <option>1600</option>
                        <option>3200</option>
                    </select>
                </label>
                <div class="btn-group">
                    <button type="submit">Save</button>
                    <button type="button" class="cancel" onclick="app.hideNewRollModal()">Cancel</button>
                </div>
            </form>
        `);

        this.commentModal.setContent(`
            <textarea id="photoComment" rows="4" placeholder="Add comment here"></textarea>
            <div class="btn-group">
                <button onclick="app.saveComment()">Save</button>
                <button class="cancel" onclick="app.hideCommentModal()">Cancel</button>
            </div>
        `);
    }

    initializeEventListeners() {
        document.getElementById('newRollButton').addEventListener('click', () => this.showNewRollModal());
        document.getElementById('newRollForm').addEventListener('submit', (e) => this.handleNewRoll(e));
        
        // Make app instance available globally for modal buttons
        window.app = this;
    }

    handleNewRoll(e) {
        e.preventDefault();
        const cameraName = document.getElementById('cameraName').value;
        const filmName = document.getElementById('filmName').value;
        const iso = document.getElementById('iso').value;
        
        const newRecord = new PhotoRecord(cameraName, filmName, iso);
        this.photoRecords.push(newRecord);
        this.storageService.saveRecords(this.photoRecords);
        this.render();
        this.newRollModal.hide();
        e.target.reset();
    }

    showNewRollModal() {
        this.newRollModal.show();
    }

    hideNewRollModal() {
        this.newRollModal.hide();
    }

    showCommentModal(recordId, photoId) {
        this.selectedPhoto = { recordId, photoId };
        const record = this.photoRecords.find(r => r.id === recordId);
        const photo = record.photos.find(p => p.id === photoId);
        document.getElementById('photoComment').value = photo.comment || '';
        this.commentModal.show();
    }

    hideCommentModal() {
        this.commentModal.hide();
        this.selectedPhoto = null;
    }

    saveComment() {
        if (!this.selectedPhoto) return;

        const record = this.photoRecords.find(r => r.id === this.selectedPhoto.recordId);
        const photo = record.photos.find(p => p.id === this.selectedPhoto.photoId);
        if (!photo) return;

        photo.comment = document.getElementById('photoComment').value.trim();
        this.storageService.saveRecords(this.photoRecords);
        this.render();
        this.hideCommentModal();
    }

    addPhotoRecord(recordId) {
        const record = this.photoRecords.find(r => r.id === recordId);
        if (!record) return;

        record.addPhoto(this.locationService.getCurrentLocation());
        this.storageService.saveRecords(this.photoRecords);
        this.render();
    }

    undoLastPhoto(recordId) {
        const record = this.photoRecords.find(r => r.id === recordId);
        if (!record) return;

        record.removeLastPhoto();
        this.storageService.saveRecords(this.photoRecords);
        this.render();
    }

    exportRecord(recordId) {
        const record = this.photoRecords.find(r => r.id === recordId);
        if (!record) return;
        this.storageService.exportRecord(record);
    }

    render() {
        const foldersDiv = document.getElementById('folders');
        foldersDiv.innerHTML = this.photoRecords.map(record => `
            <div class="folder">
                <div class="header">
                    <h2>${record.cameraName} | ${record.filmName} | ISO ${record.iso}</h2>
                    <button class="export-button" onclick="app.exportRecord('${record.id}')">
                        Export
                    </button>
                </div>
                <div class="photos">
                    ${this.photoList.render(record)}
                </div>
                <div class="toolbar">
                    <button class="floating-button cancel" onclick="app.undoLastPhoto('${record.id}')">↩️</button>
                    <button class="floating-button" onclick="app.addPhotoRecord('${record.id}')">📸</button>
                </div>
            </div>
        `).join('');
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});