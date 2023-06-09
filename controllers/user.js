import jwt from "jsonwebtoken";
import { comparepassword, hashpassword } from "../helpers/auth";
import User from "../models/user";

//Register Controller
export const Register = async (req, res) => {
  const { name, email, password } = req.body;
  const exist = await User.findOne({ email });
  if (exist) {
    return res.json({
      error: "User Already Exist",
    });
  }
  const hashedpassword = await hashpassword(password);
  const user = new User({
    name,
    email,
    password: hashedpassword,
  });
  try {
    await user.save();
    return res.json({ ok: true });
  } catch (err) {
    console.log("Register Error", err);
    return res.json({
      error: "Register Error,Plase Try Again",
    });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: "User Not Found",
      });
    }
    const match = await comparepassword(password, user.password);
    if (!match) {
      return res.json({
        error: "Wrong Credential",
      });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    user.password = undefined;
    user.secret = undefined;
    return res.json({
      token,
      user,
    });
  } catch (err) {
    console.log("Login Error", err);
    return res.json({
      error: "Try Again",
    });
  }
};


export const UpdateProfile = async (req, res) => {
  const { name,password } = req.body;
  const data={}
    if(name)
    {
        data.name=name;
    }
    if(password)
    {
        data.password=await hashpassword(password);
    }
  const user = await User.findByIdAndUpdate(req.auth._id,data,{
    new:true
  })
  user.password=undefined;
  user.secret=undefined;
  try {
    return res.json({
      user
    });
  } catch (err) {
    return res.json({
      error: "Update User Error",
    });
  }
};
