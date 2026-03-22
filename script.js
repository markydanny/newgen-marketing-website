// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if(hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });
});

// Smooth scrolling for anchor links 
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if(targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Fade-in animation on scroll using Intersection Observer
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Stop observing once visible
        }
    });
}, observerOptions);

// Observe all sections (except hero which animates on load)
document.querySelectorAll('section:not(.hero)').forEach(section => {
    section.classList.add('fade-in-section');
    observer.observe(section);
});

// =========================================
// Package Builder & Consultant Logic
// =========================================
const packageForm = document.getElementById('package-form');

if (packageForm) {
    const platformInputs = document.getElementsByName('platform');
    const postingInputs = document.getElementsByName('posting');
    const graphicsInputs = document.getElementsByName('graphics');
    const videoInput = document.getElementById('video');
    const addonsInputs = document.getElementsByName('addons');
    
    const totalPriceDisplay = document.getElementById('total-price');
    const scoreValueDisplay = document.getElementById('score-value');
    const scoreProgress = document.getElementById('score-progress');
    const scoreExplanation = document.getElementById('score-explanation');
    const consultantSuggestion = document.getElementById('consultant-suggestion');

    function calculatePackage() {
        let price = 0;
        let points = 0;
        let explanations = [];
        let suggestions = [];

        // 1. Platforms
        let platforms = 0;
        let hasTikTok = false;
        for (const input of platformInputs) {
            if (input.checked) {
                platforms++;
                if (input.value === 'tiktok') {
                    hasTikTok = true;
                }
                
                const ppwValStr = input.closest('.platform-card').querySelector('.ppw-val').textContent;
                const ppwVal = parseInt(ppwValStr, 10);
                if (ppwVal === 14) {
                    price += 20;
                } else if (ppwVal === 21) {
                    price += 50;
                }
            }
        }

        // Auto-select video if TikTok is chosen
        if (hasTikTok && !videoInput.checked) {
            videoInput.checked = true;
            explanations.push("Video Content was automatically added because TikTok is exclusively a video platform.");
        }

        // If no platforms are selected, ensure at least 1 is counted for the base price logic, or handle 0
        if (platforms === 0) {
            explanations.push("Please select at least one platform so we can start building your presence.");
        } else if (platforms === 1) {
            price += 100;
            points += 2;
            explanations.push("Starting with 1 platform builds a solid, focused foundation before expanding.");
        } else if (platforms > 1) {
            price += 100 + ((platforms - 1) * 80);
            points += 4;
            explanations.push(`Managing ${platforms} platforms gives you great coverage. At +$80/ea, it's highly cost-effective compared to hiring an in-house team.`);
        }

        if (platforms > 3) {
            suggestions.push("You've selected a powerful multi-platform strategy. To maximize this, ensure you are posting frequently enough to stay visible on all feeds.");
        } else if (platforms < 2) {
            suggestions.push("We strongly recommend adding a 2nd platform (+$80); the content is highly reusable, instantly doubling your reach for a minimal cost.");
        }

        // 2. Posting Frequency
        let postingFreq = 0;
        for (const input of postingInputs) {
            if (input.checked) {
                postingFreq = parseInt(input.value);
                break;
            }
        }
        
        if (postingFreq === 10) {
            price += 80;
            points += 2;
            explanations.push("10 posts/mo provides a good baseline presence.");
            suggestions.push("Increasing to 16 or 30 posts/mo gives the algorithms significantly more content to work with, drastically improving viral potential.");
        } else if (postingFreq === 16) {
            price += 120;
            points += 3;
            explanations.push("16 posts/mo is the 'sweet spot'. You stay active in the feed and keep audiences engaged.");
            suggestions.push("Upgrading to daily posting (30/mo) is the ultimate growth hack to ensure you beat your competitors' algorithms.");
        } else if (postingFreq === 30) {
            price += 200;
            points += 4;
            explanations.push("Daily posting (30/mo) is a premium, aggressive growth tactic designed for maximum brand recall.");
        }

        // 3. Graphic Creation
        let graphics = 'stock';
        for (const input of graphicsInputs) {
            if (input.checked) {
                graphics = input.value;
                break;
            }
        }

        if (graphics === 'custom') {
            price += 60;
            explanations.push("Custom Graphics (+$60) ensure your feed stands out, making it a very worthwhile investment over generic stock photos.");
        } else {
            explanations.push("Stock Graphics provide high-quality imagery to keep your feed looking professional.");
            suggestions.push("Upgrading to Custom Graphics (+$60) is the best way to develop a truly unique, recognizable brand identity.");
        }

        // 4. Video Content
        if (videoInput.checked) {
            price += 120;
            points += 2;
            explanations.push("Short-form Video (+$120) has the absolute highest ROI right now for reaching non-followers organically.");
        } else {
            explanations.push("Image-based content is a great start.");
            suggestions.push("We highly recommend including Short-form Video (+$120) to fully take advantage of the 'For You' pages on Instagram and TikTok.");
        }

        // 5. Add-Ons
        let hasEngagement = false;
        let hasStrategy = false;
        let hasAnalytics = false;

        addonsInputs.forEach(input => {
            if (input.checked) {
                if (input.value === 'engagement') {
                    price += 100;
                    points += 2;
                    hasEngagement = true;
                    explanations.push("Engagement management (+$100) is highly recommended. Ignoring comments hurts your brand, so it's worth having us handle it.");
                }
                if (input.value === 'strategy') {
                    price += 80;
                    hasStrategy = true;
                    explanations.push("Content Strategy (+$80) prevents you from wasting money posting organically without a conversion funnel.");
                }
                if (input.value === 'analytics') {
                    price += 0;
                    hasAnalytics = true;
                    explanations.push("Analytics (Free) is included at no extra cost to let us prove our ROI to you with hard data rather than guesswork.");
                }
            }
        });

        if (!hasAnalytics && !hasStrategy) {
            suggestions.push("Adding a Content Strategy (+$80) or opting into our Free Analytics ensures every post we make directly contributes to sales.");
        }

        if (price > 500) {
            explanations.unshift("You've built a highly premium, fully optimized package designed for maximum market dominance.");
        }

        // Render Price
        totalPriceDisplay.textContent = `$${price}`;

        // Render Score (Max points: 4(plats) + 4(posts) + 2(video) + 2(engage) = 12)
        let finalScore = (points / 12) * 10;
        finalScore = Math.min(10, Math.max(1, finalScore)); // Clamp between 1 and 10
        
        scoreValueDisplay.textContent = finalScore.toFixed(1);
        scoreProgress.style.width = `${(finalScore / 10) * 100}%`;

        // Update color based on score
        if (finalScore >= 8) {
            scoreValueDisplay.style.color = '#00f0ff'; // Blue
            scoreProgress.style.background = 'linear-gradient(135deg, #00f0ff, #00ff88)';
        } else if (finalScore >= 5) {
            scoreValueDisplay.style.color = '#8a2be2'; // Purple
            scoreProgress.style.background = 'linear-gradient(135deg, #00f0ff, #8a2be2)';
        } else {
            scoreValueDisplay.style.color = '#ffaa00'; // Orange/Warning
            scoreProgress.style.background = '#ffaa00';
        }

        // Render Explanations
        scoreExplanation.innerHTML = '';
        explanations.slice(0, 4).forEach(exp => { // Limit to 4 to avoid overwhelming the UI
            const li = document.createElement('li');
            li.textContent = exp;
            scoreExplanation.appendChild(li);
        });

        // Render Suggestions
        if (suggestions.length > 0) {
            consultantSuggestion.textContent = suggestions[0]; // Show the top most relevant suggestion
        } else {
            consultantSuggestion.textContent = "Your package is fully optimized for maximum digital impact!";
        }
    }

    // Attach event listeners to all inputs in the form
    packageForm.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', (e) => {
            
            // Auto-reset PPW back to 0 if user clicks the 10 or 16 posts/mo global option 
            if (e.target.name === 'posting' && (e.target.value === '10' || e.target.value === '16')) {
                document.querySelectorAll('.ppw-val').forEach(valSpan => {
                    valSpan.setAttribute('data-idx', '0');
                    valSpan.textContent = '0';
                });
                
                // Remove highlight when dropping down from the premium tier
                document.querySelectorAll('.custom-radio').forEach(r => r.classList.remove('highlight-package'));
            }
            
            calculatePackage();
        });
        
        if (input.type === 'number') {
            input.addEventListener('input', calculatePackage);
        }
    });

    // Run initial calculation
    calculatePackage();

    // Handle 'Get Started' Button Click
    window.handleGetStarted = function(e) {
        // Collect choices
        let selectedPlatforms = [];
        platformInputs.forEach(input => {
            if (input.checked) {
                // capitalize first letter and include ppw value if > 0
                const ppwValStr = input.closest('.platform-card').querySelector('.ppw-val').textContent;
                const platformName = input.value.charAt(0).toUpperCase() + input.value.slice(1);
                
                if (ppwValStr === '0') {
                    selectedPlatforms.push(platformName);
                } else {
                    selectedPlatforms.push(`${platformName} (${ppwValStr} posts/wk)`);
                }
            }
        });
        
        let freq = document.querySelector('input[name="posting"]:checked').value;
        let graphics = document.querySelector('input[name="graphics"]:checked').value === 'custom' ? 'Custom Graphics' : 'Stock Graphics';
        let hasVideo = videoInput.checked ? 'Yes' : 'No';
        
        let selectedAddons = [];
        addonsInputs.forEach(input => {
            if (input.checked) {
                selectedAddons.push(input.parentElement.textContent.trim());
            }
        });

        const summaryText = `--- Custom Package Request ---
Platforms: ${selectedPlatforms.length > 0 ? selectedPlatforms.join(', ') : 'None'}
Posting Frequency: ${freq} posts/month
Design: ${graphics}
Short-form Video: ${hasVideo}
Add-Ons: ${selectedAddons.length > 0 ? selectedAddons.join(', ') : 'None'}
---------------------------------

Hi MAD Marketing, I'd like to get started with this package. Please let me know what the next steps are!`;

        // Pre-fill form
        const serviceSelect = document.getElementById('service');
        if (serviceSelect) serviceSelect.value = 'social';
        
        const messageBox = document.getElementById('message');
        if (messageBox) messageBox.value = summaryText;
        
        // Let the anchor tag's smooth scrolling handle the navigation natively
    };

    // Handle Posts Per Week (PPW) Selection
    const ppwValues = [0, 3, 5, 14, 21];

    window.handlePpwClick = function(event, ctrlWrapper) {
        event.preventDefault(); // Stop label from toggling checkbox
        event.stopPropagation();
        
        // Check if clicked element was a button
        const target = event.target.closest('.ppw-btn');
        if (!target) return;
        
        const valSpan = ctrlWrapper.querySelector('.ppw-val');
        let currentIdx = parseInt(valSpan.getAttribute('data-idx') || 0);
        const dir = parseInt(target.getAttribute('data-dir'));
        
        let newIdx = currentIdx + dir;
        if (newIdx < 0) newIdx = 0;
        if (newIdx >= ppwValues.length) newIdx = ppwValues.length - 1;
        
        if (currentIdx !== newIdx) {
            valSpan.setAttribute('data-idx', newIdx);
            valSpan.textContent = ppwValues[newIdx];
            
            // Auto-check the platform if it isn't checked
            const checkbox = ctrlWrapper.closest('.platform-card').querySelector('input[type="checkbox"]');
            if (!checkbox.checked) {
                checkbox.checked = true;
            }
            
            // Auto-select 30 posts/mo and highlight it based on user request
            const thirtyRadio = document.querySelector('input[name="posting"][value="30"]');
            if (thirtyRadio && !thirtyRadio.checked) {
                thirtyRadio.checked = true;
                
                // Add highlight to the parent radio label container
                document.querySelectorAll('.custom-radio').forEach(r => r.classList.remove('highlight-package'));
                thirtyRadio.closest('.custom-radio').classList.add('highlight-package');
            }
            
            // Recalculate package totals after interacting with PPW buttons
            calculatePackage();
        }
    }
}

// =========================================
// Starfield Background
// =========================================
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.id = "stars-canvas";
canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.zIndex = "-1";
canvas.style.pointerEvents = "none";
document.body.prepend(canvas);

let width, height;
let stars = [];

function initStars() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    stars = [];
    // Calculate number of stars based on screen size
    const numStars = Math.floor((width * height) / 2000);
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.5 + 0.2, // Random size between 0.2 and 1.7
            opacity: Math.random(),
            speed: (Math.random() * 0.02) + 0.005 // Random twinkling speed
        });
    }
}

function animateStars() {
    ctx.clearRect(0, 0, width, height);
    stars.forEach(star => {
        // Update opacity for twinkling effect
        star.opacity += star.speed;
        if (star.opacity > 1 || star.opacity < 0.1) {
            star.speed = -star.speed;
        }
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
    });
    requestAnimationFrame(animateStars);
}

// Initialize and start animation
initStars();
animateStars();

// Re-initialize on window resize
window.addEventListener('resize', () => {
    initStars();
});


