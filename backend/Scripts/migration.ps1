param (
    [Parameter(Mandatory)] [string] $username,
    [Parameter(Mandatory)] [string] $password
)

$dbFile = 'tmp\data\data.sqlite'
$bkpDbFile = 'tmp\data\data.sqlite.bkp'
$resultDbFile = 'data.sqlite'

# Move current database to a backup path
if (Test-Path -Path $dbFile -PathType Leaf) {
    if (Test-Path -Path $bkpDbFile -PathType Leaf) {
        echo '[ERROR] Bkp file already exists'
        Exit 1
    }

    echo ''
    echo '[INFO] Moving db file to bkp file'
    Move-Item -Path $dbFile -Destination $bkpDbFile
}

# Execute a migration to update database
echo ''
cd .\SocialMedia.Data\
dotnet ef database update
cd ..

if (Test-Path -Path $resultDbFile -PathType Leaf) {
    echo ''
    echo '[INFO] Moving result db file to db file'
    Move-Item -Path $resultDbFile -Destination $dbFile
}

# Execute scripts to feed initial test data
echo ''
echo '[INFO] Start Server'
$ServerCommandOptions = @{
    FilePath = 'dotnet'
    ArgumentList = @('run', '--project', 'SocialMedia.Api', '--no-build')
    PassThru = $true
}
$ServerProcess = Start-Process @ServerCommandOptions

echo ''
echo '[INFO] Wait a few seconds'
Start-Sleep -Seconds 10

echo ''
echo '[INFO] Executing initial flow'
node .\Scripts\initial-flow $username $password
