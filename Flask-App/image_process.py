import qrcode
from io import BytesIO
from PIL import Image
import os
import tempfile


# Hàm để cắt hình ảnh thành hình vuông từ trung tâm
def crop_to_square(image):
    width, height = image.size
    min_dimension = min(width, height)
    left = (width - min_dimension) / 2
    top = (height - min_dimension) / 2
    right = (width + min_dimension) / 2
    bottom = (height + min_dimension) / 2
    return image.crop((left, top, right, bottom))


def generate_qr_code(link):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(link)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    # Save the QR code to an in-memory buffer
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)
    return buffer


from PIL import Image
from io import BytesIO

def merge_images(image_files, qr_code_buffer):
    # Create temporary files to store the images
    temp_files = []
    for image in image_files:
        temp_file = tempfile.NamedTemporaryFile(delete=False)
        temp_files.append(temp_file)
        
        # Convert the image to RGB mode if it's not already
        if image.mode != "RGB":
            image = image.convert("RGB")
        
        # Save the image to the temporary file
        image.save(temp_file, format="JPEG")

    # Open temporary files as file-like objects
    image_data = [open(temp_file.name, "rb") for temp_file in temp_files]

    # Read the image data and create Image objects
    images = [Image.open(data) for data in image_data]

    # Sử dụng hàm crop_to_square để cắt hình vuông từ trung tâm của mỗi ảnh
    cropped_images = [crop_to_square(image) for image in images]
    # Sử dụng hàm resize để thay đổi kích thước các ảnh cắt vuông
    target_size = (1024, 1024)
    resized_images = [image.resize(target_size) for image in cropped_images]

    # Đọc ảnh QR code từ buffer và resize
    qr_code_image = Image.open(BytesIO(qr_code_buffer.read()))
    resized_qr_code = qr_code_image.resize(target_size)

    # Merge ảnh và ảnh QR code
    result_image = Image.new("RGB", (target_size[0] * 3, target_size[1] * 3))
    # Sửa danh sách vị trí để chèn ảnh mã QR vào vị trí thứ 5
    position = [
        (0, 0),
        (target_size[0], 0),
        (2 * target_size[0], 0),
        (0, target_size[1]),
        (target_size[0], target_size[1]),  # Vị trí thứ 5
        (2 * target_size[0], target_size[1]),
        (0, 2 * target_size[1]),
        (target_size[0], 2 * target_size[1]),
        (2 * target_size[0], 2 * target_size[1]),
    ]

    # Chèn các ảnh khác vào các vị trí khác trong danh sách vị trí
    image_index = 0  # Biến lặp mới để duyệt qua resized_images
    for i in range(len(position)):
        if i == 4:  # Nếu đến vị trí thứ 5, chèn ảnh mã QR vào đây
            result_image.paste(resized_qr_code, position[i])
        else:
            # Nếu không đủ ảnh, lặp lại ảnh từ đầu
            if image_index >= len(cropped_images):
                image_index = 0
            # Chèn ảnh từ resized_images vào vị trí tương ứng trong danh sách position
            result_image.paste(resized_images[image_index], position[i])
            image_index += 1

    # Save the result image to an in-memory buffer
    output_buffer = BytesIO()
    result_image.save(output_buffer, format="JPEG")
    output_buffer.seek(0)

    # Close and remove temporary files
    for temp_file in temp_files:
        temp_file.close()
        os.unlink(temp_file.name)

    # Return the result image
    return result_image


def process_images(image_files, link):
    # Create a directory for in-memory output
    output_dir = BytesIO()

    # Generate QR code and get the in-memory buffer
    qr_code_buffer = generate_qr_code(link)

    # Merge images and save the result to the in-memory buffer
    merge_images(image_files, qr_code_buffer)

    return output_dir
