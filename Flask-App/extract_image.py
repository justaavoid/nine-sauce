import os
from moviepy.editor import VideoFileClip, clips_array, ImageClip  # type: ignore
import numpy as np  # type: ignore
from PIL import Image  # type: ignore
import cv2  # type: ignore
import io  # type: ignore

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "output"

def process_extract_image(request):
    video_file = request.files.get("video")
    if not video_file:
        return "No video file uploaded", 400

    upload_folder = UPLOAD_FOLDER
    video_path = os.path.join(upload_folder, video_file.filename)
    video_file.save(video_path)

    # Extract 9 frames from the video
    frames = extract_frames(video_path, 9)
    if len(frames) < 9:
        return "Could not extract 9 frames from the video", 400

    # Crop frames to 1:1 ratio
    cropped_frames = [crop_to_square(frame) for frame in frames]

    # Convert frames to PIL images
    pil_images = [Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)) for frame in cropped_frames]

    # Resize images to the same size
    size = min(pil_images[0].size)
    pil_images = [img.resize((size, size), Image.Resampling.LANCZOS) for img in pil_images]

    # Merge images into one square image
    merged_image = merge_images(pil_images)

    # Save the result to a BytesIO object
    img_io = io.BytesIO()
    merged_image.save(img_io, 'JPEG')
    img_io.seek(0)

    return img_io

def merge_images(images):
    num_images = len(images)
    sqrt_num_images = int(np.sqrt(num_images))
    assert sqrt_num_images * sqrt_num_images == num_images, "Number of images must be a perfect square"

    img_size = images[0].size[0]
    merged_image = Image.new('RGB', (img_size * sqrt_num_images, img_size * sqrt_num_images))

    for idx, img in enumerate(images):
        row = idx // sqrt_num_images
        col = idx % sqrt_num_images
        merged_image.paste(img, (col * img_size, row * img_size))

    return merged_image

def crop_to_square(image):
    h, w, _ = image.shape
    min_dim = min(h, w)
    top = (h - min_dim) // 2
    left = (w - min_dim) // 2
    return image[top:top+min_dim, left:left+min_dim]

# def extract_frames(video_path, num_frames):
#     cap = cv2.VideoCapture(video_path)
#     total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
#     fps = cap.get(cv2.CAP_PROP_FPS)
#     duration = total_frames / fps

#     intervals = np.linspace(0, duration, num_frames, endpoint=True)
#     frames = []

#     for idx, t in enumerate(intervals):
#         cap.set(cv2.CAP_PROP_POS_MSEC, t * 100)
#         success, frame = cap.read()
#         if not success:
#             continue
#         frames.append(frame)
#         print(f"img{idx+1}: time extract: {t:.4f}s")

#     cap.release()
#     return frames

def extract_frames(video_path, num_frames):
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS)

    if total_frames < 1:
        return []

    # Calculate the frame positions
    frame_positions = np.linspace(0, total_frames - 1, num_frames, dtype=int)

    frames = []
    for idx, pos in enumerate(frame_positions):
        cap.set(cv2.CAP_PROP_POS_FRAMES, pos)  # Set frame position
        success, frame = cap.read()
        if not success:
            continue
        frames.append(frame)
        time_extract = pos / fps

    cap.release()
    return frames
