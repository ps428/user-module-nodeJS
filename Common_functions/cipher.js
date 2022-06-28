import nacl from "tweetnacl";
import util from "tweetnacl-util";


const sender = nacl.box.keyPair();
const receiver = nacl.box.keyPair();


export default class Cipher{
    constructor(){

    }

 encryption_f(plain_text){
    //sender computes a one time shared key
    const sender_shared_key = nacl.box.before(receiver.publicKey,sender.secretKey);

    //sender also computes a one time code.
    const one_time_code = nacl.randomBytes(24);


    //Getting the cipher text
    const cipher_text = nacl.box.after(
        util.decodeUTF8(plain_text),
        one_time_code,
        sender_shared_key 
    );

    //message to be transited.
    const message_in_transit = {cipher_text,one_time_code};

    return message_in_transit;
}


//encrpted_msg = encryption_f('2CmDxHCEL');
//console.log(encrpted_msg);




decryption_f(message){
    //Getting Viktoria's shared key
    const receiver_shared_key = nacl.box.before(sender.publicKey,receiver.secretKey);

    //Get the decoded message
    let decoded_message = nacl.box.open.after(message.cipher_text,message.one_time_code,receiver_shared_key);

    //Get the human readable message
    return (util.encodeUTF8(decoded_message));

}

}

//decrypted_msg = decryption_f(encrpted_msg);
//console.log(decrypted_msg);








