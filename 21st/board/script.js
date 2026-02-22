document.addEventListener('DOMContentLoaded', () => {
    const photoContainers = document.querySelectorAll('.photo-container');
    
    photoContainers.forEach((container, containerIndex) => {
        const photoCard = container.querySelector('.photo-card');
        const string = container.querySelector('.string');
        
        // Initial natural rotations
        const naturalRotations = [2, -3, 1, -2, 3, -1];
        let currentRotation = naturalRotations[containerIndex];
        let targetRotation = currentRotation;
        let velocity = 0;
        let isAnimating = false;
        let isHovering = false;
        
        const springStrength = 0.04;
        const damping = 0.88;
        const maxRotation = 20;
        
        // Set initial rotation
        photoCard.style.transform = `rotate(${currentRotation}deg)`;
        string.style.transform = `rotate(${currentRotation}deg)`;
        
        // Animation loop for smooth physics
        function animate() {
            // Spring physics
            const diff = targetRotation - currentRotation;
            velocity += diff * springStrength;
            velocity *= damping;
            currentRotation += velocity;
            
            // Apply rotation to both card and string together
            const rotation = `rotate(${currentRotation}deg)`;
            photoCard.style.transform = rotation;
            string.style.transform = rotation;
            
            // Continue animation if hovering or still has momentum
            if (isHovering || Math.abs(velocity) > 0.05 || Math.abs(diff) > 0.05) {
                requestAnimationFrame(animate);
            } else {
                isAnimating = false;
            }
        }
        
        function startAnimation() {
            if (!isAnimating) {
                isAnimating = true;
                animate();
            }
        }
        
        // Mouse enter handler
        container.addEventListener('mouseenter', () => {
            isHovering = true;
        });
        
        // Mouse move handler
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const mouseX = e.clientX;
            
            // Calculate distance from center (-1 to 1)
            const distanceFromCenter = (mouseX - centerX) / (rect.width / 2);
            
            // Set target rotation based on mouse position
            targetRotation = distanceFromCenter * maxRotation;
            
            // Start animation
            startAnimation();
        });
        
        // Mouse leave handler - return to neutral
        container.addEventListener('mouseleave', () => {
            isHovering = false;
            targetRotation = naturalRotations[containerIndex];
            startAnimation();
        });
        
        // Click handler for swinging effect
        photoCard.addEventListener('click', () => {
            // Add a bigger swing on click
            velocity += (Math.random() - 0.5) * 6;
            startAnimation();
        });
    });

    const sparkleColors = ['#fff6a3', '#ffd1dc', '#cce7ff', '#ffffff'];
    const sparkleInterval = 24;
    let lastSparkle = 0;

    function createSparkle(x, y) {
        const sparkle = document.createElement('span');
        sparkle.className = 'cursor-sparkle';
        const size = 4 + Math.random() * 6;
        const color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];

        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        sparkle.style.left = `${x - size / 2}px`;
        sparkle.style.top = `${y - size / 2}px`;
        sparkle.style.background = `radial-gradient(circle, ${color} 0%, rgba(255,255,255,0) 70%)`;

        document.body.appendChild(sparkle);
        sparkle.addEventListener('animationend', () => sparkle.remove());
    }

    document.addEventListener('pointermove', (e) => {
        const now = performance.now();
        if (now - lastSparkle < sparkleInterval) return;
        lastSparkle = now;
        createSparkle(e.clientX, e.clientY);
    });
});
