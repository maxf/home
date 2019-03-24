# mihome_energy_monitor.py  28/05/2016  D.J.Whale
#
# A simple demo of monitoring and logging energy usage of mihome devices
#
# Logs all messages to screen and to a file energenie.csv
# Any device that has a switch, it toggles it every 2 seconds.
# Any device that offers a power reading, it displays it.

import energenie
import time
import json
import requests


APP_DELAY    = 2
switch_state = False

def energy_monitor_loop():
    global switch_state

    # Process any received messages from the real radio
    energenie.loop()

    time.sleep(APP_DELAY)


if __name__ == "__main__":

    print("Starting energy monitor example")

    energenie.init()

    # provide a default incoming message handler, useful for logging every message
    def incoming(address, message):
#        print("\nIncoming from %s" % str(address))
	payload = json.dumps(message.pydict)
        try:
            print("pinging")
            print(payload)
            r = requests.post('http://192.168.0.5:1337/ping', data=payload)
            if r.status_code != 200:
                print("Error! Server responded with an error: "+str(r.status_code))

        except requests.exceptions.ConnectionError:
            print("Error sending data to server")

    energenie.fsk_router.when_incoming(incoming)

    try:
        while True:
            energy_monitor_loop()
    finally:
        energenie.finished()

# END
