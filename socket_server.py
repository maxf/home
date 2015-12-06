from wsgiref.simple_server import make_server
import RPi.GPIO as GPIO
import time
import re

def init():
	# set the pins numbering mode
	GPIO.setmode(GPIO.BOARD)

	# Select the GPIO pins used for the encoder K0-K3 data inputs
	GPIO.setup(11, GPIO.OUT)
	GPIO.setup(15, GPIO.OUT)
	GPIO.setup(16, GPIO.OUT)
	GPIO.setup(13, GPIO.OUT)

	# Select the signal used to select ASK/FSK
	GPIO.setup(18, GPIO.OUT)

	# Select the signal used to enable/disable the modulator
	GPIO.setup(22, GPIO.OUT)

	# Disable the modulator by setting CE pin lo
	GPIO.output (22, False)

	# Set the modulator to ASK for On Off Keying 
	# by setting MODSEL pin lo
	GPIO.output (18, False)

	# Initialise K0-K3 inputs of the encoder to 0000
	GPIO.output (11, False)
	GPIO.output (15, False)
	GPIO.output (16, False)
	GPIO.output (13, False)

def modulate():
	# let it settle, encoder requires this
	time.sleep(0.1)	
	# Enable the modulator
	GPIO.output (22, True)
	# keep enabled for a period
	time.sleep(0.25)
	# Disable the modulator
	GPIO.output (22, False)


def send_code(a,b,c,d):
#	print('Printing code %d%d%d%d' % (a,b,c,d))
	GPIO.output(11, True if a == 1 else False)
	GPIO.output(15, True if b == 1 else False)
	GPIO.output(16, True if c == 1 else False)
	GPIO.output(13, True if d == 1 else False)
	modulate()

def switch_on(id = None):
	if id == 1:
		send_code(1,1,1,1)
	elif id == 2:
		send_code(0,1,1,1)
	elif id == 3:
		send_code(1,0,1,1)
	elif id == 4:
		send_code(0,0,1,1)
	else:
		send_code(1,1,0,1)

def switch_off(id = None):
	if id == 1:
		send_code(1,1,1,0)
	elif id == 2:
		send_code(1,1,1,0)
	elif id == 3:
		send_code(1,0,1,0)
	elif id == 4:
		send_code(0,1,0,0)
	else:
		send_code(1,1,0,0)


def server(environ, start_response):

    status = '200 OK'
    headers = [('Content-type', 'text/plain')]
    start_response(status, headers)
    path = environ['PATH_INFO']

    [dummy, switch_number, on_off] = re.split('/', path)

#    print('switching %s to %s' % (switch_number, on_off))

    if on_off == 'on':
        switch_on(int(switch_number))
    else:
	switch_off(int(switch_number))
    return str(switch_number) + ': ' + on_off + '\n'

try:
    init()
    httpd = make_server('', 8000, server)
    print "Serving on port 8000..."
    httpd.serve_forever()
except KeyboardInterrupt:
    print("Stopped. Cleaning up and exiting.")
except:
    print("Something bad happened. Cleaning up and exiting")
finally:
    GPIO.cleanup()

