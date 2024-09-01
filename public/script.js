document.addEventListener('DOMContentLoaded', function() {
    const productForm = document.getElementById('productForm');
    const productsTable = document.getElementById('productsTable').getElementsByTagName('tbody')[0];

    function fetchProducts() {
        fetch('/produtos')
            .then(response => response.json())
            .then(products => {
                productsTable.innerHTML = '';
                products.forEach(product => {
                    const row = productsTable.insertRow();
                    row.insertCell(0).innerText = product.id;
                    row.insertCell(1).innerText = product.nome;
                    row.insertCell(2).innerText = product.codigo;
                    row.insertCell(3).innerText = product.descricao;
                    row.insertCell(4).innerText = product.preco;
                    const actionsCell = row.insertCell(5);
                    actionsCell.innerHTML = `
                        <button onclick="editProduct(${product.id})">Editar</button>
                        <button onclick="deleteProduct(${product.id})">Deletar</button>
                    `;
                });
            });
    }

    function saveProduct(event) {
        event.preventDefault();
        const id = document.getElementById('productId').value;
        const nome = document.getElementById('productName').value;
        const codigo = document.getElementById('productCode').value;
        const descricao = document.getElementById('productDescription').value;
        const preco = document.getElementById('productPrice').value;

        const method = id ? 'PUT' : 'POST';
        const url = id ? `/produtos/${id}` : '/produtos';

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, codigo, descricao, preco })
        })
        .then(response => response.text())
        .then(() => {
            fetchProducts();
            productForm.reset();
            document.getElementById('productId').value = '';
        });
    }

    function editProduct(id) {
        fetch(`/produtos/${id}`)
            .then(response => response.json())
            .then(product => {
                document.getElementById('productId').value = product.id;
                document.getElementById('productName').value = product.nome;
                document.getElementById('productCode').value = product.codigo;
                document.getElementById('productDescription').value = product.descricao;
                document.getElementById('productPrice').value = product.preco;
            });
    }

    function deleteProduct(id) {
        fetch(`/produtos/${id}`, { method: 'DELETE' })
            .then(response => response.text())
            .then(() => fetchProducts());
    }

    productForm.addEventListener('submit', saveProduct);
    fetchProducts();
});
