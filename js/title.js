let headTitle = "Guilde " + guildName + " (" + region + "-" + realm + ") World of Warcraft";
$("meta[name='title']").attr("content", headTitle);
$("meta[name='description']").attr("content", headTitle);
$(document).prop('title', headTitle);
