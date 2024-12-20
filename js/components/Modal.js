export class Modal {
    constructor(id, title) {
        this.id = id;
        this.title = title;
        this.element = this.createModal();
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = this.id;
        
        modal.innerHTML = `
            <div class="modal-content">
                <h2>${this.title}</h2>
                <div class="modal-body"></div>
            </div>
        `;

        document.getElementById('modals').appendChild(modal);
        return modal;
    }

    setContent(content) {
        this.element.querySelector('.modal-body').innerHTML = content;
    }

    show() {
        this.element.style.display = 'flex';
    }

    hide() {
        this.element.style.display = 'none';
    }
}