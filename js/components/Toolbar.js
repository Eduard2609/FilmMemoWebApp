export class Toolbar {
    constructor() {
        this.element = document.createElement('div');
        this.element.className = 'toolbar';
    }

    render(record, onUndo, onAddPhoto) {
        this.element.innerHTML = `
            <button class="floating-button cancel" onclick="toolbar.handleUndo('${record.id}')">↩️</button>
            <button class="floating-button" onclick="toolbar.handleAddPhoto('${record.id}')">📸</button>
        `;
        return this.element;
    }

    handleUndo(recordId) {
        if (this.onUndo) {
            this.onUndo(recordId);
        }
    }

    handleAddPhoto(recordId) {
        if (this.onAddPhoto) {
            this.onAddPhoto(recordId);
        }
    }
}