const fs = require('fs');
const axios = require('axios');
const Path = require('path')
let path = './data';
let listFiles = fs.readdirSync(path);
const rex = /([\w.][\w.-]*)(?<!\/\.)(?<!\/\.\.)(?:\?.*)?$/;
(async () => {
    listFiles.forEach( (file) => {
        try {
            let content = require(`${path}/${file}`);
            content.forEach(async function(s_file){
                await downloadImage(s_file.link, s_file.count);
            });
        } catch(e) {
            console.error(`file: ${file} cant parse`);
        }
    })
})();
async function downloadImage (link , subdir) {
    let splited = link.split('/');
    let filename = splited[splited.length -1];
    if(!filename) {
        return false;
    }
    if(!fs.existsSync(`./download/${subdir}`)) {
        fs.mkdirSync(`./download/${subdir}`)
    }
    const path = Path.resolve(__dirname, 'download',subdir, filename)
    // axios image download with response type "stream"
    const response = await axios({
      method: 'GET',
      url: link,
      responseType: 'stream'
    })
  
    // pipe the result stream into a file on disc
    response.data.pipe(fs.createWriteStream(path))
  
    // return a promise and resolve when download finishes
    return new Promise((resolve, reject) => {
      response.data.on('end', () => {
        resolve()
      })
  
      response.data.on('error', () => {
        reject()
      })
    })
  
  }