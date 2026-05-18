export default async function handler(req, res) {

  // JSON SOURCE
  const jsonUrl =
    "https://raw.githubusercontent.com/mamunptsc1/iptv/main/channels.json";

  // M3U SOURCES
  const m3uUrls = [

    "https://raw.githubusercontent.com/srhady/tapmad-bd/refs/heads/main/tapmad_bd.m3u",

    "https://raw.githubusercontent.com/srhady/AynaOTT/refs/heads/main/aynaott.m3u"

  ];

  let playlist = "#EXTM3U\n";

  try {

    // LOAD JSON
    const jsonResponse =
      await fetch(jsonUrl);

    const jsonData =
      await jsonResponse.json();

    // JSON → M3U
    if (jsonData.channels) {

      jsonData.channels.forEach(channel => {

        if (
          channel.name &&
          channel.url
        ) {

          playlist +=
`#EXTINF:-1 tvg-logo="${channel.logo || ""}",${channel.name}
${channel.url}

`;

        }

      });

    }

    // LOAD ALL M3U
    const responses =
      await Promise.all(

        m3uUrls.map(url => fetch(url))

      );

    const texts =
      await Promise.all(

        responses.map(r => r.text())

      );

    // APPEND M3U
    playlist += texts.join("\n");

  } catch (error) {

    console.log(error);

  }

  // FAST RESPONSE
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
