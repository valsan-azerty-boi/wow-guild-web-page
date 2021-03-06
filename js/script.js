const discordWidgetUri = "https://discord.com/widget?id={0}&theme=dark";

const RaiderIoApiUri = "https://raider.io/api/v1/guilds/profile?fields=raid_progression&region={0}&realm={1}&name={2}";
const progressWidgetUri = "https://raider.io/widgets/boss-progress?raid={0}&region={1}&realm={2}&guild={3}&boss=latest&period=until_kill&hide=&chromargb=transparent&difficulty={4}";
const progressGraphWidgetUri = "https://raider.io/widgets/health-over-attempt?raid={0}&type=attempt&period=until_kill&boss=latest&difficulty={1}&guilds={2}/{3}/{4}";

const guildWowArmoryUri = "https://worldofwarcraft.com/fr-fr/guild/{0}/{1}/{2}"; // realm & guild name as kebab case
const guildWarcraftLogsUri = "https://www.warcraftlogs.com/guild/{0}/{1}/{2}"; // realm as kebab case
const guildRaiderIoUri = "https://raider.io/guilds/{0}/{1}/{2}";

const twitchStreamUri = "https://www.twitch.tv/{0}";
const twitchStreamFrame = "https://player.twitch.tv/?channel={0}&enableExtensions=false&muted=true&parent=twitch.tv&player=popout&quality=chunked&volume=0";

function isEmpty(str) {
    return (!str || str.length === 0);
}

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

function capitalize(sentence) {
    return sentence && sentence[0].toUpperCase() + sentence.slice(1);
}

fetch("./config.json")
    .then(response => {
        return response.json();
    })
    .then(dataFile => {
        const guildName = dataFile.guildName;
        const realm = dataFile.realm;
        const region = dataFile.region;
        const paragraphs = dataFile.paragraphs;
        const raidTier = dataFile.raidTier;
        const oldRaidTier = dataFile.oldRaidTier;
        const youtubeLinks = dataFile.youtubeLinks;
        const twitterLinks = dataFile.twitterLinks;
        const facebookLinks = dataFile.facebookLinks;
        const twitchStreamers = dataFile.twitchStreamers;
        const discordId = dataFile.discordId;

        let headTitle = "Guild " + guildName + " (" + region.toUpperCase() + "-" + realm + ") World of Warcraft";
        $("meta[property='og:title']").attr("content", headTitle);
        $("meta[name='title']").attr("content", headTitle);
        $(document).prop('title', headTitle);

        let bodyTitle = "Guild &#60;" + guildName + "&#62; <br />" + region.toUpperCase() + " " + realm + " - World of Warcraft";
        $("#bodyTitle").append("<h1>" + bodyTitle + "<h1/>");

        $('#guildLinksWowArmory').attr('href', String.format(guildWowArmoryUri, region, kebabCase(realm), kebabCase(guildName)));
        $('#guildLinksWarcraftLogs').attr('href', String.format(guildWarcraftLogsUri, region, kebabCase(realm), guildName));
        $('#guildLinksRaiderIo').attr('href', String.format(guildRaiderIoUri, region, realm, guildName));

        if (discordId !== null) {
            $('#discordWidget').attr('src', String.format(discordWidgetUri, discordId));
        }
        else {
            $("#discordWidgetDiv").remove();
        }

        $('#oldProgressTitle').html("Old progress<br />");
        $(document).ready(function () {
            $.ajax({
                url: String.format(RaiderIoApiUri, region, realm, guildName),
                type: "GET",
                success: function (result) {
                    if (result.raid_progression[raidTier] == null) {
                        $('#progressWidgetMode').html("Progress not started<br />" + capitalize(raidTier.replaceAll('-', ' ')) + "<br />");
                        $("#progressGraphWidgetDiv").append("Nothing to display here for now");
                    }
                    else {
                        if (result.raid_progression[raidTier].mythic_bosses_killed > 0) {
                            let progressWidgetPath = String.format(progressWidgetUri, raidTier, region, realm, guildName, "mythic");
                            $('#progressWidgetMode').html("Progress " + result.raid_progression[raidTier].summary + "<br />" + capitalize(raidTier.replaceAll('-', ' ')) + "<br />");
                            $('#progressWidget').attr('src', progressWidgetPath);
                            let progressGraphWidgetPath = String.format(progressGraphWidgetUri, raidTier, "mythic", region, realm, guildName,);
                            $('#progressGraphWidget').attr('src', progressGraphWidgetPath);
                        }
                        else if (result.raid_progression[raidTier].heroic_bosses_killed > 0) {
                            let progressWidgetPath = String.format(progressWidgetUri, raidTier, region, realm, guildName, "heroic");
                            $('#progressWidgetMode').html("Progress " + result.raid_progression[raidTier].summary + "<br />" + capitalize(raidTier.replaceAll('-', ' ')) + "<br />");
                            $('#progressWidget').attr('src', progressWidgetPath);
                            let progressGraphWidgetPath = String.format(progressGraphWidgetUri, raidTier, "heroic", region, realm, guildName,);
                            $('#progressGraphWidget').attr('src', progressGraphWidgetPath);
                        } else {
                            let progressWidgetPath = String.format(progressWidgetUri, raidTier, region, realm, guildName, "normal");
                            $('#progressWidgetMode').html("Progress " + result.raid_progression[raidTier].summary + "<br />" + capitalize(raidTier.replaceAll('-', ' ')) + "<br />");
                            $('#progressWidget').attr('src', progressWidgetPath);
                            let progressGraphWidgetPath = String.format(progressGraphWidgetUri, raidTier, "normal", region, realm, guildName,);
                            $('#progressGraphWidget').attr('src', progressGraphWidgetPath);
                        }
                    }

                    oldRaidTier.forEach(t => {
                        if (result.raid_progression[t] == null) {
                            $("#oldProgressContent").append("<br /><br /><br /><h2>" + capitalize(t.replaceAll('-', ' ')) + "<h2/><br />Nothing to display for this raid");
                        }
                        else {
                            var text = "<br /><br /><br /><h2>" + capitalize(t.replaceAll('-', ' ')) + " " + result.raid_progression[t].summary + "<h2/>";
                            $("#oldProgressContent").append(text);

                            if (t != "castle-nathria") //castle-nathria raider.io widget is broken for now
                            {
                                if (result.raid_progression[t].mythic_bosses_killed > 0) {
                                    let progressWidgetPath = String.format(progressWidgetUri, t, region, realm, guildName, "mythic");
                                    $('#oldProgressContent').append("<iframe src=\"" + progressWidgetPath + "\" width=\"380\" height=\"135\" allowtransparency=\"true\" frameBorder=\"0\"></iframe>");
                                }
                                else if (result.raid_progression[t].heroic_bosses_killed > 0) {
                                    let progressWidgetPath = String.format(progressWidgetUri, t, region, realm, guildName, "heroic");
                                    $('#oldProgressContent').append("<iframe src=\"" + progressWidgetPath + "\" width=\"380\" height=\"135\" allowtransparency=\"true\" frameBorder=\"0\"></iframe>");
                                } else {
                                    let progressWidgetPath = String.format(progressWidgetUri, t, region, realm, guildName, "normal");
                                    $('#oldProgressContent').append("<iframe src=\"" + progressWidgetPath + "\" width=\"380\" height=\"135\" allowtransparency=\"true\" frameBorder=\"0\"></iframe>");
                                }
                            }
                        }
                    });
                },
                error: function (error) {
                    console.log(error);
                    $("#progressWidgetDiv").prepend("<h1 style=\"color:red\">Error: please verify if Raider.io is down</h1>");
                    $("#progressGraphWidgetDiv").prepend("<h1 style=\"color:red\">Error</h1>");
                    $("#oldProgressDiv").prepend("<h1 style=\"color:red\">Error</h1>");
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

        var noSocials = true;
        if (!isEmpty(youtubeLinks) || !isEmpty(twitterLinks) || !isEmpty(facebookLinks)) {

            if (!isEmpty(youtubeLinks))
                $("#socialLinks").append("<a class=\"font-warcraft\" href=\"" + youtubeLinks + "\" target=\"_blank\"><img src=\"img/youtube-icon.png\" alt=\"Youtube\"/>&nbsp;Youtube</a>&nbsp;");

            if (!isEmpty(twitterLinks))
                $("#socialLinks").append("<a class=\"font-warcraft\" href=\"" + twitterLinks + "\" target=\"_blank\"><img src=\"img/twitter-icon.png\" alt=\"Twitter\"/>&nbsp;Twitter</a>&nbsp;");

            if (!isEmpty(facebookLinks))
                $("#socialLinks").append("<a class=\"font-warcraft\" href=\"" + facebookLinks + "\" target=\"_blank\"><img src=\"img/facebook-icon.png\" alt=\"Facebook\"/>&nbsp;Facebook</a>&nbsp;");

            noSocials = false;
        }

        if (twitchStreamers !== null && twitchStreamers.length) {
            twitchStreamers.forEach(streamer => {
                $("#twitchStreamsLinks").append("<a class=\"font-warcraft\" href=\"" + String.format(twitchStreamUri, streamer) + "\" target=\"_blank\"><img src=\"img/twitch-icon.png\" alt=\"" + streamer + "\" />&nbsp;" + streamer + "<a/>&nbsp;");
            });
            $("#twitchStreamsLinks").append("<br />");
            var rnd = Math.floor(Math.random() * twitchStreamers.length);
            $("#twitchStreamsLinks").append("<br /><iframe class=\"responsive-iframe-stream\" width=\"450\" height=\"250\" allowtransparency=\"true\" frameborder=\"0\" src=\"" + String.format(twitchStreamFrame, twitchStreamers[rnd]) + "&parent=" + location.hostname + "\"></iframe>");

            noSocials = false;
        }
        else {
            $("#twitchStreamsLinks").remove();
        }

        if (noSocials)
            $("#socialLinks").append("Nothing to display here");
    });

document.getElementById("year").innerHTML = new Date().getFullYear();
