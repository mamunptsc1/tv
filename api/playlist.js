export default async function handler(req, res) {

  const urls = [
    "https://raw.githubusercontent.com/mamunptsc1/iptv/refs/heads/main/bd.m3u",
    "https://raw.githubusercontent.com/srhady/tapmad-bd/refs/heads/main/tapmad_bd.m3u"
  ];

  const logoApi =
    "https://raw.githubusercontent.com/mamunptsc1/iptv/main/channels.json";

  let merged = "#EXTM3U\n";

  try {

    // LOAD LOGO JSON
    const logoRes = await fetch(logoApi);
    const logoData = await logoRes.json();

    const logoMap = {};

    logoData.channels.forEach(ch => {

      logoMap[ch.name.trim()] = ch.logo;

    });

    // LOAD PLAYLISTS
    const responses = await Promise.all(
      urls.map(url => fetch(url))
    );

    const texts = await Promise.all(
      responses.map(r => r.text())
    );

    const lines = texts.join("\n").split("\n");

    for (let i = 0; i < lines.length; i++) {

      let line = lines[i];

      if (line.startsWith("#EXTINF")) {

        const channelName =
          line.split(",").pop().trim();

        const logo =
          logoMap[channelName];

        if (logo) {

          // REMOVE OLD LOGO
          line = line.replace(
            /tvg-logo=".*?"/g,
            ""
          );

          // ADD NEW LOGO
          line = line.replace(
            "#EXTINF:-1",
            `#EXTINF:-1 tvg-logo="${logo}"`
          );

        }

      }

      merged += line + "\n";

    }

  } catch (e) {

    console.log(e);

  }

  res.setHeader(
    "Content-Type",
    "audio/x-mpegurl"
  );

  res.status(200).send(merged);

}
