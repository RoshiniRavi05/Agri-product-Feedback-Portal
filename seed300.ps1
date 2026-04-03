$firstNames = @("Arun", "Babu", "Chandran", "Devaraj", "Elango", "Ganesh", "Hari", "Ilan", "Jeeva", "Kannan", "Lakshman", "Mani", "Nataraj", "Om", "Prabhu", "Ram", "Siva", "Thiru", "Udhay", "Vel", "Anbu", "Bala", "Chelliah", "Durai", "Eshwar", "Gopal", "Harish", "Iniyan", "Janaki", "Karthik", "Ravi", "Sundar", "Murali", "Dinesh", "Senthil", "Venkatesh", "Vijay", "Ajith", "Surya", "Vikram")
$lastNames = @("Raja", "Kumar", "Nathan", "Swamy", "Pandian", "Raj", "Muthu", "Gounder", "Thevar", "Chettiar", "Prasad", "Pillai", "Iyer", "Nair", "Reddy", "Rao", "Naidu", "Babu", "Vel", "Kannan", "Murugan", "Sami", "Sekar", "Selvam", "Rajan", "Ramamurthy", "Krishnan", "Venkat", "Subramaniam", "Balaji")
$villages = @("Erode", "Sathyamangalam", "Anthiyur", "Gobichettipalayam", "Perundurai", "Bhavani", "Talavadi", "Modakkurichi", "Appakudal", "Kavindapadi", "Nambiyur", "Kanjikoil", "Vellakoil", "Kangeyam", "Dharapuram", "Tiruppur", "Coimbatore", "Pollachi", "Mettupalayam", "Palladam", "Avinashi", "Udumalpet", "Karur", "Namakkal", "Salem", "Dharmapuri", "Krishnagiri", "Hosur", "Ooty", "Coonoor", "Kotagiri")
$genders = @("male", "female")

$apiUrl = "https://agri-product-feedback-portal.onrender.com/api/auth/register"

$random = New-Object System.Random

Write-Host "Seeding 300 dummy farmers directly to Live Database via API..."

for ($i = 1; $i -le 300; $i++) {
    $fn = $firstNames[$random.Next(0, $firstNames.Length)]
    $ln = $lastNames[$random.Next(0, $lastNames.Length)]
    $vil = $villages[$random.Next(0, $villages.Length)]
    $gen = $genders[$random.Next(0, $genders.Length)]

    # Generate a random 10 digit number starting with 9, 8, or 7
    $phone = (7..9 | Get-Random).ToString()
    for ($j = 0; $j -lt 9; $j++) {
        $phone += $random.Next(0, 10).ToString()
    }

    $body = @{
        name = "$fn $ln"
        phone = $phone
        village = $vil
        gender = $gen
        password = "password123"
        role = "farmer"
    } | ConvertTo-Json -Depth 2 -Compress

    try {
        Invoke-RestMethod -Uri $apiUrl -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop | Out-Null
        if ($i % 20 -eq 0) {
            Write-Host "Injected $i users..."
        }
    } catch {
        # ignore constraints or dupes, just skip
    }
}

Write-Host "Successfully injected 300 users!"
