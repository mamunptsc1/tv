export default async function handler(req, res) {

  const urls = [
    "https://raw.githubusercontent.com/mamunptsc1/iptv/refs/heads/main/bd.m3u",
    "https://raw.githubusercontent.com/srhady/tapmad-bd/refs/heads/main/tapmad_bd.m3u"
  ];

  let channels = [];
  let added = new Set();

  for (const url of urls) {

    try {

      const response = await fetch(url);
      const text = await response.text();

      const lines = text.split("\n");

      for (let i = 0; i < lines.length; i++) {

        if (lines[i].startsWith("#EXTINF")) {

          const info = lines[i];
          const stream = lines[i + 1]?.trim();

          if (
            stream &&
            stream.startsWith("http") &&
            !added.has(stream)
          ) {

            added.add(stream);

            channels.push(info);
            channels.push(stream);

          }

        }

      }

    } catch (err) {

      console.log("Error:", url);

    }

  }

  const finalPlaylist =
    "#EXTM3U\n" + channels.join("\n");

  res.setHeader(
    "Content-Type",
    "audio/x-mpegurl"
  );

  res.status(200).send(finalPlaylist);

}
