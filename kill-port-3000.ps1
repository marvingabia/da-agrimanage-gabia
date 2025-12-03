# Kill any process using port 3000
Write-Host "🔍 Checking for processes on port 3000..." -ForegroundColor Cyan

$process = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue

if ($process) {
    $pid = $process.OwningProcess
    Write-Host "⚠️  Found process using port 3000 (PID: $pid)" -ForegroundColor Yellow
    Write-Host "🔪 Killing process..." -ForegroundColor Red
    Stop-Process -Id $pid -Force
    Write-Host "✅ Port 3000 is now free!" -ForegroundColor Green
} else {
    Write-Host "✅ Port 3000 is already free!" -ForegroundColor Green
}

Write-Host ""
Write-Host "You can now run: npm start or npm run xian" -ForegroundColor Cyan
