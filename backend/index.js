const express = require('express');
const app = express();
const dotenv = require('dotenv')
const axios = require('axios')
const fs = require('fs')
const cors = require('cors')
const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
dotenv.config();
app.use(cors());

//post 1000회 하면 하루 할당 api가 끝나버리므로, post하며 파일을 uploads에 저장시키고, get으로 그걸 가져오게 해서 횟수를 절약한다.
app.get("/api/data", async(req, res)=>{
    try{
        res.set('Content-Type', 'application/json; charset=utf-8');
        const tempFile = fs.createReadStream('uploads/chart.json');
        return tempFile.pipe(res);
    }
    catch(e){
        console.log(e);
        return res.json(e);
    }
})

app.post("/api/data", async (req, res) => {
    try {
        const url = 'https://openapi.naver.com/v1/datalab/search';
        
        const {startDate, endDate, timeUnit, device, gender, keywordGroups, ages} = req.body;
        const request_body = {
            startDate: startDate,
            endDate: endDate,
            timeUnit: timeUnit,
            device: device === "all" ? "" : device,
            gender: gender === "all" ? "" : gender,
            keywordGroups: keywordGroups,
            ages: ages,
        }

        const headers = {
            'X-Naver-Client-Id': process.env.CLIENT_ID,
            'X-Naver-Client-Secret': process.env.CLIENT_SECRET,
            'Content-Type': 'application/json'
        };
        const result = await axios.post(url,request_body,{
            headers: headers
        })
        // console.log(result.data)

        fs.writeFile("./uploads/chart.json", JSON.stringify(result.data['results']), function(error){
            console.log(error);
            if(error) throw error;
        })

        return res.json({status: "OK"});
    }
    catch (error) {
        console.log(error);
        return res.json(error);
    }
})

app.delete("/api/data", async (req, res) => {
    try {
        fs.unlink('uploads/chart.json', function(error){
            if(error){
                console.log(error);
                return res.json(error);
            }
        })
        return res.json({status: "success"})
    }
    catch (error) {
        console.log(error);
        return res.json(error);
    }
})


app.listen(PORT, ()=>console.log(`this server listening on ${PORT}`))
