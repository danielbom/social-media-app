param (
    [Parameter(Mandatory)] [string] $username,
    [Parameter(Mandatory)] [SecureString] $password
)

$dbFile = 'tmp\data\data.sqlite'
$bkpDbFile = 'tmp\data\data.sqlite.bkp'
$resultDbFile = 'data.sqlite'

# Move current database to a backup path
if (Test-Path -Path $dbFile -PathType Leaf) {
    if (Test-Path -Path $bkpDbFile -PathType Leaf) {
        Write-Output '[ERROR] Bkp file already exists'
        Exit 1
    }

    Write-Output ''
    Write-Output '[INFO] Moving db file to bkp file'
    Move-Item -Path $dbFile -Destination $bkpDbFile
}

# Execute a migration to update database
Write-Output ''
Set-Location .\SocialMedia.Data\
dotnet ef database update
Set-Location ..

if (Test-Path -Path $resultDbFile -PathType Leaf) {
    Write-Output ''
    Write-Output '[INFO] Moving result db file to db file'
    Move-Item -Path $resultDbFile -Destination $dbFile
}

# Execute scripts to feed initial test data
Write-Output ''
Write-Output '[INFO] Start Server'
$ServerCommandOptions = @{
    FilePath     = 'dotnet'
    ArgumentList = @('run', '--project', 'SocialMedia.Api', '--no-build')
    PassThru     = $true
}
Start-Process @ServerCommandOptions

Write-Output ''
Write-Output '[INFO] Wait a few seconds'
Start-Sleep -Seconds 10

Write-Output ''
Write-Output '[INFO] Executing initial flow'
node .\Scripts\initial-flow $username $password
