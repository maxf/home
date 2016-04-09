import subprocess as sub
import os
from datetime import datetime
import time

imagename="image"
image_dir='server/assets/images/'
diff_threshold=30
verbosity=2

def log(message, importance):
  if (verbosity <= importance):
    print(message)

def go(iso_datetime):
  try:
    sub.call(['cp', imagename+'.jpg', imagename+'-prev.jpg'])
  except OSError:
    pass
  take_picture()
  log("checking diff", 1)
  diff = sub.check_output(['compare', '-metric', 'PSNR', imagename+'.jpg',
                           imagename+'-prev.jpg', 'diff.jpg'],
                           stderr = sub.STDOUT)
  log("diff: "+diff, 1)
  if float(diff) < diff_threshold:
    log("Alert! "+diff+" at "+iso_datetime, 2)
    sub.call(['cp', imagename+'.jpg', image_dir+imagename+iso_datetime+'---'+str(float(diff))+'.jpg'])

def take_picture():
  log("taking picture", 1)
  sub.call(['raspistill', '-md', '4', '-t', '1', '-n', '-o', imagename+'.jpg'])
  sub.call(['cp', imagename+'.jpg', image_dir+imagename+'.jpg'])


log('= Start ======= ' + str(datetime.now()), 2)

while 1==1:
  iso_datetime = datetime.now().isoformat()

  take_picture()
  time.sleep(1)
  log('======== ' + iso_datetime, 1)
  go(iso_datetime)
