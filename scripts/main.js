
// Main JavaScript file for portfolio website

// Global variables
let currentTestimonial = 0;
let testimonials = [];

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Initialize all website functionality
function initializeWebsite() {
    setupNavigation();
    setupScrollEffects();
    loadContent();
    setupBackToTop();
    setupHamburgerMenu();
}

// Navigation setup
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Close mobile menu if open
            const navMenu = document.getElementById('nav-menu');
            const navToggle = document.getElementById('nav-toggle');
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });
    
    // Update active navigation link on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
        
        // Update scroll progress
        updateScrollProgress();
    });
}

// Hamburger menu setup
function setupHamburgerMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
        
        // Close menu on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 1200) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
}

// Scroll effects setup
function setupScrollEffects() {
    // Fade in sections on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all sections for fade in effect
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('fade-in-section');
        observer.observe(section);
    });
}

// Update scroll progress bar
function updateScrollProgress() {
    const scrolled = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        progressBar.style.width = scrolled + '%';
    }
}

// Back to top button setup
function setupBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Load dynamic content
function loadContent() {
    loadExperience();
    loadProjects();
    loadBlogPosts();
    loadTestimonials();
}

// Load experience from JSON
function loadExperience() {
    fetch('json/experience.json')
        .then(response => response.json())
        .then(data => {
            const timeline = document.getElementById('experience-timeline');
            if (timeline && data.experience) {
                timeline.innerHTML = '';
                
                data.experience.forEach(exp => {
                    const timelineItem = document.createElement('div');
                    timelineItem.className = 'timeline-item';
                    
                    timelineItem.innerHTML = `
                        <div class="timeline-year">${exp.year}</div>
                        <div class="timeline-content">
                            <h3>${exp.title}</h3>
                            <h4>${exp.company}</h4>
                            <span class="department">${exp.department}</span>
                            <p>${exp.description}</p>
                            ${exp.responsibilities ? `
                                <ul class="responsibilities">
                                    ${exp.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
                                </ul>
                            ` : ''}
                        </div>
                    `;
                    
                    timeline.appendChild(timelineItem);
                });
            }
        })
        .catch(error => console.error('Error loading experience:', error));
}

// Load projects from JSON
function loadProjects() {
    fetch('json/projects.json')
        .then(response => response.json())
        .then(data => {
            const projectsGrid = document.getElementById('projects-grid');
            if (projectsGrid && data.projects) {
                projectsGrid.innerHTML = '';
                
                data.projects.forEach(project => {
                    const projectCard = document.createElement('div');
                    projectCard.className = 'project-card';
                    
                    projectCard.innerHTML = `
                        <div class="project-header">
                            <h3>${project.name}</h3>
                            <i class="${project.icon}"></i>
                        </div>
                        <h4>${project.type}</h4>
                        <p>${project.description}</p>
                        <div class="project-tags">
                            ${project.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
                        </div>
                    `;
                    
                    projectsGrid.appendChild(projectCard);
                });
            }
        })
        .catch(error => console.error('Error loading projects:', error));
}

// Load blog posts from JSON
function loadBlogPosts() {
    fetch('json/blog.json')
        .then(response => response.json())
        .then(data => {
            const blogGrid = document.getElementById('blog-grid');
            if (blogGrid && data.blog) {
                // Clear existing content first
                const showAllCard = blogGrid.querySelector('.show-all');
                blogGrid.innerHTML = '';
                
                // Show only first 3 blog posts on main page
                const blogPosts = data.blog.slice(0, 3);
                
                blogPosts.forEach(post => {
                    const blogCard = document.createElement('div');
                    blogCard.className = 'blog-card';
                    
                    blogCard.innerHTML = `
                        <h3>${post.title}</h3>
                        <p>${post.description}</p>
                        <div class="blog-tags">
                            ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                        <div class="blog-links">
                            <a href="${post.link}" target="_blank" class="blog-link">
                                <i class="fas fa-external-link-alt"></i>
                                Read More
                            </a>
                        </div>
                    `;
                    
                    blogGrid.appendChild(blogCard);
                });
                
                // Re-add the show all card at the end
                if (showAllCard) {
                    blogGrid.appendChild(showAllCard);
                }
            }
        })
        .catch(error => console.error('Error loading blog posts:', error));
}

// Load testimonials from JSON
function loadTestimonials() {
    fetch('json/testimonials.json')
        .then(response => response.json())
        .then(data => {
            testimonials = data.testimonials;
            if (testimonials && testimonials.length > 0) {
                setupTestimonialSlider();
                displayTestimonial(0);
            }
        })
        .catch(error => console.error('Error loading testimonials:', error));
}

// Setup testimonial slider
function setupTestimonialSlider() {
    const slider = document.getElementById('testimonial-slider');
    const dotsContainer = document.getElementById('testimonial-dots');
    
    if (slider && dotsContainer && testimonials.length > 0) {
        // Create slides
        slider.innerHTML = '';
        testimonials.forEach((testimonial, index) => {
            const slide = document.createElement('div');
            slide.className = `testimonial-slide ${index === 0 ? 'active' : ''}`;
            slide.innerHTML = `
                <div class="testimonial-content">
                    <p>"${testimonial.text}"</p>
                    <div class="testimonial-author">
                        <span>${testimonial.author}</span>
                    </div>
                </div>
            `;
            slider.appendChild(slide);
        });
        
        // Create dots
        dotsContainer.innerHTML = '';
        testimonials.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = `dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => displayTestimonial(index));
            dotsContainer.appendChild(dot);
        });
        
        // Auto-rotate testimonials every 5 seconds
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            displayTestimonial(currentTestimonial);
        }, 5000);
    }
}

// Display specific testimonial
function displayTestimonial(index) {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    
    currentTestimonial = index;
}

// Change testimonial (for navigation buttons)
function changeTestimonial(direction) {
    currentTestimonial += direction;
    
    if (currentTestimonial >= testimonials.length) {
        currentTestimonial = 0;
    } else if (currentTestimonial < 0) {
        currentTestimonial = testimonials.length - 1;
    }
    
    displayTestimonial(currentTestimonial);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add scroll event listener with debouncing
window.addEventListener('scroll', debounce(function() {
    updateScrollProgress();
}, 10));

// Add resize event listener
window.addEventListener('resize', debounce(function() {
    // Handle any resize-specific functionality here
}, 250));

// Add page load completion
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Expose functions to global scope for onclick handlers
window.changeTestimonial = changeTestimonial;
