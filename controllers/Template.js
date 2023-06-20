import Template from "../models/template";
const request = require("request");
const cheerio = require("cheerio");
const cron = require("node-cron");

cron.schedule("0 */2 * * *", async () => {
  let Usage_detail = "";
  try {
    const template = await Template.find();
    for (let i = 0; i < template.length; i++) {
      const url1 = `https://www.capcut.com/watch/${template[i].Template_ID}`;
      request(url1, async function (error, response, html) {
        if (!error && response.statusCode == 200) {
          const $ = cheerio.load(html);
          Usage_detail = $(".video-detail .actions-detail").text();
          const templates = await Template.findByIdAndUpdate(
            template[i]._id,
            { Usage_detail: Usage_detail },
            {
              new: true,
            }
          );
          console.log("Ok")
        } else {
          console.log("Error")
        }
      });
    }
  } catch (error) {
    console.log("Error")
  }
});
let Template_Name = "";
let Usage_detail = "";
let Creater_name = "";
let Creater_desc = "";
let Tags = "";
export const Fetch = async (req, res, next) => {
  try {
    const { id } = req.body;
    let Template_ID = id;
    const url2 = `https://www.capcut.com/template-detail/${id}`;
    request(url2, function (error, response, html) {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        const name = $(".video-detail .template-title").text();
        Template_Name = name.split(" | ")[0].trim();
        Tags = name.split(" | ")[1].trim();
        Usage_detail = $(".video-detail .actions-detail").text();
        Creater_name = $(".video-detail .author-name").text();
        Creater_desc = $(".video-detail .author-desc").text();
        return res.json({
          Template_Name,
          Template_ID,
          Usage_detail,
          Creater_desc,
          Creater_name,
          Tags,
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
export const update = async (req, res) => {
  try {
    const { values } = req.body;
    const templates = await Template.findByIdAndUpdate(
      req.params._id,
       values,
      {
        new: true,
      }
    );
    return res.json(templates);
  } catch (error) {
    return res.json({
      error: "Template update Failed",
    });
  }
};
export const deletetemplate = async (req, res) => {
  try {
    await Template.findOneAndDelete({ _id: req.params._id });
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
    const templates = await Template.find()
      .sort({ createdAt: -1 })
      .populate("category", "_id name");
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
    const template = await Template.findOne({ _id: req.params._id }).populate(
      "category",
      "_id name"
    );
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
