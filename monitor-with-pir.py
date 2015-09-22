import RPi.GPIO as GPIO
import time
import picamera
import datetime
import sys
import os

media_directory = 'home-server/public/images/media'

period_1_start_time = datetime.time(9,15)
period_1_end_time = datetime.time(17,30)
period_2_start_time = datetime.time(0,0)
period_2_end_time = datetime.time(7,15)


def get_file_name():
    return media_directory + '/' + datetime.datetime.now().strftime("%Y-%m-%d_%H.%M.%S")

previous_in_hours = 4
def in_hours():
    global previous_in_hours
    now = datetime.datetime.now()
    weekday = now.weekday()
    time = now.time();
    in_hours = weekday != 5 and weekday != 6 and (period_1_start_time < time < period_1_end_time or period_2_start_time < time < period_2_end_time)
    if (not in_hours) and (previous_in_hours == True):
        print("exiting in-hours at " + str(time))
    if in_hours and previous_in_hours == False:
        print("entering in-hours at " + str(time))
    previous_in_hours = in_hours
    return in_hours

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
    cam.resolution = (800, 600)
    print("Starting at " + str(datetime.datetime.now()))
    while True:
        if in_hours():
            time.sleep(0.1)
            previous_state = current_state
            current_state = GPIO.input(sensor)
            if current_state != previous_state:
                new_state = "HIGH" if current_state else "LOW"
                print("GPIO pin %s is %s" % (sensor, new_state))
                if current_state:
                    fileName = get_file_name()
                    print("starting recording at "+fileName)
                    cam.start_recording(fileName + '.h264')
                    cam.wait_recording(10)
                    cam.capture(fileName+'.jpg', use_video_port=True)
                    cam.wait_recording(50)
                    cam.stop_recording()
                    print("stopped recording "+fileName)
                    print("converting to mp4")
                    os.system("MP4Box -fps 30 -add %s.h264 %s.mp4" % (fileName, fileName))
                    os.remove(fileName + '.h264')
                    print("\a") # ring bell in terminal
        else:
#            print("It's " + str(datetime.datetime.now()))
#            print("out of hours")
            time.sleep(300)

