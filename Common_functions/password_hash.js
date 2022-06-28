import bcrypt from "bcrypt";


export default class PasswordHash{
      
      constructor(){
        
      } 

hash_password(password){                                      //hash the password , this method is for registration
    
    const hashed_passwd = bcrypt.hashSync(password,10);
  // console.log(hashed_passwd)
    return hashed_passwd;


}

verify_password(user_given_password,dbstored_password){                     // verifiy the password for login 

    const verify_passwd = bcrypt.compareSync(user_given_password,dbstored_password);
  //  console.log(verify_passwd)
    return verify_passwd;
}

}


//let user = new PasswordHash();
//console.log(user.hash_password("123456"));

//console.log(verify_password('123456','$2b$10$GayotICcY3sXmyxe2eSj6ebKJZlclZpfXGgqZBCdU8A1rJLw6B33O'));

