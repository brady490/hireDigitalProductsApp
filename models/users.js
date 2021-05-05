const usersNames = require('../src/names.json'); // singleton for checking login validation 

const fs = require('fs');
const path = require('path');

const filePath = path.join(
    path.dirname(process.mainModule.filename),
    'src',
    'users.json')


const getUsersFromFS = async () => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, fileContent) => {
            let products = err ? [] : JSON.parse(fileContent);
            return resolve(products);
        })
    })
}

module.exports.getUserName = (userId) => {
    return usersNames.find(item => item.id == userId);
}

module.exports.logProductView = async (userId, productId) => {
    let users = await getUsersFromFS();
    let foundUser = users.find(item => item.id == userId);

    if (foundUser) {
        if (!foundUser["productViews"]) {
            foundUser["productViews"] = {};
        }
        if (!foundUser["productViews"][productId]) {
            foundUser["productViews"][productId] = 0;
        }

        foundUser["productViews"][productId]++;

        await fs.writeFile(filePath, JSON.stringify(users), err => { });
        return Promise.resolve(true);
    }
}
function formMapOfUsers(users) {
    let map = {};
    users.forEach(item => {
        map[item.id] = item;
    });

    return map;
}

const Products = require('./products');

module.exports.getRecommendedProducts = async (userId) => {
    try {
        if (!userId) return undefined;

        let users = await getUsersFromFS();
        let usersMap = formMapOfUsers(users);

        let foundUser = usersMap[userId];

        let recommendedProductsMap = {};
        if (foundUser) {
            foundUser.following.forEach(fid => {
                let follower = usersMap[fid];
                if (follower["productViews"]) {
                    Object.keys(follower["productViews"]).forEach(pid => {
                        if (!recommendedProductsMap[pid] || recommendedProductsMap[pid] < follower["productViews"][pid]) {
                            recommendedProductsMap[pid] = follower["productViews"][pid];
                        }
                    });
                }
            });
        }

        // get top 5 recommendations
        let sortedProductIds = Object.keys(recommendedProductsMap).sort((a, b) => {
            return recommendedProductsMap[b] - recommendedProductsMap[a];
        });

        let top5Ids = sortedProductIds.slice(0, 5);

        let recommendations = [];
        for (let i = 0; i < top5Ids.length; i++) {
            let item = await Products.getById(top5Ids[i]);
            recommendations.push(item);
        }

        return recommendations && recommendations.length ? recommendations : undefined;
    }
    catch (err) {
        return Promise.reject(err);
    }

}