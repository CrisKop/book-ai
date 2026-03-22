# Script PowerShell para unificar todos los archivos .txt de poemas en uno solo
# 1. Ajusta estas variables:

$rootFolder = "D:\Book ia\Nueva_carpeta"  # carpeta principal donde están las carpetas mensuales
$outputFile = "D:\Book ia\Nueva_carpeta\POEMAS_UNIFICADOS.txt"  # archivo final

# 2. Buscar recursivamente TODOS los archivos .txt (excepto el archivo de salida si ya existe)
$txtFiles = Get-ChildItem -Path $rootFolder -Recurse -Include *.txt | Where-Object { $_.FullName -notlike "*$outputFile*" }

Write-Host "Archivos .txt encontrados: $($txtFiles.Count)" -ForegroundColor Cyan
Write-Host ""

if ($txtFiles.Count -eq 0) {
    Write-Host "No se encontraron archivos .txt para unificar." -ForegroundColor Red
    exit 1
}

# 3. Crear/limpiar archivo de salida
"" | Out-File -FilePath $outputFile -Encoding UTF8

$counter = 0

# 4. Procesar cada archivo .txt en orden (puedes cambiar a orden por fecha si prefieres)
foreach ($file in $txtFiles) {
    $relativePath = $file.FullName.Replace($rootFolder, "").TrimStart('\','/')
    
    # Encabezado con la ruta relativa
    "=== POEMA DESDE: $relativePath ===" | Out-File -FilePath $outputFile -Append -Encoding UTF8
    
    # Contenido del archivo .txt
    Get-Content $file -Encoding UTF8 | Out-File -FilePath $outputFile -Append -Encoding UTF8
    "" | Out-File -FilePath $outputFile -Append -Encoding UTF8
    
    $counter++
    Write-Host "Agregado: $relativePath"
}

Write-Host ""
Write-Host "=== FINALIZADO ===" -ForegroundColor Green
Write-Host "Total archivos unificados: $counter"
Write-Host "Archivo final: $outputFile"
Write-Host ""
Write-Host "Primeras líneas del archivo final:" -ForegroundColor Yellow
Get-Content $outputFile -TotalCount 15