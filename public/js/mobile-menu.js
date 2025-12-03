/*
 * Mobile Menu Handler
 * Handles sidebar toggle for mobile devices
 */

document.addEventListener('DOMContentLoaded', function() {
    // Create hamburger button if it doesn't exist
    if (!document.querySelector('.hamburger-btn')) {
        const hamburger = document.createElement('button');
        hamburger.className = 'hamburger-btn';
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        hamburger.setAttribute('aria-label', 'Toggle menu');
        document.body.appendChild(hamburger);
    }
    
    // Create sidebar overlay if it doesn't exist
    if (!document.querySelector('.sidebar-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
    }
    
    const hamburger = document.querySelector('.hamburger-btn');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (!hamburger || !sidebar || !overlay) return;
    
    // Toggle sidebar
    function toggleSidebar() {
        sidebar.classList.toggle('show');
        overlay.classList.toggle('show');
        
        // Update hamburger icon
        const icon = hamburger.querySelector('i');
        if (sidebar.classList.contains('show')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
        
        // Prevent body scroll when sidebar is open
        if (sidebar.classList.contains('show')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    // Close sidebar
    function closeSidebar() {
        sidebar.classList.remove('show');
        overlay.classList.remove('show');
        hamburger.querySelector('i').className = 'fas fa-bars';
        document.body.style.overflow = '';
    }
    
    // Event listeners
    hamburger.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', closeSidebar);
    
    // Close sidebar when clicking a nav link (mobile only)
    const navLinks = sidebar.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                closeSidebar();
            }
        });
    });
    
    // Close sidebar on window resize if screen becomes larger
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeSidebar();
        }
    });
    
    // Handle swipe gestures
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchEndX - touchStartX;
        
        // Swipe right to open (from left edge)
        if (diff > swipeThreshold && touchStartX < 50 && !sidebar.classList.contains('show')) {
            toggleSidebar();
        }
        
        // Swipe left to close
        if (diff < -swipeThreshold && sidebar.classList.contains('show')) {
            closeSidebar();
        }
    }
});

// Add scroll indicator for tables
document.addEventListener('DOMContentLoaded', function() {
    const tableContainers = document.querySelectorAll('.table-responsive');
    
    tableContainers.forEach(container => {
        container.addEventListener('scroll', function() {
            if (this.scrollLeft > 10) {
                this.classList.add('scrolled');
            } else {
                this.classList.remove('scrolled');
            }
        });
    });
});

// Prevent zoom on double tap (iOS)
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Add viewport meta tag if not present
if (!document.querySelector('meta[name="viewport"]')) {
    const viewport = document.createElement('meta');
    viewport.name = 'viewport';
    viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    document.head.appendChild(viewport);
}
