document.addEventListener('DOMContentLoaded', function() {
    const loadMoreButtons = document.querySelectorAll('.btn-load-more');

    loadMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const categoryId = this.dataset.categoryId;
            let offset = parseInt(this.dataset.offset);
            const limit = parseInt(this.dataset.limit);
            const productsGridWrapper = document.getElementById(`products-grid-cat-${categoryId}`);

            if (!productsGridWrapper) {
                console.error(`Products grid wrapper not found for category ${categoryId}`);
                return;
            }

            this.textContent = 'Loading...';
            this.disabled = true;
            this.classList.add('loading');

            const formData = new FormData();
            formData.append('category_id', categoryId);
            formData.append('offset', offset);
            formData.append('limit', limit);

            fetch('load_more_products.php', { // This path needs to be correct from the page URL
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.html && data.html.trim() !== '') {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = data.html;
                    const targetGrid = productsGridWrapper.querySelector('.products-grid');
                    if (targetGrid) {
                        while (tempDiv.firstChild) {
                            targetGrid.appendChild(tempDiv.firstChild);
                        }
                    } else {
                        productsGridWrapper.insertAdjacentHTML('beforeend', data.html);
                    }
                    this.dataset.offset = data.newOffset;
                }

                if (!data.moreAvailable || (data.html && data.html.trim() === '')) {
                    this.textContent = 'No More Products';
                    this.classList.remove('loading');
                    this.classList.add('hidden');
                } else {
                    this.textContent = 'Load More Products';
                    this.disabled = false;
                    this.classList.remove('loading');
                }
            })
            .catch(error => {
                console.error('Error loading more products:', error);
                this.textContent = 'Error - Try Again';
                this.disabled = false;
                this.classList.remove('loading');
            });
        });
    });
});