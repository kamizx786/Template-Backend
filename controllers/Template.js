import Template from "../models/template";
const request = require("request");
const cheerio = require("cheerio");

let video_link = "";
let poster_link = "";
let Template_Name = "";
let Usage_detail = "";
let Creater_name = "";
let Creater_desc = "";
export const Fetch = async (req, res, next) => {
  try {
    const {id}=req.body;
    const url1 = `https://www.capcut.com/watch/${id}`;
    request(url1, function (error, response, html) {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        video_link = $("video.bf3jnstij5FJqcgNwzxw").attr("src");
        poster_link = $("video.bf3jnstij5FJqcgNwzxw").attr("poster");
        console.log(video_link,"-----------",poster_link)
        if(video_link ===undefined || poster_link===undefined){
            return res.json({
               error:"Something Went Wrong",
              }); 
        }else{
            next();
        }
       
      } else {
        return res.json({
          error: error,
        });
      }
    });
  } catch (error) {
    return res.json({
      error: "Fetch Template Failed",
    });
  }
};
export const FetchOtherDetails = async (req, res) => {
  try {
    const {id}=req.body;
    let Template_ID = id;
    const url2 = `https://www.capcut.com/template-detail/${id}`;
    request(url2, function (error, response, html) {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        Template_Name = $(".video-detail .template-title").text();
        Usage_detail = $(".video-detail .actions-detail").text();
        Creater_name = $(".video-detail .author-name").text();
        Creater_desc = $(".video-detail .author-desc").text();
        return res.json({
          Template_Name,
          Template_ID,
          Usage_detail,
          Creater_desc,
          Creater_name,
          video_link,
          poster_link,
        });
      } else {
        return res.json({
          error: error,
        });
      }
    });
  } catch (error) {
    return res.json({
      error: "Fetch Template Failed",
    });
  }
};
export const create = async (req, res) => {
    try {
      const { values } = req.body;
      const template = await new Template(values).save();
      return res.json(template);
    } catch (error) {  
      return res.json({
        error: "Template Create Failed",
      });
    }
};
export const deletetemplate = async (req, res) => {
    try {
      await Template.findOneAndDelete({ _id: req.params._id});
      return res.json({
        ok: true,
      });
    } catch (error) {
      return res.json({
        error: "Delete Failed",
      });
    }
  };

  export const AllTemplates = async (req, res) => {
    try {
      const templates = await Template.find().sort({ createdAt: -1 })
      .populate("category","_id name");
      return res.json({
       templates,
      });
    } catch (error) {
      res.json({
        error: "Fetch Templates Failed",
      });
    }
  };
  export const SingleTemplate = async (req, res) => {
    try {
      const template = await Template.findOne({ _id: req.params._id })
      .populate("category","_id name");;
      if (template) {
        return res.json({ template });
      } else {
        return res.json({
          error: "Not Found",
        });
      }
    } catch (error) {
      res.json({
        error: "Fetch Single template Failed",
      });
    }
  };