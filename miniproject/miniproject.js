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

if (!localStorage.getItem("products")) {
    localStorage.setItem("products", JSON.stringify(products));
}

products = JSON.parse(localStorage.getItem("products"));

let inputSearch = document.getElementById("searchInput");
let selectCategory = document.getElementById("filterCategory");
let tbody = document.getElementById("productTableBody");

function render(list) {
    let html = "";

    for (let i = 0; i < list.length; i++) {
        html += `
        <tr>
            <td>${list[i].id}</td>
            <td>${list[i].name}</td>
            <td>${list[i].category}</td>
            <td>${list[i].price}</td>
            <td>${list[i].quantity}</td>
            <td>${list[i].description}</td>
        </tr>
        `;
    }

    tbody.innerHTML = html;
}

function handle() {
    let keyword = inputSearch.value.toLowerCase();
    let category = selectCategory.value;

    let result = [];

    for (let i = 0; i < products.length; i++) {
        let p = products[i];

        let checkName = p.name.toLowerCase().includes(keyword);
        let checkCategory = category === "" || p.category === category;

        if (checkName && checkCategory) {
            result.push(p);
        }
    }

    render(result);
}

inputSearch.oninput = handle;
selectCategory.onchange = handle;

render(products);