import bcrypt from "bcrypt";

export const hashpassword=(password)=>{
 return new Promise((resolve,reject)=>{
  bcrypt.genSalt(12,(err,salt)=>{
   if(err)
   {
    reject(err);
    console.log(err)
   }
   bcrypt.hash(password,salt,(err,hash)=>{
    if(err)
    {
        reject(err);
        console.log(err)
    }
   resolve(hash);
   });
  });
 });
}
export const comparepassword =(password,hashed)=>{
   return bcrypt.compare(password,hashed);
}