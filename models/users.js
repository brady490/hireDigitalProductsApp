const usersNames = require('../src/names.json'); // singleton for checking login validation 

module.exports.getUserName = (userId) => {
    return usersNames.find(item=> item.id == userId);
}

module.exports.getRecommendedProducts = (userId) => {
    if (!userId) return undefined;
}