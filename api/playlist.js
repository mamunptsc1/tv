export default async function handler(req, res) {

  const jsonUrl =
    "https://raw.githubusercontent.com/mamunptsc1/iptv/main/channels.json";

  const m3uUrl =
    "https://raw.githubusercontent.com/srhady/tapmad-bd/refs/heads/main/tapmad_bd.m3u";

  let playlist = "#EXTM3U\n";

  try {

    // JSON CHANNELS
    const jsonRes = await fetch(jsonUrl);
    const jsonData = await jsonRes.json();

    jsonData.channels.forEach(channel => {

      playlist +=
`#EXTINF:-1 tvg-logo="${channel.logo}",${channel.name}
${channel.url}
`;

    });

    // M3U PLAYLIST
    const m3uRes = await fetch(m3uUrl);
    const m3uText = await m3uRes.text();

    playlist += "\n" + m3uText;

  } catch (e) {

    console.log(e);

  }

  res.setHeader(
    "Content-Type",
    "audio/x-mpegurl"
  );

  res.status(200).send(playlist);

}
