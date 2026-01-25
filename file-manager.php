<?php
/**
 * ASCEND - Premium File Manager
 * A secure, single-file control panel for file management.
 */

session_start();

// --- CONFIGURATION ---
$PASSWORD = "ASCEND2025"; // Change this to your desired password
$UPLOAD_DIR = "uploads/";   // The directory where files will be stored
$BLOCKED_EXTENSIONS = ['php', 'php5', 'phtml', 'html', 'htm', 'js', 'exe', 'sh'];

// Create directory if it doesn't exist
if (!is_dir($UPLOAD_DIR)) {
    mkdir($UPLOAD_DIR, 0755, true);
}

// --- LOGOUT LOGIC ---
if (isset($_GET['logout'])) {
    session_destroy();
    header("Location: " . $_SERVER['PHP_SELF']);
    exit;
}

// --- LOGIN LOGIC ---
$error = "";
if (isset($_POST['login_password'])) {
    if ($_POST['login_password'] === $PASSWORD) {
        $_SESSION['authenticated'] = true;
    } else {
        $error = "Access Denied: Incorrect Password";
    }
}

$isAuthenticated = isset($_SESSION['authenticated']) && $_SESSION['authenticated'] === true;

// --- FILE ACTIONS (ONLY IF AUTHENTICATED) ---
if ($isAuthenticated) {
    // 1. Handle Deletion
    if (isset($_GET['delete'])) {
        $fileToDelete = basename($_GET['delete']); // Security: basename prevents path traversal
        $filePath = $UPLOAD_DIR . $fileToDelete;
        if (file_exists($filePath) && is_file($filePath)) {
            unlink($filePath);
            $_SESSION['msg'] = "File '$fileToDelete' deleted successfully.";
        }
        header("Location: " . $_SERVER['PHP_SELF']);
        exit;
    }

    // 2. Handle Upload
    if (isset($_FILES['file_upload'])) {
        $file = $_FILES['file_upload'];
        $fileName = basename($file['name']);
        $ext = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        if (in_array($ext, $BLOCKED_EXTENSIONS)) {
            $_SESSION['msg'] = "Error: File type .$ext is blocked for security.";
        } elseif ($file['error'] === UPLOAD_ERR_OK) {
            if (move_uploaded_file($file['tmp_name'], $UPLOAD_DIR . $fileName)) {
                $_SESSION['msg'] = "File '$fileName' uploaded successfully.";
            } else {
                $_SESSION['msg'] = "Error: Failed to move uploaded file.";
            }
        }
        header("Location: " . $_SERVER['PHP_SELF']);
        exit;
    }
}

// Helper: Format bytes to human-readable
function formatSize($bytes) {
    if ($bytes >= 1073741824) return number_format($bytes / 1073741824, 2) . ' GB';
    if ($bytes >= 1048576) return number_format($bytes / 1048576, 2) . ' MB';
    if ($bytes >= 1024) return number_format($bytes / 1024, 2) . ' KB';
    return $bytes . ' bytes';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ASCEND | File Manager</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #020617; color: #f8fafc; }
        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); }
    </style>
</head>
<body class="p-4 sm:p-8">

    <?php if (!$isAuthenticated): ?>
        <!-- LOGIN UI -->
        <div class="min-h-screen flex items-center justify-center">
            <div class="glass w-full max-w-md p-8 rounded-3xl shadow-2xl">
                <div class="text-center mb-8">
                    <div class="inline-flex items-center gap-1 mb-4">
                        <span class="text-3xl font-black tracking-tighter italic text-white">ASCEND</span>
                        <div class="w-2 h-2 rounded-full bg-[#bef264]"></div>
                    </div>
                    <h1 class="text-xl font-bold text-gray-300">File Control Panel</h1>
                </div>

                <?php if ($error): ?>
                    <div class="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-4 rounded-xl mb-6 flex items-center gap-2">
                        <i data-lucide="alert-circle" class="w-4 h-4"></i> <?php echo $error; ?>
                    </div>
                <?php endif; ?>

                <form method="POST" class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Security Key</label>
                        <input type="password" name="login_password" required autofocus
                               class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#bef264] transition-all">
                    </div>
                    <button type="submit" class="w-full bg-[#bef264] text-[#1e3a8a] font-bold py-3 rounded-xl hover:opacity-90 transition-opacity">
                        Enter Panel
                    </button>
                </form>
            </div>
        </div>
    <?php else: ?>
        <!-- MANAGER UI -->
        <div class="max-w-5xl mx-auto">
            <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-12">
                <div class="flex items-center gap-1">
                    <span class="text-3xl font-black tracking-tighter italic text-white">ASCEND</span>
                    <div class="w-2 h-2 rounded-full bg-[#bef264]"></div>
                    <span class="ml-4 text-xs font-bold text-gray-500 uppercase tracking-[0.3em] mt-1">File Manager</span>
                </div>
                <a href="?logout" class="text-sm font-bold text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                    <i data-lucide="log-out" class="w-4 h-4"></i> Logout
                </a>
            </div>

            <?php if (isset($_SESSION['msg'])): ?>
                <div class="bg-blue-500/10 border border-blue-500/30 text-blue-300 p-4 rounded-2xl mb-8 flex justify-between items-center">
                    <span class="text-sm font-medium"><?php echo $_SESSION['msg']; unset($_SESSION['msg']); ?></span>
                    <button onclick="this.parentElement.remove()" class="opacity-50 hover:opacity-100"><i data-lucide="x" class="w-4 h-4"></i></button>
                </div>
            <?php endif; ?>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <!-- UPLOAD SECTION -->
                <div class="lg:col-span-1">
                    <div class="glass p-6 rounded-3xl sticky top-8">
                        <h2 class="text-lg font-bold mb-6 flex items-center gap-2">
                            <i data-lucide="upload-cloud" class="text-[#bef264]"></i> Upload File
                        </h2>
                        <form method="POST" enctype="multipart/form-data" class="space-y-4">
                            <label class="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors group">
                                <i data-lucide="plus" class="w-8 h-8 text-gray-500 group-hover:text-[#bef264] mb-2 transition-colors"></i>
                                <span class="text-xs font-bold text-gray-500 group-hover:text-gray-300">Choose File</span>
                                <input type="file" name="file_upload" class="hidden" onchange="this.form.submit()">
                            </label>
                            <p class="text-[10px] text-gray-500 text-center uppercase tracking-widest leading-relaxed">
                                Max size: <?php echo ini_get('upload_max_filesize'); ?><br>
                                Scripts (.php, .js) are blocked.
                            </p>
                        </form>
                    </div>
                </div>

                <!-- FILE LIST -->
                <div class="lg:col-span-2">
                    <div class="glass rounded-3xl overflow-hidden shadow-2xl">
                        <table class="w-full text-left">
                            <thead class="bg-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                <tr>
                                    <th class="px-6 py-4">Filename</th>
                                    <th class="px-6 py-4">Size</th>
                                    <th class="px-6 py-4">Modified</th>
                                    <th class="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-white/5">
                                <?php
                                $files = array_diff(scandir($UPLOAD_DIR), array('.', '..'));
                                if (empty($files)): ?>
                                    <tr>
                                        <td colspan="4" class="px-6 py-12 text-center text-gray-500 text-sm italic">
                                            No files found in the upload directory.
                                        </td>
                                    </tr>
                                <?php else:
                                    foreach ($files as $file):
                                        $path = $UPLOAD_DIR . $file;
                                        $size = formatSize(filesize($path));
                                        $date = date("M d, Y H:i", filemtime($path));
                                ?>
                                    <tr class="hover:bg-white/5 transition-colors">
                                        <td class="px-6 py-4">
                                            <div class="flex items-center gap-3">
                                                <i data-lucide="file" class="w-4 h-4 text-gray-400"></i>
                                                <span class="text-sm font-medium text-gray-200 truncate max-w-[150px] sm:max-w-xs" title="<?php echo $file; ?>"><?php echo $file; ?></span>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 text-xs text-gray-400 font-mono"><?php echo $size; ?></td>
                                        <td class="px-6 py-4 text-xs text-gray-500"><?php echo $date; ?></td>
                                        <td class="px-6 py-4 text-right">
                                            <a href="?delete=<?php echo urlencode($file); ?>" 
                                               onclick="return confirm('Permanently delete this file?')"
                                               class="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-400/10 transition-all inline-block">
                                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                                            </a>
                                        </td>
                                    </tr>
                                <?php endforeach; endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    <?php endif; ?>

    <script>
        lucide.createIcons();
    </script>
</body>
</html>