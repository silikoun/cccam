document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const megaMenu = document.querySelector('.mega-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');

    // Ensure siteBaseUrl is defined, e.g., from a PHP variable echoed into a script tag before this.
    // <script> const siteBaseUrl = "<?php echo $baseUrl; ?>"; </script>
    // For now, we'll try to be robust or assume relative paths work for AJAX.
    const siteBaseUrl = window.siteBaseUrl || '.'; // Use current dir as fallback for AJAX path

    if (sidebarToggle && megaMenu) {
        sidebarToggle.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default button action if any
            megaMenu.classList.toggle('active');
            if (mobileMenuOverlay) {
                mobileMenuOverlay.classList.toggle('active');
            }
            document.body.classList.toggle('mega-menu-open'); // For overflow:hidden on body
        });
    }

    if (mobileMenuOverlay && megaMenu) {
        mobileMenuOverlay.addEventListener('click', function() {
            megaMenu.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            document.body.classList.remove('mega-menu-open');
        });
    }

    // Category search functionality in mega-menu
    const searchInput = document.getElementById('categorySearch');
    if (searchInput) {
        const categoryGroups = document.querySelectorAll('.mega-menu .category-group');

        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            categoryGroups.forEach(group => {
                const categoryNameLink = group.querySelector('h3 a');
                if (categoryNameLink) {
                    const categoryName = categoryNameLink.textContent.toLowerCase();
                    group.style.display = categoryName.includes(searchTerm) ? 'block' : 'none';
                }
            });
        });
    }

    // Toggle subcategories in mega-menu
    document.querySelectorAll('.mega-menu .toggle-subcategories').forEach(button => {
        button.addEventListener('click', function() {
            const categoryId = this.dataset.category;
            const subcategoriesEl = document.getElementById(`subcategories-${categoryId}`);
            const icon = this.querySelector('i');
            
            if (icon) {
                icon.classList.toggle('fa-chevron-down');
                icon.classList.toggle('fa-chevron-up');
            }
            
            if (subcategoriesEl) {
                // Toggle display first
                const isCurrentlyHidden = subcategoriesEl.style.display === 'none' || subcategoriesEl.style.display === '';
                
                if (isCurrentlyHidden && (subcategoriesEl.innerHTML.includes('Loading...') || subcategoriesEl.children.length === 0) ) {
                    subcategoriesEl.innerHTML = '<li>Loading...</li>'; // Show loading state
                    subcategoriesEl.style.display = 'block'; // Show it to display loading message
                    
                    fetch(`${siteBaseUrl}/includes/get_subcategories.php?parent_id=${categoryId}`)
                        .then(response => response.json())
                        .then(data => {
                            if (data.length > 0) {
                                subcategoriesEl.innerHTML = data.map(sub => `
                                    <li>
                                        <a href="${siteBaseUrl}/category/${sub.slug}">
                                            ${sub.name}
                                        </a>
                                    </li>
                                `).join('');
                            } else {
                                subcategoriesEl.innerHTML = '<li>No subcategories found</li>';
                            }
                            // Ensure it remains block if it was just loaded
                            subcategoriesEl.style.display = 'block'; 
                        })
                        .catch(error => {
                            console.error('Error loading subcategories:', error);
                            subcategoriesEl.innerHTML = '<li>Error loading subcategories</li>';
                            subcategoriesEl.style.display = 'block';
                        });
                } else {
                     subcategoriesEl.style.display = isCurrentlyHidden ? 'block' : 'none';
                }
            }
        });
    });
});