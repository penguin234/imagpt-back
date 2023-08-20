const Command = {
    Health_Check: 1,
    Do_Job: 2,
    Graceful_Close: 3
};
Object.freeze(Command);

const State = {
    Waiting: 1,
    Working: 2,
    Checking: 3
};
Object.freeze(State);


function Default(data) {}


function Worker(id, socket, destructor) {
    this.id = id;
    this.socket = socket;

    socket.setEncoding('utf8');
    this.socket.on('close', () => {
        destructor();
    });

    this.state = State.Waiting;
};


Worker.prototype.Work = function (params, callback) {
    if (this.state != State.Waiting) throw new Error('Worker is busy ' + this.id);

    this.state = State.Working;

    this.socket.on('data', (data) => {
        callback(data);
        this.state = State.Waiting;
        this.socket.on('data', Default);
    });

    this.socket.write(String(Command.Do_Job));
    this.socket.write(params.image + '\n' + params.question);
};


Worker.prototype.HealthCheck = function(callback) {
    if (this.state != State.Waiting) throw new Error('Worker is busy ' + this.id);

    this.state = State.Checking;

    this.socket.on('data', (data) => {
        callback();
    });

    this.socket.write(String(Command.Health_Check));
};


module.exports = { Worker, Command, State };