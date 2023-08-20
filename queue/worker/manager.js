const Queue = require('../utils/queue');
const { Worker } = require('./worker');


function Manager() {
    this._id = 0;
    this.workers = {};

    this.worker_queue = new Queue();
}


Manager.prototype.AddWorker = function(socket) {
    const id = this._id;
    this._id++;

    this.workers[id] = new Worker(id, socket, () => {
        delete this.workers[id];
    });

    this.StandBy(id);
};


Manager.prototype.StandBy = function(id) {
    this.worker_queue.enqueue(id);

    if (this.waiting) {
        this.waiting();
    }
};


Manager.prototype.Work = async function(params, callback) {
    if(this.worker_queue.empty()) {
        const wait = (resolve) => this.waiting = resolve;

        const thenable = {
            then(resolve, reject) {
                wait(resolve);
            }
        };

        await thenable;
    }

    let id = this.worker_queue.dequeue();

    this.workers[id].Work(params, (data) => {
        callback(data);
        this.StandBy(id);
    });
};


module.exports = Manager;