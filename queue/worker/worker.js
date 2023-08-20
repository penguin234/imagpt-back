const Command = {
    Health_Check: 1,
    Do_Job: 2,
    Graceful_Close: 3
};
Object.freeze(Command);

const State = {
    Waiting: 1,
    Working: 2
};
Object.freeze(State);


function Default(data) {}


function Worker(id, socket) {
    this.id = id;
    this.socket = socket;

    this.state = State.Waiting;
};


Worker.prototype.Work = function (params, callback) {
    if (this.state == State.Working) throw new Error('Worker is busy ' + this.id);

    this.state = State.Working;

    this.socket.on('data', (data) => {
        callback(data);
        this.state = State.Waiting;
        this.socket.on('data', Default);
    });

    this.socket.write(String(Command.Do_Job));
    this.socket.write(params.image + '\n' + params.question);
};


module.exports = Worker;