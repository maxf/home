from flask import Flask
import energenie

app = Flask(__name__)
devices = energenie.registry.devices()


@app.route('/switch/<id>')
def get_switch_state(id):
    try:
        switch_id = int(id)
        print("getting state for switch %d" % int(id))
    except ValueError:
        return "failed to convert switch id '%s' into integer" % id, 400
    device = devices[switch_id]
    if device.has_switch():
        print(device.get_switch())
    else:
        return "Device '%s' does not have a switch" % id, 400

@app.route('/set_switch/<id>/<state>')
def set_switch_state(id, state):
    try:
        switch_id = int(id)
        return "getting state for switch %d" % int(id)
    except ValueError:
        return "failed to convert switch id '%s' into integer" % id, 400
    device = devices[switch_id]
    if device.has_switch():
        device.set_switch(state == 'on')
        print(device.get_switch())
    else:
        return "Device '%s' does not have a switch" % id, 400
