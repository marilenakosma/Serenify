# Serenify Development Automation Scripts

# Function: Start Expo development server
function Start-Serenify {
    [CmdletBinding()]
    param(
        [Parameter()]
        [ValidateSet('default', 'clear', 'tunnel', 'lan')]
        [string]$Mode = 'default'
    )
    
    Write-Host " Starting Expo Development Server..." -ForegroundColor Green
    
    switch ($Mode) {
        'clear' {
            Write-Host "Clearing cache..." -ForegroundColor Yellow
            npm start -- --clear
        }
        'tunnel' {
            Write-Host "Starting with tunnel mode..." -ForegroundColor Yellow
            npm start -- --tunnel
        }
        default {
            npm start
        }
    }
}

# Function: Run on Android emulator/device
function Start-SerenifyAndroid {
    [CmdletBinding()]
    param(
        [Parameter()]
        [switch]$Clean
    )
    
    Write-Host "Starting Serenify on Android..." -ForegroundColor Cyan
    
    if ($Clean) {
        Write-Host "Cleaning Android build cache..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force .\android\build -ErrorAction SilentlyContinue
        Remove-Item -Recurse -Force .\android\app\build -ErrorAction SilentlyContinue
    }
    
    npx expo run:android
}

# Function: Complete project setup from scratch
function Initialize-Serenify {
    [CmdletBinding()]
    param(
        [Parameter()]
        [switch]$SkipEnv,
        
        [Parameter()]
        [switch]$Force
    )
    
    Write-Host " Initializing Serenify Project..." -ForegroundColor Green
    
    # Check if node_modules exists
    if (Test-Path .\node_modules) {
        if (-not $Force) {
            $response = Read-Host "node_modules already exists. Reinstall? (y/n)"
            if ($response -ne 'y') {
                Write-Host "Skipping npm install..." -ForegroundColor Yellow
                return
            }
        }
        Write-Host "Removing existing node_modules..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force .\node_modules
    }
    
    # Install dependencies
    Write-Host "Installing dependencies..." -ForegroundColor Cyan
    npm install
    
    # Check .env file
    if (-not $SkipEnv -and -not (Test-Path .\.env)) {
        Write-Host " .env file not found!" -ForegroundColor Red
        Write-Host "Create .env with Firebase credentials before running the app." -ForegroundColor Yellow
    }
    
    Write-Host "Serenify initialization complete!" -ForegroundColor Green
    Write-Host "Run 'Start-Serenify' to start development server" -ForegroundColor Cyan
}

# Function: Full project reload (clear caches, reinstall, restart)
function Reset-Serenify {
    [CmdletBinding()]
    param(
        [Parameter()]
        [switch]$Deep
    )
    
    Write-Host "Reloading Serenify..." -ForegroundColor Yellow
    
    # Clear Expo cache
    Write-Host "Clearing Expo cache..." -ForegroundColor Cyan
    Remove-Item -Recurse -Force .\.expo -ErrorAction SilentlyContinue
    
    # Clear Metro bundler cache
    Write-Host "Clearing Metro cache..." -ForegroundColor Cyan
    npm start -- --clear --reset-cache
    
    if ($Deep) {
        Write-Host "Deep reload: Reinstalling dependencies..." -ForegroundColor Magenta
        Remove-Item -Recurse -Force .\node_modules
        Remove-Item -Force .\package-lock.json -ErrorAction SilentlyContinue
        npm install
        
        Write-Host "Clearing Android build cache..." -ForegroundColor Cyan
        Remove-Item -Recurse -Force .\android\build -ErrorAction SilentlyContinue
        Remove-Item -Recurse -Force .\android\app\build -ErrorAction SilentlyContinue
    }
    
    Write-Host "Reload complete!" -ForegroundColor Green
}

# Function: Quick status check
function Get-SerenifyStatus {
    Write-Host "`nSerenify Project Status" -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Gray
    
    # Check Node version
    $nodeVersion = node --version
    Write-Host "Node.js: $nodeVersion" -ForegroundColor Cyan
    
    # Check npm version
    $npmVersion = npm --version
    Write-Host "npm: v$npmVersion" -ForegroundColor Cyan
    
    # Check if dependencies installed
    if (Test-Path .\node_modules) {
        Write-Host "Dependencies: Installed" -ForegroundColor Green
    } else {
        Write-Host "Dependencies: Not installed (run Initialize-Serenify)" -ForegroundColor Red
    }
    
    # Check .env
    if (Test-Path .\.env) {
        Write-Host ".env file: Present" -ForegroundColor Green
    } else {
        Write-Host ".env file:  Missing" -ForegroundColor Yellow
    }
    
    # Check package.json version
    $packageJson = Get-Content .\package.json | ConvertFrom-Json
    Write-Host "App Version: $($packageJson.version)" -ForegroundColor Cyan
    
    Write-Host "================================`n" -ForegroundColor Gray
}

# Aliases for shorter commands 
Set-Alias -Name serenify -Value Start-Serenify
Set-Alias -Name serenify_android -Value Start-SerenifyAndroid
Set-Alias -Name serenify_reset -Value Reset-Serenify
Set-Alias -Name serenify_status -Value Get-SerenifyStatus


Write-Host "Serenify automation scripts loaded!" -ForegroundColor Green
Write-Host "Available commands:" -ForegroundColor Cyan
Write-Host "  Start-Serenify (or 'serenify') - Start dev server" -ForegroundColor Gray
Write-Host "  Start-SerenifyAndroid (or 'serenify_android') - Run on Android" -ForegroundColor Gray
Write-Host "  Initialize-Serenify - Setup project from scratch" -ForegroundColor Gray
Write-Host "  Reset-Serenify (or 'serenify_reset') - Clear caches and reload" -ForegroundColor Gray
Write-Host "  Get-SerenifyStatus (or 'serenify_status') - Project status check" -ForegroundColor Gray