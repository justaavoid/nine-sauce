import qrcode # type: ignore
from PIL import Image # type: ignore
import os


# Hàm để cắt hình ảnh thành hình vuông từ trung tâm
def crop_to_square(image):
    width, height = image.size
    min_dimension = min(width, height)
    left = (width - min_dimension) / 2
    top = (height - min_dimension) / 2
    right = (width + min_dimension) / 2
    bottom = (height + min_dimension) / 2
    return image.crop((left, top, right, bottom))


# Hàm để tạo mã QR từ đường link và lưu ảnh mã QR
def generate_qr_code(link, output_path):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(link)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    img.save(output_path)

def merge_images(image_files, image_path, output_path):
    # Đọc ảnh từ danh sách các file ảnh và resize
    images = [Image.open(image_file) for image_file in image_files]

    # Sử dụng hàm crop_to_square để cắt hình vuông từ trung tâm của mỗi ảnh
    cropped_images = [crop_to_square(image) for image in images]
    # Sử dụng hàm resize để thay đổi kích thước các ảnh cắt vuông
    target_size = (1024, 1024)
    resized_images = [image.resize(target_size) for image in cropped_images]

    # Đọc ảnh QR code từ đường dẫn và resize
    qr_code_image = Image.open(image_path)
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

    result_image.save(output_path)


# Hàm xử lý các ảnh và tạo ảnh kết quả
def process_images(image_files, link, output_dir, image):
    # Tạo thư mục nếu chưa tồn tại
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Tạo và lưu ảnh mã QR nếu có link và không có image
    if link and not image:
        qr_code_path = os.path.join(output_dir, "qr_code.png")
        generate_qr_code(link, qr_code_path)
        image_path = qr_code_path
    # Nếu có image, lưu image và sử dụng image cho quá trình merge
    elif image:
        image_path = os.path.join(output_dir, "user_image.png")
        image.save(image_path)
    else:
        return None

    # Tạo và lưu ảnh kết quả
    output_path = os.path.join(output_dir, "result.jpg")
    merge_images(image_files, image_path, output_path)

    return output_path
