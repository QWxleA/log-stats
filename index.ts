import '@logseq/libs';
import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin';

const settingsTemplate:SettingSchemaDesc[] = [{
  key: "logstatsTitle",
  type: 'string',
  default: "Logseq Graph Stats 📊",
  title: "Title of the Stats",
  description: "In case you're not a fan of the default title",
}
]

const reEmoji:RegExp = /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/ug
const reCode:RegExp  = /(```[\s\S]*?```)/gm
const reQuery:RegExp = /(#\+BEGIN_QUERY[\s\S]*?#\+END_QUERY)/gm
const reQuspl:RegExp = /({{query[\s\S]*?}})/gm
const reLink:RegExp  = /\[.*?\]\(http.*?\)/gm
const reYoutb:RegExp = /{{youtube https.*?}}/gm
const reAsset:RegExp = /!\[.*?\]\(\.\.\/assets\/.*?\)/gm
//clojure block reference
const reClojBR:String = "\\\\(\\\\([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\\\\)\\\\)"

//FIXME what about other 'alphabets'?
const reChars = /[a-zA-Z]/g

//FIXME remove ``
const pluginName  = ["logstats", "Logseq Stats"]
const queryPages  = `[:find (pull ?p [*]) :where [?p :block/uuid ?u][?p :block/name]]`
const queryTasks  = `[:find (pull ?b [*]) :where [?b :block/marker ?m] (not [(contains? #{"DONE"} ?m)])]`
const queryDone   = `[:find (pull ?b [*]) :where [?b :block/marker ?m] [(contains? #{"DONE"} ?m)]]`
const queryBlocks = `[:find (pull ?b [*]) :where [?b :block/uuid ?u][?b :block/content]]`
const queryRefs   = `[:find (pull ?p [*]) :where  [_ :block/refs ?p]]` //FIXME Is this correct???!?!?
const queryCloBl  = `[:find (pull ?b [*]) :where  [(re-pattern "${reClojBR}") ?regex][?b :block/content ?c][(re-find ?regex ?c)]]]`
const queryOrphan = `[:find (pull ?p [*]) :where [?p :block/uuid ?u][?p :block/name](not [?b :block/refs ?p]) ]`


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
    console.log("DB 000", query, qresult)
    qresult = qresult?.flat()
    console.log("DB 111ß", query, qresult)
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

async function parseGraph() {
  //fetch all data and return an object
  const ana = new Object();

  const pages      = await runQuery(queryPages)
  const blocksText = await runQuery(queryBlocks)
  const tasks      = await runQuery(queryTasks)
  const done       = await runQuery(queryDone)
  const blockRef   = await runQuery(queryCloBl)
  const orphans    = await runQuery(queryOrphan)

  const txt = await parseContent(queryBlocks)
  const refs = await runQuery(queryRefs)

  ana.all = {
    title: "",
    pages: pages
  }
  ana.txt = {
    title: "Text",
    "Blocks": blocksText,
    "Words": txt[0],
    "Characters": txt[1],
    "Emoji": txt[2]
  }
  ana.code = {
    title: "Code",
    "Codeblocks": txt[3]
  }
  ana.references = {
    title: "References",
    "Interconnections (refs)": refs,
    "Block References": blockRef,
    "Orphans": orphans,
    "External links": txt[7]
  }
  ana.task = {
    title: "Task management",
    "Tasks": tasks,
    "Finished tasks (DONE)": done
  }
  ana.queries = {
    title: "Queries",
    "Number of simple queries": txt[6],
    "Number of advanced queries": txt[5]
  }
  ana.media = {
    title: "Media",
    "Videos": txt[8],
    "Assets": txt[9]
  }
  // console.log("ana", ana)
  return ana
}

function style(key, value, quality) {
  //if quality≠"" -> minimal styling
  if (quality) {
    if (key === "title") return (value) ? `${value}\n` : ""
    return `${key}: ${value.toLocaleString()}\n`
  } else {
    if (key === "title") return (value) ? `][:h3 "${value}"][:ul ` : "[:ul "
    return `[:li "${key}: ${value.toLocaleString()}"]`
  }
}

async function analyseGraph(quality:String) {
  //if quality≠"" -> minimal styling
  const data:Object = await parseGraph()
  const msg_ful:String = `[:div.color-level {:style {:padding-left 5}} [:h2 "${logseq.settings.logstatsTitle}"]`
  const msg_min:String = `${logseq.settings.logstatsTitle}\n`
  let result:String = (quality) ? msg_min : msg_ful
  for (const item in data) {
    if (data.hasOwnProperty(item)) {
      // console.log("prop",data[item])
      for (const [key, value]  of Object.entries(data[item])) {
        result += style(key, value, quality)
      }
    }
  }
  result += (quality) ? "" : "]]" //close div
  // console.log("DB done", result)
  return result
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

  logseq.Editor.registerSlashCommand('logstats: Insert Graph Statistics', async () => {
    console.log("DB ok?")
    await logseq.Editor.insertAtEditingCursor("{{renderer :logstats}} ");
  });

  logseq.App.onMacroRendererSlotted(async ({ slot, payload }) => {
    try {
      let [type, quality] = payload.arguments
      // console.log("DB", payload)
      if (!quality) quality = ""
      if (type !== ':logstats') return

      const templYN = await onTemplate(payload.uuid)
      const msg = `<span style="color: green">{{renderer ${payload.arguments} }}</span> (will run with template)`

      if (templYN === true) {
          await logseq.provideUI({
          key: "logstats",
          slot,
          template: `${msg}`,
          reset: true,
          style: { flex: 1 },
        }); return }
      else {
        await logseq.Editor.updateBlock(payload.uuid, "[:i \"Working..📈..📈.\"]")
        let logstats:string = await analyseGraph(quality)
        await logseq.Editor.updateBlock(payload.uuid, logstats)
      }
    } catch (error) { console.log(error) }
  })
}

logseq.ready(main).catch(console.error);
