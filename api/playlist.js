export default async function handler(req, res) {

  const urls = [
    "https://raw.githubusercontent.com/mamunptsc1/iptv/refs/heads/main/bd.m3u",
    "https://raw.githubusercontent.com/srhady/tapmad-bd/refs/heads/main/tapmad_bd.m3u"
  ];

  let channels = [];
  let addedUrls = new Set();

  for (const url of urls) {

    try {

      const response = await fetch(url);
      const text = await response.text();

      const lines = text.split("\n");

      for (let i = 0; i < lines.length; i++) {

        const line = lines[i];

        if (line.startsWith("#EXTINF")) {

          const info = line;
          const stream = lines[i + 1]?.trim();

          if (
            stream &&
            stream.startsWith("http") &&
            !addedUrls.has(stream)
          ) {

            // DEAD LINK CHECK
            try {

              const check = await fetch(stream, {
                method: "HEAD"
              });

              if (check.ok) {

                addedUrls.add(stream);

                channels.push(info);
                channels.push(stream);

              }

            } catch (e) {

              console.log("Dead:", stream);

            }

          }

        }

      }

    } catch (error) {

      console.log("Playlist Error:", url);

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
