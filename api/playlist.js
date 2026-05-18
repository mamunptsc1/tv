export default async function handler(req, res) {

  const jsonUrl =
    "https://raw.githubusercontent.com/mamunptsc1/iptv/main/channels.json";

  const m3uUrls = [

    "https://raw.githubusercontent.com/srhady/tapmad-bd/refs/heads/main/tapmad_bd.m3u",

    "https://raw.githubusercontent.com/srhady/AynaOTT/refs/heads/main/aynaott.m3u"

  ];

  let playlist = "#EXTM3U\n";

  // DUPLICATE BLOCKER
  let addedNames = new Set();

  try {

    // JSON CHANNELS
    const jsonResponse =
      await fetch(jsonUrl);

    const jsonData =
      await jsonResponse.json();

    if (jsonData.channels) {

      jsonData.channels.forEach(channel => {

        const name =
          channel.name.trim().toLowerCase();

        if (!addedNames.has(name)) {

          addedNames.add(name);

          playlist +=
`#EXTINF:-1 tvg-logo="${channel.logo || ""}" group-title="${channel.group || "Live TV"}",${channel.name}
${channel.url}

`;

        }

      });

    }

    // M3U PLAYLISTS
    const responses =
      await Promise.all(

        m3uUrls.map(url => fetch(url))

      );

    const texts =
      await Promise.all(

        responses.map(r => r.text())

      );

    const lines =
      texts.join("\n").split("\n");

    for (let i = 0; i < lines.length; i++) {

      const line =
        lines[i];

      if (
        line.startsWith("#EXTINF")
      ) {

        const name =
          line.split(",")
          .pop()
          .trim()
          .toLowerCase();

        const stream =
          lines[i + 1];

        if (
          !addedNames.has(name)
        ) {

          addedNames.add(name);

          playlist +=
            line + "\n" +
            stream + "\n";

        }

      }

    }

  } catch (error) {

    console.log(error);

  }

  res.setHeader(
    "Content-Type",
    "audio/x-mpegurl"
  );

  res.setHeader(
    "Cache-Control",
    "public, max-age=300"
  );

  res.status(200).send(playlist);

}
