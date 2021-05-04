// {
//     "productId":1001,
//     "productCategory":"Category 1",
//     "productName":"Product 1",
//     "productImage":"https://picsum.photos/400?image=780",
//     "productStock":true,
//     "productPrice":17159.389440190174,
//     "salePrice":17159.389440190174
//  },

const fs = require('fs');
const path = require('path');

const filePath = path.join(
    path.dirname(process.mainModule.filename), 
    'src', 
    'products.json')

const products = require(filePath);

var maxProdId = products.sort((a, b) => b["productId"] - a["productId"])[0]["productId"]

const getProductsFromFS = async () => {
    return new Promise ((resolve, reject) => {
        fs.readFile(filePath, (err, fileContent) => {
            let products = err ? []: JSON.parse(fileContent);
            return resolve(products);
        })
    })
}

const getNewProductId = () => {
    return ++maxProdId;
}

var productFieldsContract = {
    "name": {
        isMandatory: true,
        assign: (value, obj) => {
            if (!value) return;
            obj["productName"] = value.trim();
        }
    },
    "category": {
        isMandatory: true,
        assign: (value, obj) => {
            if (!value) return;
            obj["productCategory"] = value;
        }
    },
    "imageurl": {
        isMandatory: true,
        assign: (value, obj) => {
            if (!value) return;
            obj["productImage"] = value.toString();
        }
    },
    "stock": {
        isMandatory: true,
        assign: (value, obj) => {
            obj["productStock"] = value == 'true' ? true : false;
        }
    },
    "productPrice": {
        isMandatory: true,
        assign: (value, obj) => {
            if (!value) return;
            obj["productPrice"] = Number(value);
        }
    },
    "salePrice": {
        isMandatory: true,
        assign: (value, obj) => {
            if (!value) return;
            obj["salePrice"] = Number(value);
        }
    }
}

module.exports = class Product {
    constructor(productDetails) {
        Object.keys(productFieldsContract).forEach((field) => { // only arrow functions allowed
            let field_contract = productFieldsContract[field]
            if (!productDetails[field] && field_contract["isMandatory"]) {
                throw new Error(`Missing mandatory field "${field} "`);
            }

            field_contract.assign(productDetails[field], this);
        });
    }

    async add() {
        try {
            this["productId"] = getNewProductId();
            this["lastModifiedAt"] = new Date().toISOString();

            let products = await getProductsFromFS();
            products.push(this);

            await fs.writeFile(filePath, JSON.stringify(products), err => {});
            return Promise.resolve(true);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }

    async update(id) {
        try {
            if (!id) throw new Error("Cannot edit. missing product id to match");
            this["productId"] = parseInt(id);
            this["lastModifiedAt"] = new Date().toISOString();

            let products = await getProductsFromFS();
            var foundId = products.findIndex(item => item.productId == this["productId"]);
            if (foundId == -1) {
                throw new Error(`Product does not exist with id ${id}`);
            }

            Object.keys(this).forEach(field => {
                products[foundId][field] = this[field];
            });

            await fs.writeFile(filePath, JSON.stringify(products), err => {});
            return Promise.resolve(true);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }

    static async getAll() {
        let products = await getProductsFromFS();
        products = products.sort((a, b) => {
            if (a["lastModifiedAt"] && b["lastModifiedAt"]) {
                return (new Date(b["lastModifiedAt"]) - new Date(a["lastModifiedAt"]));
            }
            else if (!a["lastModifiedAt"] && b["lastModifiedAt"]) {
                return 1;
            }
            else if (a["lastModifiedAt"] && !b["lastModifiedAt"]) {
                return -1;
            }

            return b["productId"] - a["productId"];

        });

        return products
    }

    static async getById(id) {
        id = parseInt(id);
        let products = await getProductsFromFS();
        return products.find(item => item.productId == id);
    }
}