# wow-guild-web-page
## An easy and simple web page to setup for World of Warcraft guilds

First, I created this web page for my own World of Warcraft raiding guild &lt;Gentil péon> from Hyjal realm (EU) => https://gentilpeon.github.io/

You can easily setup a web page for your guild if you follow this readme.

### Setup
#### Step 1: Get the code
- clone or fork the code to your working environment or github account.
- you can configure a [github page](https://pages.github.com/).

#### Step 2: Edit config.json
You need to modify the file /config.json and set guild informations. Without config, the code cannot generate the links and content of the web page.
- guildName => Set it as the name of your guild
- realm => The server like Hyjal or Tarren Mill
- region => EU or US
- paragraphs => An array of sentences who describes your guild, or you can leave the array empty
- raidTier => Set it as current raid name (see [raider.io api doc](https://raider.io/api#/raiding/getApiV1RaidingProgression))
- oldRaidTier => Set it with one or two older raid (see [raider.io api doc](https://raider.io/api#/raiding/getApiV1RaidingProgression))
- youtubeLinks => Set your ytb link, or you can leave it empty
- twitterLinks => Set your twitter link, or you can leave it empty
- facebookLinks => Set your fb link, or you can leave it empty
- twitchStreamers => Set streamers username, or you can leave the array empty
- discordId => Set with the id of your discord guild server

#### Step 3: Edit pictures
Change the pictures files from folder /img for a bit more customization.

#### Step 4: It's done
gg wp buddy
