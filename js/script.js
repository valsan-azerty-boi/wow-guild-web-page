const discordWidgetUri = "https://discord.com/widget?id={0}&theme=dark";

const RaiderIoApiUri = "https://raider.io/api/v1/guilds/profile?fields=raid_progression&region={0}&realm={1}&name={2}";
const progressWidgetUri = "https://raider.io/widgets/boss-progress?raid={0}&region={1}&realm={2}&guild={3}&boss=latest&period=until_kill&hide=&chromargb=transparent&difficulty={4}";

const guildWowArmoryUri = "https://worldofwarcraft.com/fr-fr/guild/{0}/{1}/{2}"; // realm & guild name as kebab case
const guildWarcraftLogsUri = "https://www.warcraftlogs.com/guild/{0}/{1}/{2}"; // realm as kebab case
const guildRaiderIoUri = "https://raider.io/guilds/{0}/{1}/{2}";

const twitchStreamUri = "https://www.twitch.tv/{0}";

let bodyTitle = "Guilde " + guildName + " - " + region.toUpperCase() + " " + realm + " - World of Warcraft";
$("#bodyTitle").append("<h2>" + bodyTitle + "<h2/>");

if (!String.format) {
    String.format = function (format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

const kebabCase = (string) => {
    return string.replace(/\d+/g, ' ')
        .split(/ |\B(?=[A-Z])/)
        .map((word) => word.toLowerCase())
        .join('-');
};

$('#guildLinksWowArmory').attr('href', String.format(guildWowArmoryUri, region, kebabCase(realm), kebabCase(guildName)));
$('#guildLinksWarcraftLogs').attr('href', String.format(guildWarcraftLogsUri, region, kebabCase(realm), guildName));
$('#guildLinksRaiderIo').attr('href', String.format(guildRaiderIoUri, region, realm, guildName));

if (discordId !== null) {
    $('#discordWidget').attr('src', String.format(discordWidgetUri, discordId));
}
else {
    $("#discordWidgetDiv").remove();
}

$(document).ready(function () {
    $.ajax({
        url: String.format(RaiderIoApiUri, region, realm, guildName),
        type: "GET",
        success: function (result) {
            if (result.raid_progression[raidTier].mythic_bosses_killed > 0) {
                let progressWidgetPath = String.format(progressWidgetUri, raidTier, region, realm, guildName, "mythic");
                $('#progressWidgetMode').html("Mythic progress :");
                $('#progressWidget').attr('src', progressWidgetPath);
            }
            else if (result.raid_progression[raidTier].heroic_bosses_killed > 0) {
                let progressWidgetPath = String.format(progressWidgetUri, raidTier, region, realm, guildName, "heroic");
                $('#progressWidgetMode').html("Heroic progress :");
                $('#progressWidget').attr('src', progressWidgetPath);
            } else {
                $('#progressWidget')
                let progressWidgetPath = String.format(progressWidgetUri, raidTier, region, realm, guildName, "normal");
                $('#progressWidgetMode').html("Normal progress :");
                $('#progressWidget').attr('src', progressWidgetPath);
            }
        },
        error: function (error) {
            console.log(error);
            $("#progressWidgetDiv").remove();
        }
    });
});

if (paragraphs !== null && paragraphs.length) {
    paragraphs.forEach(p => {
        $("#bodyParagraphs").append("<p>" + p + "<p/>");
    });
}
else {
    $("#bodyParagraphs").remove();
}

if (youtubeLinks !== null || twitterLinks !== null || facebookLinks !== null) {

    if (youtubeLinks !== null)
        $("#socialLinks").append("<a href=\"" + youtubeLinks + "\" target=\"_blank\">Youtube</a>");

    if (twitterLinks !== null)
        $("#socialLinks").append("<a href=\"" + twitterLinks + "\" target=\"_blank\">Twitter</a>");

    if (facebookLinks !== null)
        $("#socialLinks").append("<a href=\"" + facebookLinks + "\" target=\"_blank\">Facebook</a>");
}
else {
    $("#socialLinks").remove();
}

if (twitchStreamers !== null && twitchStreamers.length) {
    $("#twitchStreamsLinks").append("<p>Nos streamers :</p>");
    twitchStreamers.forEach(streamer => {
        $("#twitchStreamsLinks").append("<a href=\"" + String.format(twitchStreamUri, streamer) + "\" target=\"_blank\">" + streamer + "<a/>");
    });
}
else {
    $("#twitchStreamsLinks").remove();
}

document.getElementById("year").innerHTML = new Date().getFullYear();
