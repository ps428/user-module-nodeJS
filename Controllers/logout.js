import DbOperation from "db_pkg";
import UserCrud from "../DbFunctions/userCrudFunctions.js";


export async function logout(req,response) {                                                          //logout

    let username = req.body.username;
    let result;

    const userCrudFunctions = new UserCrud()
    let userData = await userCrudFunctions.getUserDataByParameterDB('(email=?)',[username]);
    let user_id = userData.values[0].id;
    let currentdate = new Date().toISOString().slice(0, 19).replace("T", " ");
   

    let get_max_id;
    let get_max_id_from_session;
    let returned_max_user_id;

    let fetch_condition  = [user_id];

    try{
        get_max_id = "select max(id) as maxid from sessions where user_id = ?";
        get_max_id_from_session = await DbOperation.execCustomQuery(get_max_id,fetch_condition);
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
            "id": returned_max_user_id
        };



    try{
        await DbOperation.updateData("sessions",updateData,condData);
        result = {
            success: true,
            message:"session ended successfully."
            };
    }
    catch(error){
        result = {
            success: false,
            message:"session update failed."
            };
    }

    response.status(200).json(result);

}
