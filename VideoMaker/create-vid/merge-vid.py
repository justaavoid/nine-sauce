from moviepy.editor import VideoFileClip, clips_array, ImageClip # type: ignore
from PIL import Image # type: ignore
import qrcode # type: ignore
from io import BytesIO
import numpy as np # type: ignore

# Function to generate QR code image from a link with custom colors
def generate_colored_qr_code(link, background=(255, 255, 255), fill_color=(0, 0, 0)):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(link)
    qr.make(fit=True)

    qr_img = qr.make_image(fill_color=fill_color, back_color=background)
    qr_bytes = BytesIO()
    qr_img.save(qr_bytes, format='PNG')
    qr_bytes.seek(0)

    return qr_bytes

input_video_path = "./sauce/input-vid.mp4"
link = "https://www.example.com"  # Replace with your link

# Load the input video
input_clip = VideoFileClip(input_video_path)

# Generate colored QR code image from the link
background_color = (255, 255, 255)  # White
fill_color = (0, 0, 255)  # Blue
qr_image_bytes = generate_colored_qr_code(link, background=background_color, fill_color=fill_color)

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

empty_duration = part_duration

# Load the QR code image using PIL
qr_image = Image.open(qr_image_bytes)

# Convert the PIL image to a numpy array
qr_image_np = np.array(qr_image)

# Create an ImageClip object from the numpy array
image_clip = ImageClip(qr_image_np, duration=part_duration)

# Calculate the dimensions of the empty space
empty_width = image_clip.size[0] * cols
empty_height = image_clip.size[1] * rows

# Calculate the position of the image clip in the empty space
x_offset = (empty_width - image_clip.w) // 2
y_offset = (empty_height - image_clip.h) // 2

# Place the QR code image in the middle of the empty space
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
