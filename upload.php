<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Directory where images will be saved
$target_dir = "uploads/";

// Create directory if it doesn't exist
if (!file_exists($target_dir)) {
    mkdir($target_dir, 0777, true);
}

// Check if a file was uploaded
if (!isset($_FILES['file'])) {
    echo json_encode(array("success" => false, "message" => "No file uploaded."));
    exit();
}

$file = $_FILES['file'];

// Optional: You can do file type validation here (e.g. check for image/video mime types)

$file_extension = pathinfo($file["name"], PATHINFO_EXTENSION);
// Give the file a completely unique name to avoid overwriting
$new_filename = time() . '_' . uniqid() . '.' . $file_extension;
$target_file = $target_dir . $new_filename;

$response = array();

// Move the file from temp location to your "uploads" folder
if (move_uploaded_file($file["tmp_name"], $target_file)) {
    // Generate the full URL
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
    $host = $_SERVER['HTTP_HOST'];
    
    // The final URL e.g. https://fika-india.com/uploads/1234_abc.jpg
    $url = $protocol . "://" . $host . "/" . $target_file;
    
    $response["success"] = true;
    $response["url"] = $url;
    $response["message"] = "File uploaded successfully.";
} else {
    $response["success"] = false;
    $response["message"] = "Sorry, there was an error moving the uploaded file.";
}

echo json_encode($response);
?>
