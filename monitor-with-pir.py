import RPi.GPIO as GPIO
import time
import picamera
import datetime
import json
import sys
import os

media_directory = 'home-server/public/images/media'
data_directory = 'home-server/public/data/'
schedule = json.loads(open(data_directory + 'schedule.json').read())
in_hours = False
sensor = 4
previous_state = False
current_state = False

# returns True if the time passed is within one of the time ranges passed
def in_time_ranges(the_time, time_ranges):
    for this_range in time_ranges:
        start_time = datetime.time(int(this_range[0][0:2]), int(this_range[0][3:5]))
        end_time = datetime.time(int(this_range[1][0:2]), int(this_range[1][3:5]))
        if start_time < the_time < end_time:
            return True
    return False

# returns True if the day of the week passed is within on the day ranges passed
def in_weekday_ranges(the_day, day_ranges):
    for day_range in day_ranges:
        if day_range[0] <= the_day <= day_range[1]:
            return True
    return False

# returns True if the datetime passed is within the schedule hours
def in_monitoring_hours(date_time, schedule):
    the_time = date_time.time()
    weekday = date_time.weekday()
    for interval in schedule:
        if interval['type'] == 'hours' and not in_time_ranges(the_time, interval['ranges']):
                return False
        if interval['type'] == 'weekdays' and not in_weekday_ranges(weekday, interval['ranges']):
                return False
    return True

def get_file_name():
    return media_directory + '/' + datetime.datetime.now().strftime("%Y-%m-%d_%H.%M.%S")

def initialise_led(camled, gpio):
    # in order to be able to control the led, /boot/options.txt should include the line:
    # 'disable_camera_led=1'
    gpio.setup(camled, gpio.OUT, initial=False)
    # test by blinking the LED 3 times
    for i in range(3):
        gpio.output(camled, True)
        time.sleep(0.5)
        gpio.output(camled, False)
        time.sleep(0.5)
    
try:
    os.mkdir(media_directory)
except OSError:
    pass

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(sensor, GPIO.IN, GPIO.PUD_DOWN)

with picamera.PiCamera() as cam:
    cam.resolution = (800, 600)
    print("Starting at " + str(datetime.datetime.now()))
    CAMLED=32
    initialise_led(CAMLED, GPIO)

    while True:
        new_in_hours = in_monitoring_hours(datetime.datetime.now(), schedule)
        if in_hours and not new_in_hours:
            print('-----------------------------------')
            print('Leaving in hours at ' + str(datetime.datetime.now()))
            print('-----------------------------------')
            GPIO.output(CAMLED, False)
        if not in_hours and new_in_hours:
            print('-----------------------------------')
            print('Entering in hours at ' + str(datetime.datetime.now()))
            print('-----------------------------------')
            GPIO.output(CAMLED, True)
	in_hours = new_in_hours
        if in_hours:
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
