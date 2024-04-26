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
    part_clips.append(part_clip)

# Reshape the list of clips to form a square pattern
rows = 3
cols = 3

# Pad the list with None if the number of clips is less than rows * cols
while len(part_clips) < rows * cols:
    part_clips.append(None)

# Replace None values with an ImageClip
image_path = r'C:\Users\dvtung\Documents\hello-world\Proj\VideoMaker\create-vid\sauce\1.PNG'
empty_clip = ImageClip(image_path, duration=part_duration)

for i in range(len(part_clips)):
    if part_clips[i] is None:
        part_clips[i] = empty_clip

# Create a single video where each part appears in its own designated space
final_clip = clips_array([[part_clips.pop(0) for _ in range(cols)] for _ in range(rows)])

# Replace 'output_path' with the desired path for the output video
output_path = 'output-merge.mp4'

# Write the final video clip to a file
final_clip.write_videofile(output_path, fps=input_clip.fps)
