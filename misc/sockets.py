#import the required modules
import RPi.GPIO as GPIO
import time

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

# The On/Off code pairs correspond to the hand controller codes.
# True = '1', False ='0'

#print "0011 and 1011 all ON and OFF"
#print "1111 and 0111 socket 1"
#print "1110 and 0110 socket 2"
#print "1101 and 0101 socket 3"
#print "1100 and 0100 socket 4"

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
	GPIO.output(11, True if a == 1 else False)
	GPIO.output(15, True if b == 1 else False)
	GPIO.output(16, True if c == 1 else False)
	GPIO.output(13, True if d == 1 else False)
	modulate()

try:
	init()
	while True:
  		raw_input('hit return key to send socket 1 ON code')
		send_code(1,1,1,1)
		raw_input('hit return key to send socket 1 OFF code')
		send_code(1,1,1,0)
  		raw_input('hit return key to send socket 2 ON code')
		send_code(0,1,1,1)
		raw_input('hit return key to send socket 2 OFF code')
		send_code(0,1,1,0)
  		raw_input('hit return key to send socket 3 ON code')
		send_code(1,0,1,1)
		raw_input('hit return key to send socket 3 OFF code')
		send_code(1,0,1,0)
  		raw_input('hit return key to send socket 4 ON code')
		send_code(0,0,1,1)
		raw_input('hit return key to send socket 4 OFF code')
		send_code(0,0,1,0)

# Clean up the GPIOs for next time
except KeyboardInterrupt:
	GPIO.cleanup()
