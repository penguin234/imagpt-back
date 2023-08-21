import socket
from model import Proceed

HOST = '3.113.1.111'
PORT = 5200

Health_Check = 1
Do_Job = 2
Graceful_Close = 3

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect((HOST, PORT))
    while True:
        command = s.recv(2).decode()
        command = int(command)
        if command == Health_Check:
            s.sendall(b'0')
        elif command == Do_Job:
            data = s.recv(1024).decode()
            image, question = data.split('\n')
            res = Proceed(image, question)
            s.sendall(res.encode())
        elif command == Graceful_Close:
            break