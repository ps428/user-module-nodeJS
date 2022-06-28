import DbOperations from 'db_pkg.mjs'
let dbOps = new DbOperations();

let query = "SELECT * FROM users LIMIT 2";

let fieldsData = [
    'name',
    'mobile',
    'email',
    'userid',
    'user_type_id'
]
let valuesData = [
    [   
        'Harshit Bissa', 
        '9461437117', 
        'hb25111991@gmail.com', 
        'harshit.bissa',
        1                            
    ],
    [   
        'Ashutosh Tiwari', 
        '9876543212', 
        'ashutosht@spanidea.com', 
        'ashutosh.tiwari',
        1                                          
    ]
];
await dbOps.insertData("users",fieldsData,valuesData);

let updateData = 
{   
    'mobile': '9461144182', 
    'email': 'harshit.bissa@yahoo.com'                            
}
let condData = 
{   
    'id': 60, 
}
await dbOps.updateData("users",updateData,condData);

query = "DELETE FROM users WHERE id IN (60,61)";
await dbOps.getData(query);

console.log("All queries executed successfully");