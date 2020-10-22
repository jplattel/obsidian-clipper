// So Much For Subtlety
(function() {
    
    // Format
    // "> {clip}"
    // Clipped from [title](source) at {date}.

    var now = new Date().toISOString().slice(0,19)
    var selection = window.getSelection()
    var title = document.title
    var url = window.location.href
    
    // Create text-input to copy from:
    var copyFrom = $('<textarea/>');

    // Create text to copy and paste in the textarea
    copyFrom.text(`> ${selection}\r\n\r\nClipped from [${title}](${url}) at ${now}`);
    $('body').append(copyFrom);

    // Select & copy the content
    copyFrom.select();
    document.execCommand('copy');

    // Remove textarea
    copyFrom.remove();    
})();