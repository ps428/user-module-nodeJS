/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-unused-lets */


import crypto from "crypto";
import DbOperation from "db_pkg";



const generate_session_key = async function(){
    return crypto.randomBytes(8).toString("base64");
};


export default class SessionClass{
    constructor(){

    }

async  insertSession(username,refreshtoken){
    let result;

    const u_name = username;
    const ref_token = refreshtoken;

   // console.log("refresh token is "+refreshtoken);
    //console.log("reftoken is " +ref_token);

    const generate_session_id = await generate_session_key().then(result);
    
    let get_user_id;
    let user_id;
    let fetch_condition = [u_name];

    try{
        //user_id = await this.getUserID(u_name).then(result => result.values[0].id);
        const get_sql = "select id from users where email=?";
        
        get_user_id = await DbOperation.execCustomQuery(get_sql,fetch_condition);
       // user_id = await getUserID(u_name);
        
        user_id = get_user_id[0].id;

        console.log("the user is "+get_user_id[0].id);   
        }

    catch(error){
        console.log(error);
        console.log("User not exist");
        result = {success:false,msg:error};
        return result;
    }

    let currentdate;
    currentdate = new Date().toISOString().slice(0, 19).replace("T", " ");
    console.log(currentdate);
    console.log(ref_token);

    let insert_table = "sessions"; 
    let flag_insert_success = 0 ;
    
    let fieldsData = [
        "session_id",
        "user_id",
        "login_time",
        "token"
    ];
    let valuesData = [
            [
            generate_session_id,
            user_id,
            currentdate,
            ref_token                       
            ]
    ];


    try{
        await DbOperation.insertData("sessions",fieldsData,valuesData);
        flag_insert_success = 1;
        result =  {success:true,msg:"session inserted"};
    }
    catch(error){
        console.log("esbsjb");
        console.log(error);
        result =  {success:false,msg:"session insertion failed"};
    }

    let get_max_id;
    let get_max_id_from_session;
    let returned_max_user_id;

    let fetch_condition1 = [user_id];

    try{
        get_max_id = "select max(id) as maxid from sessions where user_id = ?";
        
        get_max_id_from_session = await DbOperation.execCustomQuery(get_max_id,fetch_condition1);
     
        returned_max_user_id = get_max_id_from_session[0].maxid;
 
    }

    catch(error){
        console.log("error in fetching max id"+error);
    }

    let updateData = 
        {   
        "logout_time": currentdate                           
        };
    
    let condData = 
        {   
            "user_id": user_id,
            "id": returned_max_user_id-1
        };



    if(flag_insert_success == 1){
        try{
            await DbOperation.updateData("sessions",updateData,condData);
            result = {
                success: true,
                message:"previous session ended."
               };
        }
        catch(error){
            console.log("updating error"+error);
            result = {
                success: false,
                message:"previous session update failed."
               };
        }

    }


       console.log(result);
       return result;
}


//insertSession('ps@test.com','1234');
//connection.end();


async  fetchSessiondata(username){

    let result;
   // connection = db_connection;

    let get_session_data;

    let fetch_condition2= [];
 
    const query = `
    select session_id, token from sessions where id = (select max(id) from sessions) and logout_time is null;`;

        try{
            
            get_session_data = await DbOperation.execCustomQuery(query,fetch_condition2);
            
            result =  {success:true,msg:"query passed",output:get_session_data};
        }

        catch(error){
            console.log(error);
            
            result = {success:false,msg:"query failed",output:get_session_data};
        }




        return result;

}

}
