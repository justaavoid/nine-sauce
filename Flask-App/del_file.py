# import os

# root_directory = "home/justaavoid"


# # Hàm kiểm tra một tệp tin có phải là ảnh không
# def is_image(file_path):
#     image_extensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"]
#     _, file_extension = os.path.splitext(file_path)
#     return file_extension.lower() in image_extensions


# # Hàm kiểm tra một tệp tin có phải là video không
# def is_video(file_path):
#     video_extensions = [".mp4", ".avi", ".mov", ".wmv", ".mkv"]
#     _, file_extension = os.path.splitext(file_path)
#     return file_extension.lower() in video_extensions


# # Hàm xóa các tệp tin là ảnh trong thư mục gốc
# def delete_all_images_in_root():
#     for root, _, files in os.walk(root_directory):
#         for file in files:
#             file_path = os.path.join(root, file)
#             if is_image(file_path):
#                 os.remove(file_path)


# # Hàm xóa các tệp tin là video trong thư mục gốc
# def delete_all_videos_in_root():
#     for root, _, files in os.walk(root_directory):
#         for file in files:
#             file_path = os.path.join(root, file)
#             if is_video(file_path):
#                 os.remove(file_path)


# def delete_file_in_root():
#     delete_all_images_in_root()
#     delete_all_videos_in_root()


# def delete_file_in_folder(UPLOAD_FOLDER, OUTPUT_FOLDER):

#     # Xóa toàn bộ nội dung trong thư mục uploads
#     for file_name in os.listdir(UPLOAD_FOLDER):
#         file_path = os.path.join(UPLOAD_FOLDER, file_name)
#         try:
#             if os.path.isfile(file_path):
#                 os.unlink(file_path)
#         except Exception as e:
#             print("Failed to delete", file_path, ":", e)

#     # Xóa toàn bộ nội dung trong thư mục output
#     for file_name in os.listdir(OUTPUT_FOLDER):
#         file_path = os.path.join(OUTPUT_FOLDER, file_name)
#         try:
#             if os.path.isfile(file_path):
#                 os.unlink(file_path)
#         except Exception as e:
#             print("Failed to delete", file_path, ":", e)


# def delFile(UPLOAD_FOLDER, OUTPUT_FOLDER):
#     delete_file_in_root()
#     delete_file_in_folder(UPLOAD_FOLDER, OUTPUT_FOLDER)
