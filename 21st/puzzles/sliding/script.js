class PuzzleGame {
    constructor() {
        this.images = [];
        this.pieces = [];
        this.gridSlots = [];
        this.draggedPiece = null;
        this.offsetX = 0;
        this.offsetY = 0;
        this.gridSize = 3;
        this.pieceSize = 100;
        this.gridStartX = 0;
        this.gridStartY = 0;
        this.snapThreshold = 50; // Distance to snap to grid
        
        this.loadImages();
        this.setupEventListeners();
    }

    async loadImages() {
        // Load 9 images from the images folder
        this.images = [];
        let loadedCount = 0;

        for (let i = 1; i <= 9; i++) {
            const img = new Image();
            img.onload = () => {
                loadedCount++;
                if (loadedCount === 9) {
                    this.initGame();
                }
            };
            img.onerror = () => {
                console.error(`Failed to load tile-${i}.jpg`);
                loadedCount++;
            };
            img.src = `images/tile-${i}.jpg`;
            this.images[i - 1] = `images/tile-${i}.jpg`;
        }
    }

    setupEventListeners() {
        document.getElementById('continueBtn').addEventListener('click', () => {
            window.location.href = '../../checkpoints/elm.html';
        });
    }

    initGame() {
        this.createGridSlots();
        this.createPieces();
        this.getGridBounds();
    }

    createGridSlots() {
        const grid = document.getElementById('puzzleGrid');
        
        for (let i = 0; i < 9; i++) {
            const slot = document.createElement('div');
            slot.className = 'grid-slot';
            slot.dataset.index = i;
            grid.appendChild(slot);
            this.gridSlots.push({ element: slot, index: i, filled: false, pieceIndex: null });
        }
    }

    createPieces() {
        const container = document.getElementById('piecesContainer');
        
        for (let i = 0; i < 9; i++) {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.dataset.index = i;
            
            piece.style.backgroundImage = `url('${this.images[i]}')`;
            piece.style.backgroundPosition = '0px 0px';
            piece.style.backgroundSize = '100px 100px';
            piece.style.left = Math.random() * (container.clientWidth - this.pieceSize) + 'px';
            piece.style.top = Math.random() * (container.clientHeight - this.pieceSize) + 'px';
            
            piece.addEventListener('mousedown', (e) => this.startDrag(e, i));
            piece.addEventListener('touchstart', (e) => this.startDrag(e, i));
            
            container.appendChild(piece);
            this.pieces.push({ element: piece, index: i, placed: false });
        }
    }

    getGridBounds() {
        const grid = document.getElementById('puzzleGrid');
        const rect = grid.getBoundingClientRect();
        this.gridStartX = rect.left;
        this.gridStartY = rect.top;
    }

    startDrag(e, pieceIndex) {
        // Allow dragging of any piece
        if (!this.pieces[pieceIndex]) return;
        
        const piece = this.pieces[pieceIndex];
        
        // If piece was placed, unsnap it from its slot
        if (piece.placed) {
            const slot = this.gridSlots.find(s => s.pieceIndex === pieceIndex);
            if (slot) {
                slot.filled = false;
                slot.pieceIndex = null;
                slot.element.classList.remove('filled');
                piece.placed = false;
            }
        }
        
        this.draggedPiece = pieceIndex;
        const rect = this.pieces[pieceIndex].element.getBoundingClientRect();
        this.offsetX = (e.clientX || e.touches?.[0].clientX) - rect.left;
        this.offsetY = (e.clientY || e.touches?.[0].clientY) - rect.top;

        this.pieces[pieceIndex].element.classList.add('dragging');
        
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('touchmove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.stopDrag());
        document.addEventListener('touchend', () => this.stopDrag());
    }

    drag(e) {
        if (this.draggedPiece === null) return;
        
        const clientX = e.clientX || e.touches?.[0].clientX;
        const clientY = e.clientY || e.touches?.[0].clientY;
        
        const x = clientX - this.offsetX;
        const y = clientY - this.offsetY;
        
        this.pieces[this.draggedPiece].element.style.position = 'fixed';
        this.pieces[this.draggedPiece].element.style.left = x + 'px';
        this.pieces[this.draggedPiece].element.style.top = y + 'px';
    }

    stopDrag() {
        if (this.draggedPiece === null) return;
        
        const piece = this.pieces[this.draggedPiece];
        const rect = piece.element.getBoundingClientRect();
        const centerX = rect.left + this.pieceSize / 2;
        const centerY = rect.top + this.pieceSize / 2;
        
        // Check if piece is over grid
        for (let slot of this.gridSlots) {
            if (slot.filled) continue;
            
            const slotRect = slot.element.getBoundingClientRect();
            const slotCenterX = slotRect.left + slotRect.width / 2;
            const slotCenterY = slotRect.top + slotRect.height / 2;
            
            const distance = Math.sqrt(
                Math.pow(centerX - slotCenterX, 2) + Math.pow(centerY - slotCenterY, 2)
            );
            
            if (distance < this.snapThreshold) {
                this.snapPieceToSlot(this.draggedPiece, slot);
                piece.element.classList.remove('dragging');
                this.draggedPiece = null;
                return;
            }
        }
        
        piece.element.classList.remove('dragging');
        this.draggedPiece = null;
    }

    snapPieceToSlot(pieceIndex, slot) {
        const piece = this.pieces[pieceIndex];
        const slotRect = slot.element.getBoundingClientRect();
        
        // Position piece at slot
        piece.element.style.position = 'fixed';
        piece.element.style.left = slotRect.left + 'px';
        piece.element.style.top = slotRect.top + 'px';
        piece.element.classList.add('placed');
        
        // Mark as placed
        piece.placed = true;
        slot.filled = true;
        slot.pieceIndex = pieceIndex;
        slot.element.classList.add('filled');
        
        // Check if all pieces placed in correct slots
        if (this.isCompletedCorrectly()) {
            this.showCompletionMessage();
        }
    }

    isCompletedCorrectly() {
        // Check that each slot has the correct piece in it
        for (let slot of this.gridSlots) {
            if (!slot.filled || slot.pieceIndex !== slot.index) {
                return false;
            }
        }
        return true;
    }

    showCompletionMessage() {
        const modal = document.getElementById('messageModal');
        modal.classList.add('show');
    }
}

// Initialize puzzle when page loads
document.addEventListener('DOMContentLoaded', () => {
    new PuzzleGame();
});
