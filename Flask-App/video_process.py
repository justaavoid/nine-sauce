from flask import redirect, url_for
from moviepy.editor import VideoFileClip
import os

UPLOAD_FOLDER = "uploads"


def process_video(request):
    if request.method == "POST":
        video = request.files["video"]

        # Save the uploaded video file to a temporary location
        video_path = os.path.join(UPLOAD_FOLDER, video.filename)
        video.save(video_path)

        # Processing logic for video
        # Example: Create a video clip from the uploaded video
        input_clip = VideoFileClip(video_path)
        # Add your video processing logic here

        # Replace 'output_path' with the desired path for the output video
        output_path = "output-video.mp4"
        input_clip.write_videofile(output_path, fps=input_clip.fps)

        # Remove the temporary files
        os.remove(video_path)

        # Redirect the user to download the generated video
        return redirect(url_for("download", filename=output_path))
