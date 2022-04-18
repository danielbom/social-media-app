param ([Parameter(Mandatory=$true)] [string] $Cmd, $User = "admin", $Database = "test")

docker exec -it mysql mysql $Database -u $User -e $Cmd -p
