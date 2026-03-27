
let products = [
    {
        id: 1,
        name: "Khô gà đè tem",
        category: "Thực phẩm",
        price: 36000,
        quantity: 9,
        description: "Bã mía",
    },
    {
        id: 2,
        name: "Thịt Bò Gác Bếp",
        category: "Thực phẩm",
        price: 600000,
        quantity: 3,
        description: "Thịt Lợn",
    },
    {
        id: 3,
        name: "Chân Gà Rút Xương",
        category: "Thực phẩm",
        price: 18000,
        quantity: 6,
        description: "Chân Gà Mate In China",
    },
];

let idCounter = 4;
let editId = null;

if (!localStorage.getItem("products_data")) {
    localStorage.setItem("products_data", JSON.stringify({
        products: products,
        idCounter: idCounter
    }));
}

let data = JSON.parse(localStorage.getItem("products_data"));
products = data.products;
idCounter = data.idCounter;

// Dom
let inputSearch = document.getElementById("searchInput");
let selectCategory = document.getElementById("filterCategory");
let tbody = document.getElementById("productTableBody");

let nameInput = document.getElementById("productName");
let categoryInput = document.getElementById("productCategory");
let priceInput = document.getElementById("productPrice");
let quantityInput = document.getElementById("productQuantity");
let descInput = document.getElementById("productDescription");

let form = document.getElementById("productForm");

let totalProducts = document.getElementById("totalProducts");
let totalValue = document.getElementById("totalValue");
let totalQuantity = document.getElementById("totalQuantity");

// lưu data
function saveData() {
    localStorage.setItem("products_data", JSON.stringify({
        products: products,
        idCounter: idCounter
    }));
}

// in ra
function render(list) {
    let html = "";

    for (let i = 0; i < list.length; i++) {
        let p = list[i];

        html += `
        <tr>
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.category}</td>
            <td>${p.price.toLocaleString()} ₫</td>
            <td style="color:${p.quantity < 10 ? 'red' : 'black'}">
                ${p.quantity}
            </td>
            <td>${p.description || ""}</td>
            <td>
                <button onclick="editProduct(${p.id})">Sửa</button>
                <button onclick="deleteProduct(${p.id})">Xóa</button>
            </td>
        </tr>
        `;
    }

    tbody.innerHTML = html;
}

// tìm kiếm và lọc
function handle() {
    let keyword = inputSearch.value.toLowerCase();
    let category = selectCategory.value;

    let result = [];

    for (let i = 0; i < products.length; i++) {
        let p = products[i];

        let checkName = p.name.toLowerCase().includes(keyword);
        let checkDesc = p.description.toLowerCase().includes(keyword);
        let checkCategory = category === "all" || category === "" || p.category === category;

        if ((checkName || checkDesc) && checkCategory) {
            result.push(p);
        }
    }

    render(result);
    updateStats();
}

// thêm và sửa
form.onsubmit = function (e) {
    e.preventDefault();

    let name = nameInput.value;
    let category = categoryInput.value;
    let price = Number(priceInput.value);
    let quantity = Number(quantityInput.value);
    let desc = descInput.value;

    if (!name.trim()) return alert("Tên không được rỗng");
    if (!category) return alert("Chưa chọn danh mục");
    if (price < 0 || isNaN(price)) return alert("Giá lỗi");
    if (quantity < 0 || !Number.isInteger(quantity)) return alert("Số lượng lỗi");

    if (editId) {
        // sửa 
        for (let i = 0; i < products.length; i++) {
            if (products[i].id === editId) {
                products[i].name = name;
                products[i].category = category;
                products[i].price = price;
                products[i].quantity = quantity;
                products[i].description = desc;
            }
        }
        editId = null;
    } else {
        // thêm 
        products.push({
            id: idCounter++,
            name: name,
            category: category,
            price: price,
            quantity: quantity,
            description: desc
        });
    }

    saveData();

    inputSearch.value = "";
    selectCategory.value = "all";

    handle();
    updateStats();
    form.reset();
};

// edit
function editProduct(id) {
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            let p = products[i];

            nameInput.value = p.name;
            categoryInput.value = p.category;
            priceInput.value = p.price;
            quantityInput.value = p.quantity;
            descInput.value = p.description;

            editId = id;
        }
    }
}

// xóa
function deleteProduct(id) {
    if (!confirm("Xóa sản phẩm?")) return;

    let newList = [];

    for (let i = 0; i < products.length; i++) {
        if (products[i].id !== id) {
            newList.push(products[i]);
        }
    }

    products = newList;

    saveData();
    handle();
}

// xóa tất cả
document.getElementById("clearAllBtn").onclick = function () {
    if (!confirm("Xóa tất cả?")) return;

    products = [];
    idCounter = 1;

    saveData();
    handle();
};

// stats
function updateStats() {
    let totalQ = 0;
    let totalV = 0;

    for (let i = 0; i < products.length; i++) {
        totalQ += products[i].quantity;
        totalV += products[i].price * products[i].quantity;
    }

    totalProducts.innerText = products.length;
    totalQuantity.innerText = totalQ;
    totalValue.innerText = totalV.toLocaleString() + " ₫";
}

// sự kiện
inputSearch.oninput = handle;
selectCategory.onchange = handle;

// init
handle();
updateStats();

