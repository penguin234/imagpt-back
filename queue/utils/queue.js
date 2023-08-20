function Queue() {
    this._arr = [];
}

Queue.prototype.enqueue = function(item) {
    this._arr.push(item);
};

Queue.prototype.dequeue = function() {
    return this._arr.shift();
};

Queue.prototype.count = function() {
    return this._arr.length;
};

Queue.prototype.empty = function() {
    return this.count() == 0;
};

module.exports = Queue;