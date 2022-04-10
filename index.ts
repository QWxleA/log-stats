import '@logseq/libs';

const pluginName = ["logseq-analysis", "Logseq Starter"]


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
  console.log(`Plugin: ${pluginName[1]} loaded`);
  // await logseq.useSettingsSchema(settingsTemplate)

  logseq.App.onMacroRendererSlotted(async ({ slot, payload }) => {
    try {
      var [type ] = payload.arguments
      if (type !== ':analysis') return

      const templYN = await onTemplate(payload.uuid)      
      let analysis = "This is cool!"
      const uuid = false
      const msg = uuid ? `<span style="color: green">{{renderer ${payload.arguments} }}</span> (will run with template)` : `<span style="color: red">{{renderer ${payload.arguments} }}</span> (wrong tag?)`

      if (templYN === true || uuid === false) { 
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
        // const nblock = await logseq.Editor.getBlock(uuid);
        // if (!nblock.properties?.id) { logseq.Editor.upsertBlockProperty(nblock.uuid, "id", nblock.uuid); }
        await logseq.Editor.updateBlock(payload.uuid, analysis) 
      }  
    } catch (error) { console.log(error) }
  })

  logseq.Editor.registerSlashCommand('Analysis: Insert Graph Statistics', async () => {
    await logseq.Editor.insertAtEditingCursor(`{{renderer :analysis}} `);
  });

}

logseq.ready(main).catch(console.error);
