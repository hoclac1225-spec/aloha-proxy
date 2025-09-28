# start-dev.ps1 - Phiên bản tối ưu hoàn chỉnh với log

# --- 1. Chọn port rảnh ---
$startPort = 60600
$port = $startPort
while (netstat -ano | findstr ":$port") {
    $port++
}
Write-Host "Chọn port rảnh: $port"

# --- 2. Thiết lập biến môi trường ---
$env:PORT = $port
$env:HOST = "127.0.0.1"
$env:SHOPIFY_APP_URL = "http://127.0.0.1:$port"
Write-Host "SHOPIFY_APP_URL tạm thời: $env:SHOPIFY_APP_URL"

# --- 3. Xóa build + cache cũ ---
Remove-Item build -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item node_modules/.cache -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "Đã xóa build và cache cũ."

# --- 4. Chạy Remix Dev ở background ---
$remixProcess = Start-Process -FilePath "npx" -ArgumentList "remix dev" -NoNewWindow -PassThru
Write-Host "Đang chạy Remix Dev..."
Start-Sleep -Seconds 5

# --- 5. Chạy ngrok (HTTPS) ---
try {
    $ngrokProcess = Start-Process -FilePath "ngrok" -ArgumentList "http $port --host-header=localhost:$port --log=stdout" -NoNewWindow -PassThru
    Write-Host "Đang chạy ngrok..."
    Start-Sleep -Seconds 5

    # --- 6. Lấy link HTTPS từ ngrok API ---
    $ngrokApi = "http://127.0.0.1:4040/api/tunnels"
    $tunnels = Invoke-RestMethod -Uri $ngrokApi -UseBasicParsing
    $httpsTunnel = $tunnels.tunnels | Where-Object { $_.public_url -like "https://*" }
    if ($httpsTunnel) {
        $ngrokUrl = $httpsTunnel.public_url
        $env:SHOPIFY_APP_URL = $ngrokUrl
        Write-Host "SHOPIFY_APP_URL đã được set thành: $ngrokUrl"
    } else {
        Write-Host "⚠️ Không tìm thấy tunnel HTTPS. Vui lòng kiểm tra ngrok."
    }
} catch {
    Write-Host "⚠️ Lỗi khi chạy ngrok hoặc lấy link: $_"
}

# --- 7. Test endpoint /api/onboard ---
try {
    $testPost = Invoke-RestMethod -Uri "http://127.0.0.1:$port/api/onboard" `
        -Method Post `
        -ContentType "application/json" `
        -Body '{"name":"Test","email":"t@t.com","phone":"0123"}' `
        -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ /api/onboard POST test thành công. Response:"
    Write-Host ($testPost | ConvertTo-Json)
} catch {
    Write-Host "⚠️ /api/onboard POST test thất bại. Lỗi: $_"
}

# --- 8. Thông báo kết thúc ---
Write-Host "Ctrl+C để dừng Remix Dev và ngrok khi cần."
Wait-Process -Id $remixProcess.Id
Wait-Process -Id $ngrokProcess.Id
