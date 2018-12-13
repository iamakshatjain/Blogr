var express = require("express");
var app =  express();
var bodyParser = require("body-parser")
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/blogApp",{ useNewUrlParser: true });//db-blogApp

//APP CONFIG
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");

//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created:{type:Date,default:Date.now}
});
var blog = new mongoose.model("blog",blogSchema);//collection-blogs
// blog.create({
// 	title:"test post",
// 	image:"https://static.codepen.io/assets/home/codepen-tshirt-efc2f8e7a8f21b57ce6d906679aa56382472b790bc3af04f8d4ef61785838fec.jpg",
// 	body:"this is just a test post"
// })

//RESTFUL ROUTES
//HOME
app.get("/",function(req,res){
	// res.render("home");
	res.redirect("/blogs");
});

//INDEX
app.get("/blogs",function(req,res){
	blog.find({},function(err,blogs){
		if(err)
			console.log("error line#29");
		else
			res.render("index",{blogs:blogs});
	})
});

app.listen(process.env.PORT || 3000,process.env.IP,function(){
	console.log("The blog app is serving....")
});
