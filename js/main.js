/*!
 * Main JavaScript for Single Page Portfolio
 * Handles smooth scrolling, animations, and interactive features
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // SMOOTH SCROLLING FOR NAVIGATION LINKS
    // ========================================
    
    const scrollLinks = document.querySelectorAll('.js-scroll-trigger, .section-nav-item');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href') || this.getAttribute('data-target');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed nav
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // ACTIVE NAVIGATION HIGHLIGHTING
    // ========================================
    
    const sections = document.querySelectorAll('.main-section');
    const navLinks = document.querySelectorAll('.nav-link');
    const sectionNavItems = document.querySelectorAll('.section-nav-item');
    
    function updateActiveNav() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                // Update sidebar navigation
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
                
                // Update section navigation indicators
                sectionNavItems.forEach((item, itemIndex) => {
                    item.classList.remove('active');
                    if (itemIndex === index) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    // ========================================
    // SCROLL PROGRESS BAR
    // ========================================
    
    function updateProgressBar() {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = scrollPercent + '%';
        }
    }

    // ========================================
    // TIMELINE ANIMATION (PROGRESSIVE LOADING)
    // ========================================
    
    function animateTimelineItems() {
        const timelineItems = document.querySelectorAll('.timeline-container');
        
        timelineItems.forEach((item, index) => {
            const itemTop = item.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            // If item is in viewport, add loaded class with delay
            if (itemTop < windowHeight - 100) {
                setTimeout(() => {
                    item.classList.add('loaded');
                }, index * 150); // Stagger the animations
            }
        });
    }

    // ========================================
    // BACK TO TOP BUTTON
    // ========================================
    
    function createBackToTopButton() {
        // Create button if it doesn't exist
        let backToTopBtn = document.querySelector('.back-to-top');
        if (!backToTopBtn) {
            backToTopBtn = document.createElement('button');
            backToTopBtn.className = 'back-to-top';
            backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
            backToTopBtn.setAttribute('aria-label', 'Back to top');
            document.body.appendChild(backToTopBtn);
            
            // Add click event
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
        
        // Show/hide based on scroll position
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

    // ========================================
    // COURSE CARD ANIMATIONS
    // ========================================
    
    function animateCourseCards() {
        const courseCards = document.querySelectorAll('.course-card');
        
        courseCards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (cardTop < windowHeight - 50) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    }

    // Initialize course cards with initial hidden state
    function initializeCourseCards() {
        const courseCards = document.querySelectorAll('.course-card');
        courseCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.6s ease';
        });
    }

    // ========================================
    // NAVBAR COLLAPSE ON MOBILE
    // ========================================
    
    function handleMobileNavigation() {
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Close mobile menu when link is clicked
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
            });
        });
    }

    // ========================================
    // MAIN SCROLL EVENT HANDLER
    // ========================================
    
    let ticking = false;
    
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveNav();
                updateProgressBar();
                animateTimelineItems();
                createBackToTopButton();
                animateCourseCards();
                ticking = false;
            });
            ticking = true;
        }
    }

    // ========================================
    // ACCESSIBILITY ENHANCEMENTS
    // ========================================
    
    function enhanceAccessibility() {
        // Add focus management for skip link
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        // Ensure timeline content is focusable for keyboard navigation
        const timelineContent = document.querySelectorAll('.timeline-content');
        timelineContent.forEach(content => {
            content.setAttribute('tabindex', '0');
        });

        // Add keyboard support for section navigation
        sectionNavItems.forEach(item => {
            item.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }

    // ========================================
    // REDUCED MOTION SUPPORT
    // ========================================
    
    function handleReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            // Immediately show all timeline items
            const timelineItems = document.querySelectorAll('.timeline-container');
            timelineItems.forEach(item => {
                item.classList.add('loaded');
            });
            
            // Show all course cards
            const courseCards = document.querySelectorAll('.course-card');
            courseCards.forEach(card => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        }
    }

    // ========================================
    // INITIALIZATION
    // ========================================
    
    // Initialize all functionality
    initializeCourseCards();
    handleMobileNavigation();
    enhanceAccessibility();
    handleReducedMotion();
    
    // Initial calls
    updateActiveNav();
    updateProgressBar();
    animateTimelineItems();
    createBackToTopButton();
    animateCourseCards();
    
    // Event listeners
    window.addEventListener('scroll', onScroll);
    
    // Handle resize events
    window.addEventListener('resize', () => {
        updateActiveNav();
        animateTimelineItems();
    });

    // ========================================
    // PERFORMANCE OPTIMIZATION
    // ========================================
    
    // Intersection Observer for better performance (alternative to scroll events)
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('timeline-container')) {
                        entry.target.classList.add('loaded');
                    }
                    if (entry.target.classList.contains('course-card')) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                }
            });
        }, observerOptions);

        // Observe timeline items and course cards
        document.querySelectorAll('.timeline-container, .course-card').forEach(el => {
            observer.observe(el);
        });
    }

    console.log('Portfolio website initialized successfully! 🚀');
});