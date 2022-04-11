import '@logseq/libs';
import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin';

const settingsTemplate:SettingSchemaDesc[] = [{
  key: "analyseTitle",
  type: 'string',
  default: "Logseq Database Analyses 📊",
  title: "Title of the Analysis",
  description: "In case you're not a fan of the default title",
}
]

const reEmoji = /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/ug
const reCode  = /(```[\s\S]*?```)/gm
const reQuery = /(#\+BEGIN_QUERY[\s\S]*?#\+END_QUERY)/gm
const reQuspl = /({{query[\s\S]*?}})/gm
const reLink  = /\[.*?\]\(http.*?\)/gm
const reYoutb = /{{youtube https.*?}}/gm
const reAsset = /!\[.*?\]\(\.\.\/assets\/.*?\)/gm
//FIXME what about other 'alphabets'?
const reChars = /[a-zA-Z]/g

const pluginName  = ["logseq-analysis", "Logseq Analysis"]
const queryPages  = `[:find (pull ?p [*]) :where [_ :block/page ?p]]`
const queryTasks  = `[:find (pull ?b [*]) :where [?b :block/marker ?m] (not [(contains? #{"DONE"} ?m)])]`
const queryDone   = `[:find (pull ?b [*]) :where [?b :block/marker ?m] [(contains? #{"DONE"} ?m)]]`
const queryBlocks = `[:find (pull ?b [*]) :where [?b :block/uuid ?u]]`
const queryRefs   = `[:find (pull ?p [*]) :where  [_ :block/refs ?p]]`

// wholesale lifted from https://github.com/hkgnp/logseq-wordcount-plugin/blob/master/index.js
// Credit to https://stackoverflow.com/users/11854986/ken-lee for the below function
const mixedWordsFunction = (str) => {
  /// fix problem in special characters such as middle-dot, etc.
  str = str.replace(/[\u007F-\u00FE.,\/#!$%\^&\*;:{}=\-_`~()>\\]/g, ' ');

  /// make a duplicate first...
  let str1 = str;
  let str2 = str;

  /// the following remove all chinese characters and then count the number of english characters in the string
  str1 = str1.replace(/[^!-~\d\s]+/gi, ' ');

  /// the following remove all english characters and then count the number of chinese characters in the string
  str2 = str2.replace(/[!-~\d\s]+/gi, '');

  const matches1 = str1.match(/[\u00ff-\uffff]|\S+/g);
  const matches2 = str2.match(/[\u00ff-\uffff]|\S+/g);

  const count1 = matches1 ? matches1.length : 0;
  const count2 = matches2 ? matches2.length : 0;

  /// return the total of the mixture
  return count1 + count2;
};

async function runQuery(query:string) {
  try {
    let qresult = await logseq.DB.datascriptQuery(query)
        qresult = qresult?.flat()
    if(qresult) {
      return qresult.length
    }
    return `Sorry query error: ${query}`
  } catch (err) {
    console.log(err)
  }}

// https://gist.github.com/lsauer/2757250 //count characters
async function parseContent(query:string) {
  try {
    let qresult = await logseq.DB.datascriptQuery(query)
        qresult = qresult?.flat()
    if(qresult) {
      let totalWords:number  = 0
      let totalChars:number  = 0
      let totalEmoji:number  = 0
      let codeBlocks:number  = 0
      let codeChars:number   = 0
      let queryBlocks:number = 0
      let querySimple:number = 0
      let queryLinks:number  = 0
      let queryYoutb:number  = 0
      let queryAssets:number = 0
      for (let a = 0; a < qresult.length; a++) {
        if (qresult[a]?.content) {
          totalWords += mixedWordsFunction(qresult[a].content);
//FIXME what about other 'alphabets'?
          totalChars += (qresult[a].content.match( reChars)||[]).length
          totalEmoji += (qresult[a].content.match(reEmoji)||[]).length          
          codeBlocks += (qresult[a].content.match(reCode)||[]).length  
          //FIXME codeChars is buggy
          // if ((qresult[a].content.match(reCode)||[]).length > 0) {
          //   console.log("DB reCode", (qresult[a].content.match(reCode)||[]))
          //   for (let b = 0; b < qresult[a].content.match(reCode).length; b++) {
          //     // console.log("DB 1", (qresult[a].content.match(reCode)||[])[b])
              
          //     let aa = mixedWordsFunction(qresult[a].content.match(reCode)[b])
          //     codeChars += mixedWordsFunction(qresult[a].content.match(reCode)[b])
          //     console.log(`DB loop ${b} #char ${aa}:`, qresult[a].content.match(reCode)[b])
          //   }
          // }
          queryBlocks += (qresult[a].content.match(reQuery)||[]).length  
          querySimple += (qresult[a].content.match(reQuspl)||[]).length  
          queryLinks  += (qresult[a].content.match(reLink)||[]).length  
          queryYoutb  += (qresult[a].content.match(reYoutb)||[]).length  
          queryAssets += (qresult[a].content.match(reAsset)||[]).length  
        }
      }
      return [totalWords, totalChars, totalEmoji, codeBlocks, codeChars, 
        queryBlocks, querySimple, queryLinks, queryYoutb, queryAssets]
    }
    console.log("Sorry",qresult)
    return `Sorry query error: ${query}`  
  } catch (err) {
    console.log(err)
  }
}

async function analyseGraph() {
  const pages = await runQuery(queryPages)
  const blocksText = await runQuery(queryBlocks)
  const tasks = await runQuery(queryTasks)
  const done = await runQuery(queryDone)
  
  const txt = await parseContent(queryBlocks)
  const wordsText = txt[0]
  const charText = txt[1]
  const emojiText = txt[2]

  const blocksCode = txt[3]
  const charCode = txt[4]

  const query = txt[5]
  const squery = txt[6]

  const refs = await runQuery(queryRefs)
  const extLinks = txt[7]
  const video = txt[8]
  const asset = txt[9]
  
async function addBlock(items:Object) {
  let ret 
  let index = 0;
  for (const [key, value] of Object.entries(items)) {
    if (index === 0) {
      ret = (value) ? `[:h3 "${value}"][:ul ` : "[:ul "
    } else {
      ret += `[:li "${key}: ${value.toLocaleString()}"]`
    }
    index++
  }
  ret += "]" //close ul
  return ret
} 

  let msg = `[:div.color-level {:style {:padding-left 5}} [:h2 "${logseq.settings.analyseTitle}"]`
  msg += await addBlock({
    title: false,
    "Pages": pages
  })
  msg += await addBlock({
    title: "Text",
    "Blocks": blocksText,
    "Words": wordsText,
    "Characters": charText,
    "Emoji": emojiText
  })
  msg += await addBlock({
    title: "Code",
    "Codeblocks": blocksCode
  })
  msg += await addBlock({
    title: "References",
    "Interconnections (refs)": refs,
    "External links": extLinks
  })
  msg += await addBlock({
    title: "Task management",
    "Tasks": refs,
    "Finished tasks (DONE)": done
  })
  msg += await addBlock({
    title: "Queries",
    "Number of simple queries": squery,
    "Number of advanced queries": query
  })
  msg += await addBlock({
    title: "Media",
    "Videos": video,
    "Assets": asset
  })
  msg += "]" //close div
  return msg
}

async function onTemplate(uuid){
  //is block(uuid) on a template?
  //returns boolean
  try {
    const block = await logseq.Editor.getBlock(uuid, {includeChildren: false})
    const checkTPL = (block.properties && block.properties.template != undefined) ? true : false
    const checkPRT = (block.parent != null && block.parent.id !== block.page.id)  ? true : false

    if (checkTPL === false && checkPRT === false) return false
    if (checkTPL === true )                       return true 
    return await onTemplate(block.parent.id) 

  } catch (error) { console.log(error) }
}

const main = async () => {
  console.log(`Plugin: ${pluginName[1]} loaded`)
  logseq.useSettingsSchema(settingsTemplate)

  logseq.Editor.registerSlashCommand('Analysis: Insert Graph Statistics', async () => {
    await logseq.Editor.insertAtEditingCursor("{{renderer :analysis}} ");
  });

  logseq.App.onMacroRendererSlotted(async ({ slot, payload }) => {
    try {
      var [type ] = payload.arguments
      if (type !== ':analysis') return
      
      const templYN = await onTemplate(payload.uuid)      
      const msg = `<span style="color: green">{{renderer ${payload.arguments} }}</span> (will run with template)`

      if (templYN === true) { 
          await logseq.provideUI({
          key: "analysis",
          slot,
          template: `${msg}`,
          reset: true,
          style: { flex: 1 },
        })
        return 
      }
      else { 
        await logseq.Editor.updateBlock(payload.uuid, "[:i \"Working...\"]") 
        let analysis:string = await analyseGraph()
        await logseq.Editor.updateBlock(payload.uuid, analysis) 
      }  
    } catch (error) { console.log(error) }
  })
}

logseq.ready(main).catch(console.error);
