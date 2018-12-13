var express = require("express");
var app =  express();
var bodyParser = require("body-parser");
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

//NEW
app.get("/blogs/new",function(req,res){
	res.render("new");
});

//CREATE
app.post("/blogs",function(req,res){
	// console.log(req.body);
	var newblog = {
		title:req.body.title,
		image:req.body.image,
		body:req.body.body
	};

	blog.create(newblog,function(err,blog){
		if(err)
			console.log("error,line#51");
		else{
			console.log(blog + "added");
			res.redirect("/blogs");
		}

	});
});

app.listen(process.env.PORT || 3000,process.env.IP,function(){
	console.log("The blog app is serving....")
});
