import RPi.GPIO as GPIO
import time
import picamera
import datetime
import sys
import os

media_directory = 'home-server/public/images/media'
def get_file_name():
    return media_directory + '/' + datetime.datetime.now().strftime("%Y-%m-%d_%H.%M.%S")

sensor = 4

try:
    os.mkdir(media_directory)
except OSError:
    pass

GPIO.setmode(GPIO.BCM)
GPIO.setup(sensor, GPIO.IN, GPIO.PUD_DOWN)

previous_state = False
current_state = False

with picamera.PiCamera() as cam:
    print("Starting at " + str(datetime.datetime.now()))
    while True:
        time.sleep(0.1)
        previous_state = current_state
        current_state = GPIO.input(sensor)
        if current_state != previous_state:
            new_state = "HIGH" if current_state else "LOW"
            print("GPIO pin %s is %s" % (sensor, new_state))
            if current_state:
                fileName = get_file_name()
#                cam.capture(fileName+'.jpg')
                print("starting recording at "+fileName)
                cam.start_recording(fileName + '.h264')
                time.sleep(30)
                cam.stop_recording()
                print("stopped recording "+fileName)
                print("converting to mp4")
                os.system("MP4Box -fps 30 -add %s.h264 %s.mp4" % (fileName, fileName))
                os.remove(fileName + '.h264')
                print("\a") # ring bell in terminal
