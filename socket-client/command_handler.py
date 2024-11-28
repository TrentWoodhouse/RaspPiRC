import os

class CommandHandler:
    def __init__(self, sio):
        self.sio = sio
        self.commands = {
            'shutdown': self.__shutdown,
            'reboot': self.__reboot
        }

    def run(self, command, args):
        if command in self.commands:
            return self.commands[command](args)

    def __shutdown(self):
        print('Shutting down...')
        self.sio.disconnect()
        os.system('sudo shutdown -h now')

    def __reboot(self):
        print('Rebooting...')
        self.sio.disconnect()
        os.system('sudo reboot')



