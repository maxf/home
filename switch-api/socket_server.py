from flask import Flask
import energenie
import sys


app = Flask(__name__)
me_global = sys.modules[__name__]


@app.route('/switch/<id>')
def get_switch_state(id):
    device = getattr(me_global, 'switch_' + id)
    print("device")
    print(device)
    print(device.has_switch())
    if device.has_switch():
        return str(device.get_power())
    else:
        return "Device '%s' does not have a switch" % id, 400

@app.route('/set_switch/<id>/<state>')
def set_switch_state(id, state):
    device = getattr(me_global, 'switch_' + id)
    if device.has_switch():
        device.set_switch(state == 'on')
        return str(device.get_switch())
    else:
        return "Device '%s' does not have a switch" % id, 400


if __name__ == "__main__":

    energenie.init()

    # Load all devices into variables auto created in the global scope
    # You can pass any context here, such as a class to contain your devices
    energenie.registry.load_into(me_global)

    print("-----")
    print(getattr(me_global, 'switch_0'))
    print("-----")

    app.run()

