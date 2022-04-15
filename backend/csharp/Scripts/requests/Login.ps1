$Data = @{

}

Invoke-RestMethod -Method Post -Body $Data -Uri "http://localhost:5500/Auth/Login"
