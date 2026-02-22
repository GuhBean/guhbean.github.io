document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('sudokuBoard');
    const modal = document.getElementById('messageModal');
    const continueBtn = document.getElementById('continueBtn');

    // Medium-Easy Sudoku puzzle (0 represents an empty cell)
    const puzzle = [
        [4, 0, 0, 2, 6, 9, 7, 0, 1],
        [6, 8, 2, 0, 7, 0, 0, 9, 3],
        [1, 9, 0, 8, 3, 4, 5, 6, 0],
        [8, 2, 0, 1, 0, 5, 3, 4, 0],
        [0, 7, 4, 6, 0, 2, 9, 1, 5],
        [9, 5, 1, 0, 4, 3, 0, 2, 8],
        [5, 0, 9, 3, 2, 6, 8, 7, 4],
        [2, 4, 0, 9, 5, 0, 1, 3, 6],
        [7, 6, 3, 4, 1, 8, 2, 5, 0]
    ];

    const solution = [
        [4, 3, 5, 2, 6, 9, 7, 8, 1],
        [6, 8, 2, 5, 7, 1, 4, 9, 3],
        [1, 9, 7, 8, 3, 4, 5, 6, 2],
        [8, 2, 6, 1, 9, 5, 3, 4, 7],
        [3, 7, 4, 6, 8, 2, 9, 1, 5],
        [9, 5, 1, 7, 4, 3, 6, 2, 8],
        [5, 1, 9, 3, 2, 6, 8, 7, 4],
        [2, 4, 8, 9, 5, 7, 1, 3, 6],
        [7, 6, 3, 4, 1, 8, 2, 5, 9]
    ];

    function createBoard() {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.dataset.row = r;
                input.dataset.col = c;

                if (puzzle[r][c] !== 0) {
                    input.value = puzzle[r][c];
                    input.readOnly = true;
                    cell.classList.add('readonly');
                } else {
                    input.addEventListener('input', (e) => {
                        const val = e.target.value;
                        if (!/^[1-9]$/.test(val)) {
                            e.target.value = '';
                        }
                        checkWin();
                    });
                }
                
                cell.appendChild(input);
                board.appendChild(cell);
            }
        }
    }

    function checkWin() {
        const inputs = board.querySelectorAll('input');
        let complete = true;
        let correct = true;

        inputs.forEach(input => {
            const r = parseInt(input.dataset.row);
            const c = parseInt(input.dataset.col);
            const val = parseInt(input.value);

            if (isNaN(val)) {
                complete = false;
            } else if (val !== solution[r][c]) {
                correct = false;
            }
        });

        if (complete && correct) {
            modal.style.display = 'flex';
        }
    }

    continueBtn.addEventListener('click', () => {
        window.location.href = '../../checkpoints/birch.html';
    });

    createBoard();
});
