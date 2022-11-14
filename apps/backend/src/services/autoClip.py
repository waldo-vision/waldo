"""
auto_clip.py
Usage: python auto_clip.py {Input Folder} {Output Directory} {(Optional) Use Time (0 or 1)}
Takes in an input video file and finds kills based on killfeet
Video file must be 1920 x 1080 @ 60FPS
Video should contin gameplay of Counter Strike: Global Offensive
"""

import cv2
import numpy as np
import sys
import os
import datetime

# global vars
fc = 0

nlines = 0
plines = 0

decCount = 0

pois = []

#  Require 2 options to running program
assert len(sys.argv) >= 3, "needs file input and destination"

inFile = sys.argv[1]
outDir = sys.argv[2]

# Require input file and output directory exist
assert os.path.isfile(inFile), f'input file {inFile} doesn\'t exist'
assert os.path.isdir(outDir), "output directory doesn't exist"

# allow optional flag to save clips in folders named after the time they ocour in the video
useTime = False
if len(sys.argv) > 3 and sys.argv[3].isnumeric() and int(sys.argv[3]) > 0:
    useTime = True

print(f'Input File: {inFile}')
print(f'Output Dir: {outDir}')
print("")



# Creating a VideoCapture object to read the video
cap = cv2.VideoCapture(inFile)

# make sure video is the correct frame rate
framRate = cap.get(cv2.CAP_PROP_FPS)
assert int(framRate) == 60, "Video must be 60FPS"

print(framRate)

showParse = False


# count the number of red lines found in a portion of an image
# input image must be 3 pixles wide and in BGR format
def countLines(im):
    assert im.shape[1] == 3

    streak = 0
    breakS = 0
    lineC = 0

    # for each horizontal line
    for y in range(im.shape[0]):
        # if 2 pixels in a row are incorrect
        if breakS >= 2:
            breakS = 0

            # increment line count if there were enough pixles in a row
            if streak > 15:
                lineC += 1
            streak = 0

        # check if pixel to left is the same color
        # Used to check for deaths because the are a solid color and not an outlined box
        if abs(int(im[y,1,2]) - int(im[y,0,2])) < 20:
            breakS += 1
            continue

        # check if the pixel is roughly the correct color of red
        if im[y,1,2] > 150 and im[y,1,1] < 10 and im[y,1,0] < 50:
            streak += 1
            breakS = 0

        # if wrong color cont count towards streak
        else:
            breakS += 1


    # Add a line to the count if the loop ends saying there is a streak
    if breakS > 15:
        lineC += 1

    return lineC




# Loop until the end of the video
while (cap.isOpened()):

	# Capture frame-by-frame
    ret, frame = cap.read()

    if frame is None:
        break


    # view = cv2.resize(view, (1280, 720), fx = 0, fy = 0, interpolation = cv2.INTER_CUBIC)

    # area of video to analyze must be 3 pixels wide
    # this area is the right edge of the kill feed
    frame_crop = frame[70:300, 1907:1910]


    # count the number of kill feed edges
    nlines = countLines(frame_crop)

    # Display kills to user
    print(f'Kills on Screen: {nlines}, Kills Counted: {len(pois)}\t\t\r', end='', flush=True)



    decCount += 1

    # check curent number of lines vs previous frames number of lines
    if nlines < plines:
        # keep track of the last time the number of edges decreased
        decCount = 0

    # if number of lines has increased add frame number to list to save later
    if nlines > plines and decCount > 10:
        # print("Increase")
        pois.append(fc)

    plines = nlines


    # shown to user
    view = cv2.resize(frame, (1280, 720), fx = 0, fy = 0, interpolation = cv2.INTER_CUBIC)
    # view = cv2.putText(view, f'Kills Counted: {len(pois)}', (822, 700), cv2.FONT_HERSHEY_COMPLEX, 1, (255,255,255), 1, cv2.LINE_AA)
    # view = cv2.putText(view, f'Kills Counted: {len(pois)}', (818, 700), cv2.FONT_HERSHEY_COMPLEX, 1, (255,255,255), 1, cv2.LINE_AA)
    view = cv2.putText(view, f'Kills Counted: {len(pois)}', (530, 450), cv2.FONT_HERSHEY_COMPLEX, 0.75, (0,0,255), 1, cv2.LINE_AA)

    if showParse:
        parseView = view.copy()
        parseView[parseView[:,:,2] <= 110 ] = [0,0,0]
        parseView[parseView[:,:,1] >= 20 ] = [0,0,0]
        parseView[parseView[:,:,0] >= 40 ] = [0,0,0]
        cv2.imshow('Parser Vision', parseView)


	# Display the frames to user
    # cv2.imshow('Area or Intrest', frame)

    cv2.imshow('Normal Gameplay', view)






	# define q as the exit button
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break


    fc += 1



# release the video capture object
cap.release()
# Closes all the windows currently opened.
cv2.destroyAllWindows()


# prints for refrence
print("\n")
print(pois)
print(f'\n----------\nSaving {len(pois)} Clip{"s" if len(pois) != 1 else ""}')



# how to save a frame modified from video_to_photos
# only works with 1920x1080 video
def save_frames(file_name, out_dir, start=0, end=-1):
    cap = cv2.VideoCapture(file_name)

    assert cap, "path to file must be valid"

    if not os.path.exists(out_dir):
            os.makedirs(out_dir)


    if end == -1:
        end = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    cap.set(cv2.CAP_PROP_POS_FRAMES, start)

    for fno in range(start, end):
        success, frame = cap.read()
        assert success, "frame not read correctly"

        frame = frame[428:652, 848:1072]

        name = os.path.join(os.getcwd(), out_dir, "frame" + str(fno + 1) + ".png")
        cv2.imwrite(name, frame)


    cap.release()


# get folder names in outdir
subfolders = [ f.name for f in os.scandir(outDir) if f.is_dir() ]
max = 0

if not useTime:
    # make new folder name larger than any folder in curent directory
    for folder in subfolders:
        if folder.isnumeric() and int(folder) >= max:
            max = int(folder) + 1



# save all clips found earlier
for x in range(len(pois)):
    assert pois[x] >= 55

    print(f'Saving Clip {x + 1}\t\r', end='', flush=True)

    # save folder based on time clip is in respective video
    # using this name scheme may result in duplicate folder names across multiple different videos
    # useful for saving info to tell to user
    if useTime:
        s = pois[x] / 60
        time = datetime.timedelta(seconds = s)
        # print(time)
        save_frames(inFile, os.path.join(outDir, str(time).replace(":", "_")), pois[x] - 55, pois[x] + 5)

    # save folder name based on other folders in dir
    else:
        save_frames(inFile, os.path.join(outDir , str(max + x)), pois[x] - 55, pois[x] + 5)

print("All Clips Saved!\t\t\t\t")