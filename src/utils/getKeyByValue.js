exports.getKeyByValue = (object, value) => {
    for (let prop in object) {
        if (object[prop] === value) return prop;
    }
};
