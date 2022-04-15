param (
    [Parameter(Mandatory)] [string] $username,
    [Parameter(Mandatory)] [string] $password
)

node .\Scripts\initial-flow $username $password