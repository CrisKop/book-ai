# Script PowerShell para extraer texto de imágenes de poemas (estructura de carpetas por meses)
# Guarda este archivo como extraer_poemas.ps1 en la carpeta raíz donde están las carpetas mensuales

# Ruta a Tesseract (ajusta si es necesario)
$tesseract = "tesseract"

# Carpeta raíz donde están las carpetas de meses (ej: C:\Poemas)
$rootFolder = "D:\Book ia\Nueva_carpeta"

# Archivo de salida
$outputFile = "D:\Book ia\Nueva_carpeta\poemas-completos.txt"

# Crear/limpiar archivo de salida
"" | Out-File -FilePath $outputFile -Encoding UTF8

# Función para procesar una imagen
function Process-Image($imagePath, $relativePath) {
    $tempFile = [System.IO.Path]::ChangeExtension($imagePath, ".txt")
    
    Write-Host "Procesando: $relativePath"
    
    # Ejecutar Tesseract (extrayendo texto en español)
    & $tesseract $imagePath $tempFile -l spa 2>$null
    
    if (Test-Path $tempFile) {
        # Encabezado con ruta relativa (carpeta mes/nombre archivo)
        "=== POEMA DESDE: $relativePath ===" | Out-File -FilePath $outputFile -Append -Encoding UTF8
        Get-Content $tempFile | Out-File -FilePath $outputFile -Append -Encoding UTF8
        "" | Out-File -FilePath $outputFile -Append -Encoding UTF8
        Remove-Item $tempFile -Force
    }
}

# Recorrer recursivamente todas las subcarpetas (meses)
Get-ChildItem -Path $rootFolder -Recurse -Include *.jpg,*.jpeg,*.png,*.gif,*.bmp | ForEach-Object {
    $imagePath = $_.FullName
    # Calcular ruta relativa desde la carpeta raíz
    $relativePath = $_.FullName.Replace($rootFolder, "").TrimStart('\','/')
    Process-Image $imagePath $relativePath
}

Write-Host "`n¡Listo! Todos los poemas extraídos en:" $outputFile
Write-Host "Total de carpetas procesadas: $(Get-ChildItem -Path $rootFolder -Directory | Measure-Object).Count"