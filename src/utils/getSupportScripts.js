const vm = require('vm');

const getSupportScripts = (content) => {
    if (!content.trim()) return '';
    const context = vm.createContext({
        module: {},
        require: require,
    });
    const script = new vm.Script(content);
    script.runInContext(context);
    const requiredObject = context.module.exports;
    return Object.keys(requiredObject).reduce((previousValue, currentValue) => {
        return previousValue + `\n<script>\n${requiredObject[currentValue].toString()}\n</script>`;
    }, '');
};

module.exports = {
    getSupportScripts,
};
