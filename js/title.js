let headTitle = "Guilde " + guildName + " (" + region.toUpperCase() + "-" + realm + ") World of Warcraft";
$("meta[property='og\\title']").attr("content", headTitle);
$("meta[name='title']").attr("content", headTitle);
$(document).prop('title', headTitle);
