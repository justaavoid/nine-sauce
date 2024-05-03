from flask import request # type: ignore
from moviepy.editor import VideoFileClip, clips_array, ImageClip # type: ignore
import os
import app

UPLOAD_FOLDER = "uploads"

def process_video(request):
    # Get uploaded files
    video_file = request.files.get('video')
    image_file = request.files.get('image')

    # Check if video and image files are present
    if not video_file:
        return "No video file uploaded"
    if not image_file:
        return "No image file uploaded"

    # Save uploaded files to the upload folder
    video_path = os.path.join(app.app.config['UPLOAD_FOLDER'], video_file.filename)
    video_file.save(video_path)

    image_path = os.path.join(app.app.config['UPLOAD_FOLDER'], image_file.filename)
    image_file.save(image_path)

    # Load the input video
    input_clip = VideoFileClip(video_path)

    # Merge video with image
    final_clip = merge_video_with_image(input_clip, image_path)

    # Write the final video clip to a file
    output_path = os.path.join(app.app.config['OUTPUT_FOLDER'], 'output.mp4')
    final_clip.write_videofile(output_path, fps=input_clip.fps)

    # Remove the uploaded files after processing
    os.remove(video_path)
    os.remove(image_path)

    output_filename = 'output.mp4'

    return output_filename

def merge_video_with_image(video_clip, image_path):
    try:
        # Get the duration of the video clip
        duration = video_clip.duration
    except Exception as e:
        return f"Error loading video clip: {e}"

    # Calculate the duration of each part
    num_parts = 8
    part_duration = duration / num_parts

    # List to store the extracted video clips
    part_clips = []

    # Extract each part of the video
    for i in range(num_parts):
        start_time = i * part_duration
        end_time = (i + 1) * part_duration
        part_clip = video_clip.subclip(start_time, end_time)
        if i == 4:
            part_clips.append(None)
        part_clips.append(part_clip)

    # Reshape the list of clips to form a square pattern
    rows = 3
    cols = 3

    # Pad the list with None if the number of clips is less than rows * cols
    while len(part_clips) < rows * cols:
        part_clips.append(None)

    # Load the input image
    image_clip = ImageClip(image_path, duration = part_duration)

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

    return final_clip
