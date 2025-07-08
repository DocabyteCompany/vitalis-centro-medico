# Script de Optimización de Imágenes - Centro Médico Vitalis
# Autor: Docabyte Agency
# Fecha: $(Get-Date -Format "yyyy-MM-dd")

Write-Host "🖼️ Optimizador de Imágenes - Centro Médico Vitalis" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# Configuración
$imagesDir = "images"
$optimizedDir = "images-optimized"
$criticalImages = @(
    @{
        Name = "pexels-cottonbro-7584497.jpg"
        Description = "Imagen principal de Maxilofacial"
        OriginalSize = "2.77MB"
        Priority = "CRÍTICA"
    },
    @{
        Name = "pexels-shvetsa-4226119.jpg"
        Description = "Imagen de Neurología"
        OriginalSize = "2.6MB"
        Priority = "CRÍTICA"
    },
    @{
        Name = "pexels-mart-production-7089392.jpg"
        Description = "Imagen de Oncología"
        OriginalSize = "1.68MB"
        Priority = "ALTA"
    },
    @{
        Name = "doctor1.png"
        Description = "Imagen del doctor principal"
        OriginalSize = "164KB"
        Priority = "MEDIA"
    },
    @{
        Name = "Logotipo_Salud_Medicina_Moderno_Verde-removebg-preview.png"
        Description = "Logo principal"
        OriginalSize = "650KB"
        Priority = "MEDIA"
    }
)

# Función para mostrar información de imagen
function Show-ImageInfo {
    param($image)
    
    $filePath = Join-Path $imagesDir $image.Name
    if (Test-Path $filePath) {
        $fileInfo = Get-Item $filePath
        $sizeMB = [math]::Round($fileInfo.Length / 1MB, 2)
        Write-Host "📁 $($image.Name)" -ForegroundColor Yellow
        Write-Host "   Descripción: $($image.Description)" -ForegroundColor Gray
        Write-Host "   Tamaño actual: $sizeMB MB" -ForegroundColor Gray
        Write-Host "   Prioridad: $($image.Priority)" -ForegroundColor $(if($image.Priority -eq "CRÍTICA"){"Red"}else{"Yellow"})
        Write-Host ""
    } else {
        Write-Host "❌ No se encontró: $($image.Name)" -ForegroundColor Red
    }
}

# Función para crear directorio optimizado
function Initialize-OptimizedDirectory {
    if (!(Test-Path $optimizedDir)) {
        New-Item -ItemType Directory -Path $optimizedDir | Out-Null
        Write-Host "✅ Directorio creado: $optimizedDir" -ForegroundColor Green
    } else {
        Write-Host "📁 Directorio existente: $optimizedDir" -ForegroundColor Blue
    }
}

# Función para mostrar herramientas de optimización
function Show-OptimizationTools {
    Write-Host "🛠️ Herramientas Recomendadas:" -ForegroundColor Cyan
    Write-Host "1. TinyPNG: https://tinypng.com/" -ForegroundColor White
    Write-Host "2. Squoosh: https://squoosh.app/" -ForegroundColor White
    Write-Host "3. Compressor.io: https://compressor.io/" -ForegroundColor White
    Write-Host ""
}

# Función para generar reporte de optimización
function Generate-OptimizationReport {
    Write-Host "📊 Reporte de Optimización" -ForegroundColor Cyan
    Write-Host "=========================" -ForegroundColor Cyan
    
    $totalSize = 0
    $optimizedSize = 0
    
    foreach ($image in $criticalImages) {
        $filePath = Join-Path $imagesDir $image.Name
        if (Test-Path $filePath) {
            $fileInfo = Get-Item $filePath
            $sizeMB = $fileInfo.Length / 1MB
            $totalSize += $sizeMB
            
            # Estimación de tamaño optimizado (70% reducción)
            $estimatedOptimized = $sizeMB * 0.3
            $optimizedSize += $estimatedOptimized
            
            Write-Host "$($image.Name): $([math]::Round($sizeMB, 2))MB -> $([math]::Round($estimatedOptimized, 2))MB" -ForegroundColor Gray
        }
    }
    
    Write-Host ""
    Write-Host "📈 Beneficios Esperados:" -ForegroundColor Green
    Write-Host "Tamaño total actual: $([math]::Round($totalSize, 2))MB" -ForegroundColor Yellow
    Write-Host "Tamaño optimizado: $([math]::Round($optimizedSize, 2))MB" -ForegroundColor Green
    Write-Host "Reducción: $([math]::Round((($totalSize - $optimizedSize) / $totalSize) * 100, 1))%" -ForegroundColor Green
}

# Función para abrir herramientas de optimización
function Open-OptimizationTools {
    Write-Host "🌐 Abriendo herramientas de optimización..." -ForegroundColor Cyan
    
    $tools = @(
        "https://tinypng.com/",
        "https://squoosh.app/",
        "https://compressor.io/"
    )
    
    foreach ($tool in $tools) {
        Start-Process $tool
        Start-Sleep -Seconds 1
    }
    
    Write-Host "✅ Herramientas abiertas en el navegador" -ForegroundColor Green
}

# Función para mostrar instrucciones paso a paso
function Show-StepByStepInstructions {
    Write-Host "📋 Instrucciones Paso a Paso:" -ForegroundColor Cyan
    Write-Host "============================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1️⃣ Descarga las imágenes críticas:" -ForegroundColor Yellow
    foreach ($image in $criticalImages) {
        Write-Host "   - $($image.Name)" -ForegroundColor Gray
    }
    Write-Host ""
    Write-Host "2️⃣ Optimiza con TinyPNG:" -ForegroundColor Yellow
    Write-Host "   - Ve a https://tinypng.com/" -ForegroundColor Gray
    Write-Host "   - Arrastra las imágenes" -ForegroundColor Gray
    Write-Host "   - Descarga las versiones optimizadas" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3️⃣ Convierte a WebP con Squoosh:" -ForegroundColor Yellow
    Write-Host "   - Ve a https://squoosh.app/" -ForegroundColor Gray
    Write-Host "   - Sube las imágenes optimizadas" -ForegroundColor Gray
    Write-Host "   - Exporta en formato WebP" -ForegroundColor Gray
    Write-Host ""
    Write-Host "4️⃣ Reemplaza en el proyecto:" -ForegroundColor Yellow
    Write-Host "   - Copia las imágenes optimizadas a la carpeta images/" -ForegroundColor Gray
    Write-Host "   - Actualiza el HTML con picture tags" -ForegroundColor Gray
    Write-Host ""
}

# Función principal
function Start-ImageOptimization {
    Write-Host "🚀 Iniciando análisis de optimización..." -ForegroundColor Green
    Write-Host ""
    
    # Mostrar información de imágenes críticas
    Write-Host "📁 Imágenes Críticas Identificadas:" -ForegroundColor Cyan
    Write-Host "===================================" -ForegroundColor Cyan
    Write-Host ""
    
    foreach ($image in $criticalImages) {
        Show-ImageInfo $image
    }
    
    # Crear directorio optimizado
    Initialize-OptimizedDirectory
    
    # Mostrar herramientas
    Show-OptimizationTools
    
    # Generar reporte
    Generate-OptimizationReport
    
    # Mostrar instrucciones
    Show-StepByStepInstructions
    
    # Preguntar si abrir herramientas
    $openTools = Read-Host "¿Quieres abrir las herramientas de optimización? (s/n)"
    if ($openTools -eq "s" -or $openTools -eq "S") {
        Open-OptimizationTools
    }
    
    Write-Host ""
    Write-Host "✅ Análisis completado. Sigue las instrucciones para optimizar las imágenes." -ForegroundColor Green
}

# Ejecutar script
Start-ImageOptimization 