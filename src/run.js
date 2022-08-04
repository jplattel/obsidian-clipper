// So Much For Subtlety 
; (async () => {
    // Run the clipper
    const clipper = await import(chrome.runtime.getURL('lib/clip.js'));
    await clipper.create()
})();
