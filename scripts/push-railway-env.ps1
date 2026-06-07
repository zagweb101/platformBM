param(
  [string]$ProjectUrl = "https://platformbm-production.up.railway.app"
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root

function Read-DotEnv($path) {
  $vars = @{}
  if (-not (Test-Path $path)) { return $vars }
  Get-Content $path | ForEach-Object {
    $line = $_.Trim()
    if ($line -eq "" -or $line.StartsWith("#")) { return }
    if ($line -match '^([A-Za-z_][A-Za-z0-9_]*)=(.*)$') {
      $key = $matches[1]
      $val = $matches[2].Trim('"').Trim("'")
      if ($val -ne "") { $vars[$key] = $val }
    }
  }
  return $vars
}

Write-Host "`n=== Railway Environment Sync ===" -ForegroundColor Cyan

$whoami = npx @railway/cli whoami 2>&1
if ($LASTEXITCODE -ne 0) {
  Write-Host "Not logged in to Railway. Run:" -ForegroundColor Yellow
  Write-Host "  npx @railway/cli login" -ForegroundColor White
  Write-Host "  npx @railway/cli link" -ForegroundColor White
  exit 1
}

$merged = Read-DotEnv ".env"
$prod = Read-DotEnv ".env.production"
foreach ($k in $prod.Keys) { $merged[$k] = $prod[$k] }

if (-not $merged["NEXTAUTH_URL"]) {
  $merged["NEXTAUTH_URL"] = $ProjectUrl
}

$skip = @("UPLOADTHING_TOKEN")
$set = 0
foreach ($entry in $merged.GetEnumerator() | Sort-Object Name) {
  if ($skip -contains $entry.Key) { continue }
  $val = $entry.Value -replace '"', '\"'
  Write-Host "  Setting $($entry.Key)..." -ForegroundColor Gray
  npx @railway/cli variables set "$($entry.Key)=$($entry.Value)" 2>&1 | Out-Null
  if ($LASTEXITCODE -eq 0) { $set++ }
}

Write-Host "`nDone: $set variables pushed to Railway." -ForegroundColor Green
Write-Host "Run: npx tsx scripts/check-env.ts (after pulling vars locally)`n"
