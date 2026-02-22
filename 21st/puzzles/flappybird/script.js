document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const startPrompt = document.getElementById('startPrompt');
    const messageModal = document.getElementById('messageModal');
    const retryModal = document.getElementById('retryModal');
    const continueBtn = document.getElementById('continueBtn');
    const retryBtn = document.getElementById('retryBtn');

    // Canvas sizing
    function resize() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Game Constants
    const GRAVITY = 0.22;
    const JUMP_STRENGTH = -5.0;
    const PIPE_SPEED = 2.2;
    const PIPE_SPAWN_RATE = 1800; // ms (Increased spacing)
    const PIPE_WIDTH = 52;
    const PIPE_GAP = 120; // Increased Gap
    const BIRD_SIZE = 34;

    // Assets
    const birdImg = new Image();
    birdImg.src = 'bird.png';
    const pipeTopImg = new Image();
    pipeTopImg.src = 'pipe-top.png';
    const pipeBottomImg = new Image();
    pipeBottomImg.src = 'pipe-bottom.png';
    const bgImg = new Image();
    bgImg.src = 'background.png';

    // Game State
    let birdY, birdVelocity, pipes, score, gameRunning, frameCount, lastPipeTime;
    let gameOver = false;

    function resetGame() {
        birdY = canvas.height / 2;
        birdVelocity = 0;
        pipes = [];
        score = 0;
        gameRunning = false;
        gameOver = false;
        frameCount = 0;
        lastPipeTime = 0;
        scoreDisplay.textContent = '0';
        startPrompt.style.display = 'block';
        messageModal.style.display = 'none';
        retryModal.style.display = 'none';
        draw();
    }

    function gameUpdateLoop() {
        if (gameOver) return;
        
        update();
        draw();
        requestAnimationFrame(gameUpdateLoop);
    }

    function spawnPipe() {
        const minPipeHeight = 50;
        const maxPipeHeight = canvas.height - PIPE_GAP - minPipeHeight;
        const topHeight = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight + 1)) + minPipeHeight;
        pipes.push({
            x: canvas.width,
            top: topHeight,
            passed: false
        });
    }

    function update() {
        if (!gameRunning || gameOver) return;

        // Bird Physics
        birdVelocity += GRAVITY;
        birdY += birdVelocity;

        // Ground/Ceiling collision
        if (birdY + BIRD_SIZE/2 >= canvas.height || birdY - BIRD_SIZE/2 <= 0) {
            endGame();
        }

        // Pipe Updates
        const now = Date.now();
        if (now - lastPipeTime > PIPE_SPAWN_RATE) {
            spawnPipe();
            lastPipeTime = now;
        }

        for (let i = pipes.length - 1; i >= 0; i--) {
            const pipe = pipes[i];
            pipe.x -= PIPE_SPEED;

            // Collision Detection
            const birdLeft = canvas.width / 4 - BIRD_SIZE / 2;
            const birdRight = canvas.width / 4 + BIRD_SIZE / 2;
            const birdTop = birdY - BIRD_SIZE / 2;
            const birdBottom = birdY + BIRD_SIZE / 2;

            if (birdRight > pipe.x && birdLeft < pipe.x + PIPE_WIDTH) {
                if (birdTop < pipe.top || birdBottom > pipe.top + PIPE_GAP) {
                    endGame();
                }
            }

            // Score check
            if (!pipe.passed && pipe.x + PIPE_WIDTH < canvas.width / 4) {
                pipe.passed = true;
                score++;
                scoreDisplay.textContent = score;
            }

            // Remove off-screen pipes
            if (pipe.x + PIPE_WIDTH < 0) {
                pipes.splice(i, 1);
            }
        }

        frameCount++;
    }

    function draw() {
        // Draw background sprite
        if (bgImg.complete) {
            ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        } else {
            ctx.fillStyle = '#70c5ce';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Draw Pipes
        pipes.forEach(pipe => {
            const bottomY = pipe.top + PIPE_GAP;
            if (pipeTopImg.complete && pipeBottomImg.complete) {
                // Top pipe - draw from top of canvas
                ctx.drawImage(pipeTopImg, pipe.x, pipe.top - 500, PIPE_WIDTH, 500); 
                // Bottom pipe - draw to bottom of canvas
                const bottomPipeHeight = canvas.height - bottomY;
                ctx.drawImage(pipeBottomImg, pipe.x, bottomY, PIPE_WIDTH, bottomPipeHeight);
            } else {
                ctx.fillStyle = '#2ecc71';
                ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.top);
                ctx.fillRect(pipe.x, bottomY, PIPE_WIDTH, canvas.height - bottomY);
            }
        });

        // Draw Bird
        ctx.save();
        ctx.translate(canvas.width / 4, birdY);
        const rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, birdVelocity * 0.1));
        ctx.rotate(rotation);

        if (birdImg.complete) {
            ctx.drawImage(birdImg, -BIRD_SIZE/2, -BIRD_SIZE/2, BIRD_SIZE, 24);
        } else {
            // Body
            ctx.fillStyle = '#f1c40f';
            ctx.fillRect(-BIRD_SIZE / 2, -BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE);
        }
        
        ctx.restore();
    }

    function gameLoop() {
        update();
        draw();
        if (!gameOver) {
            requestAnimationFrame(gameLoop);
        }
    }

    function jump() {
        if (gameOver) return;
        if (!gameRunning) {
            gameRunning = true;
            startPrompt.style.display = 'none';
            // Start the game loop when they first jump
            requestAnimationFrame(gameUpdateLoop);
        }
        birdVelocity = JUMP_STRENGTH;
    }

    function endGame() {
        gameOver = true;
        gameRunning = false;
        
        setTimeout(() => {
            if (score >= 15) {
                messageModal.style.display = 'flex';
            } else {
                retryModal.style.display = 'flex';
                document.getElementById('deathMessage').textContent = `You got ${score} points. You need 15!`;
            }
        }, 300);
    }

    // Input handlers
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space') jump();
    });
    canvas.addEventListener('mousedown', jump);
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        jump();
    }, { passive: false });

    retryBtn.addEventListener('click', resetGame);
    continueBtn.addEventListener('click', () => {
        window.location.href = '../../checkpoints/rowan.html';
    });

    resetGame();
    requestAnimationFrame(gameUpdateLoop);
});
