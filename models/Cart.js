module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.qtdTotal = oldCart.qtdTotal || 0;
    this.valorTotal = oldCart.valorTotal || 0;

    this.add = function(item, id) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = {item: item, qtd: 0, valor: 0};
        }
        storedItem.qtd++;
        storedItem.valor = storedItem.item.valor * storedItem.qtd;
        this.qtdTotal++;
        this.valorTotal += storedItem.item.valor;
    };

    this.reduceByOne = function(id) {
        this.items[id].qtd--;
        this.items[id].valor -= this.items[id].item.valor;
        this.qtdTotal--;
        this.valorTotal -= this.items[id].item.valor;

        if (this.items[id].qtd <= 0) {
            delete this.items[id];
        }
    };

    this.removeItem = function(id) {
        this.qtdTotal -= this.items[id].qtd;
        this.valorTotal -= this.items[id].valor;
        delete this.items[id];
    };

    this.reset = function() {
        this.items = {};
        this.qtdTotal = 0;
        this.valorTotal =  0
    }
    
    this.generateArray = function() {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};