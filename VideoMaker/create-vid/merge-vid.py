from moviepy.editor import VideoFileClip, clips_array, ImageClip
import numpy as np

# Replace 'input_video_path' with the path to your input video
input_video_path = r'C:\Users\dvtung\Documents\hello-world\Proj\VideoMaker\create-vid\output.mp4'

# Load the input video
input_clip = VideoFileClip(input_video_path)

# Calculate the duration of each part
num_parts = 8
part_duration = input_clip.duration / num_parts

# List to store the extracted video clips
part_clips = []

# Extract each part of the video
for i in range(num_parts):
    start_time = i * part_duration
    end_time = (i + 1) * part_duration
    part_clip = input_clip.subclip(start_time, end_time)
    if i == 4:
        part_clips.append(None)
    part_clips.append(part_clip)

# Reshape the list of clips to form a square pattern
rows = 3
cols = 3

# Pad the list with None if the number of clips is less than rows * cols
while len(part_clips) < rows * cols:
    part_clips.append(None)

# Replace None values with an ImageClip
image_path = r'C:\Users\dvtung\Documents\hello-world\Proj\VideoMaker\create-vid\sauce\1.PNG'
empty_duration = part_duration
image_clip = ImageClip(image_path, duration=empty_duration)

# Calculate the dimensions of the empty space
empty_width = image_clip.size[0] * cols
empty_height = image_clip.size[1] * rows

# Calculate the position of the image clip in the empty space
x_offset = (empty_width - image_clip.w) // 2
y_offset = (empty_height - image_clip.h) // 2

# Place the image in the middle of the empty space
image_position = (x_offset, y_offset)
image_clip = image_clip.set_position(image_position)

# Replace None values with the image clip in the list of clips
for i in range(len(part_clips)):
    if part_clips[i] is None:
        part_clips[i] = image_clip

# Create a single video where each part appears in its own designated space
final_clip = clips_array([[part_clips.pop(0) for _ in range(cols)] for _ in range(rows)])

# Replace 'output_path' with the desired path for the output video
output_path = 'output-merge.mp4'

# Write the final video clip to a file
final_clip.write_videofile(output_path, fps=input_clip.fps)
