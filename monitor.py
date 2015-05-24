import subprocess as sub
import os
from datetime import datetime

imagename="image"
diff_threshold=30
debug=1

def log(message):
  if (debug):
    print(message)

def go(iso_datetime):
  try:
    sub.call(['cp', imagename+'.jpg', imagename+'-prev.jpg'])
  except OSError:
    pass
  take_picture()
#  log("checking diff")
  diff = sub.check_output(['compare', '-metric', 'PSNR', imagename+'.jpg',
                           imagename+'-prev.jpg', 'diff.jpg'],
                           stderr = sub.STDOUT)
#  log("diff: "+diff)
  if float(diff) < diff_threshold:
    log("Alert! "+diff+" at "+iso_datetime)
    sub.call(['cp', imagename+'.jpg', imagename+iso_datetime+'---'+str(float(diff))+'.jpg'])

def take_picture():
#  log("taking picture")
  sub.call(['raspistill', '-o', imagename+'.jpg'])


log('= Start ======= ' + str(datetime.now()))

while 1==1:
  iso_datetime = datetime.now().isoformat()

  take_picture()
#  log('======== ' + iso_datetime)
  go(iso_datetime)
