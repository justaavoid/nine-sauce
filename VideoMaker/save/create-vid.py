from moviepy.editor import ImageClip, concatenate_videoclips
import numpy as np

# Define a function to rotate the image clip by a given angle
def rotate_image(image_clip, angle):
    # Get the image as a numpy array
    img = image_clip.get_frame(0)
    # Rotate the image array
    rotated_img = np.rot90(img, k=int(angle / 90))
    # Create a new ImageClip from the rotated image array
    return ImageClip(rotated_img, duration=image_clip.duration)

# Replace 'image_path' with the path to your image
image_path = 'C:/Users/dvtung/Documents/hello-world/Proj/VideoMaker/create-vid/sauce/1.PNG'

# Load the image clip
image_clip = ImageClip(image_path, duration=1)

# List to store rotated clips
rotated_clips = []

# Rotate the image by 90 degrees every second for 40 seconds
for t in range(0, 40):
    rotated_clip = rotate_image(image_clip.copy(), (t % 4) * 90)
    rotated_clips.append(rotated_clip)

# Create the final video clip by concatenating the rotated clips
final_clip = concatenate_videoclips(rotated_clips)

# Replace 'output_path' with the desired path for the output video
output_path = 'output.mp4'

# Write the final video clip to a file
final_clip.write_videofile(output_path, fps=24)  # Adjust the FPS as needed
