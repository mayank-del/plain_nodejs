const http=require("http");

const options={
    hostname:'localhost',
    port:4000,
    path:'/',
    method:'GET'
}

const req=http.request(options,res=>{
    console.log(res.statusCode);

    res.on('data',d=>{
        process.stdout.write(d)
    })
})
req.on("error",error=>{
    console.log(error);
})

req.end()

