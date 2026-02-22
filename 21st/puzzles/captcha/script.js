document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('captchaGrid');
    const verifyBtn = document.getElementById('verifyBtn');
    const modal = document.getElementById('messageModal');
    const continueBtn = document.getElementById('continueBtn');
    
    // Config: Change these to match your images
    const targetName = "YOU"; 
    const correctIndexes = [0, 2, 5]; // 0-indexed: which images contain the target
    
    // Placeholder image URLs (using 400x400 from Unsplash or similar)
    // In a real scenario, you'd replace these with your own local images
    const images = [
        "photo-0.jpg", // 0
        "photo-1.jpg", // 1
        "photo-2.jpg", // 2
        "photo-3.jpg", // 3
        "photo-4.jpg", // 4
        "photo-5.jpg", // 5
        "photo-6.jpg", // 6
        "photo-7.jpg", // 7
        "photo-8.jpg"  // 8
    ];

    document.getElementById('captchaTarget').textContent = targetName;

    const selectedIndices = new Set();

    function createGrid() {
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = i;

            const img = document.createElement('img');
            img.src = images[i];
            cell.appendChild(img);

            cell.addEventListener('click', () => {
                if (selectedIndices.has(i)) {
                    selectedIndices.delete(i);
                    cell.classList.remove('selected');
                } else {
                    selectedIndices.add(i);
                    cell.classList.add('selected');
                }
            });

            grid.appendChild(cell);
        }
    }

    verifyBtn.addEventListener('click', () => {
        const isCorrect = correctIndexes.length === selectedIndices.size &&
            correctIndexes.every(idx => selectedIndices.has(idx));

        if (isCorrect) {
            modal.style.display = 'flex';
        } else {
            // Shake the container on error
            const container = document.querySelector('.captcha-container');
            container.style.animation = 'shake 0.4s';
            setTimeout(() => {
                container.style.animation = '';
            }, 400);
            
            // Clear selections on error to make it "re-try" like a real captcha
            selectedIndices.clear();
            document.querySelectorAll('.cell').forEach(cell => cell.classList.remove('selected'));
        }
    });

    continueBtn.addEventListener('click', () => {
        window.location.href = '../../puzzles/flappybird';
    });

    createGrid();
});
