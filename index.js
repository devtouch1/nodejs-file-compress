//MODULES
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer'); //to upload the files to the server
const admzip = require('adm-zip');
const storage = require('./storage.js'); //create storage
//CONST
const app = express();
const PORT = 4000; 
const maxSize = 20 * 1024 * 1024; //20 MB
const files_upload = multer({storage: storage, limits: {fileSize: maxSize}}); //create a multer instancia, que recebe file e size como parametro
//create public
const dir = 'public';
const subDirectory1 = `${dir}/uploads`;
const subDirectory2 = `${dir}/zips`;
if(!fs.existsSync(dir)){
	fs.mkdirSync(dir);

	fs.mkdirSync(subDirectory1);
	fs.mkdirSync(subDirectory2);

}

//define public static
app.use(express.static('public'));


//SERVER ROUTERS
app.get('/', (req, res)=>{
	res.sendFile(__dirname+"/index.html");
});

app.post('/compressfiles', files_upload.array('file', 10),(req, res)=>{
	const zip = new admzip();
	if(req.files){
		req.files.forEach(e=>{
			console.log(e.path);
			zip.addLocalFile(e.path);
		});
		const outputPath = `filepack${Date.now()}.zip`;
		fs.writeFileSync(outputPath, zip.toBuffer());
		res.download(outputPath, (err)=>{
			if(err){
				req.files.forEach(e=>{
					fs.unlinkSync(e.path);
				});
				fs.unlinkSync(outputPath);
				res.send("FILE DOWNLOAD ERROR");
			}
			req.files.forEach(e=>{
				fs.unlinkSync(e.path);
			});
			fs.unlinkSync(outputPath);
		});
	}
});

app.listen(PORT, ()=>{
	console.log(`UP AND RUNNING ON PORT ${PORT}`);
});