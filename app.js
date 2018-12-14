var express = require("express");
var app =  express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
mongoose.connect("mongodb://localhost/blogApp",{ useNewUrlParser: true });//db-blogApp
var expressSanitizer = require("express-sanitizer");

//APP CONFIG
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(express.static("public"));
app.use(methodOverride("_method"));
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
		body:req.sanitize(req.body.body)
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

//SHOW
app.get("/blogs/:id",function(req,res){
	var id = req.params.id;
	blog.findById(id,function(err,post){
		if(err)
			console.log("Error line#68");
		else
			res.render("show",{blog:post});
	});
	
});

//EDIT
app.get("/blogs/:id/edit",function(req,res){
	var id = req.params.id;
	blog.findById(id,function(err,editBlog){
		if(err)
			console.log("Error line#80");
		else
			res.render("edit",{blog:editBlog});
	});
});

//UPDATE
app.put("/blogs/:id",function(req,res){
	var updateBlog={};
	updateBlog.title=req.body.title;
	updateBlog.image=req.body.image;
	updateBlog.body=req.sanitize(req.body.body);
	// console.log(updateBlog);
	blog.findByIdAndUpdate(req.params.id,updateBlog,function(err,updatedBlog){
		if(err)
			console.log("error line#92");
		else{
			
			res.redirect("/blogs/"+updatedBlog._id)
			}
	});
});

//DELETE
app.delete("/blogs/:id",function(req,res){
	blog.findByIdAndRemove(req.params.id,function(err){
		if(err)
			console.log("error line#109");
		else
			res.redirect("/");
	})
});

app.listen(process.env.PORT || 3000,process.env.IP,function(){
	console.log("The blog app is serving....")
});
