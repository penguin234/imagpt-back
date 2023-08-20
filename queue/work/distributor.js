const Queue = require('../utils/queue');


const State = {
    Paused: 1,
    Solving: 2
};
Object.freeze(State);


function Distributor(manager) {
    this.manager = manager;
    this.state = State.Paused;

    this.work_queue = new Queue();
}


Distributor.prototype.DoWorks = async function() {
    if (this.state != State.Paused) throw new Error('reactivated active queue');
    this.state = State.Solving;

    while(!this.work_queue.empty()) {
        const { params, callback } = this.work_queue.dequeue();
        await this.manager.Work(params, callback);
    }

    this.state = State.Paused;
};


Distributor.prototype.AddWork = function(work) {
    this.work_queue.enqueue(work);

    if (this.state == State.Paused) {
        Doworks();
    }
};


module.exports = Distributor;