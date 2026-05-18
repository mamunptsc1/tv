export default async function handler(req, res) {

  const urls = [
    "https://raw.githubusercontent.com/mamunptsc1/iptv/refs/heads/main/bd.m3u",
    "https://raw.githubusercontent.com/srhady/tapmad-bd/refs/heads/main/tapmad_bd.m3u"
  ];

  let finalPlaylist = "#EXTM3U\n";
  let addedStreams = new Set();

  for (const url of urls) {

    try {

      const response = await fetch(url);
      const text = await response.text();

      const lines = text.split("\n");

      for (let i = 0; i < lines.length; i++) {

        const line = lines[i].trim();

        if (line.startsWith("#EXTINF")) {

          let stream = "";

          // NEXT VALID URL FIND
          for (let j = i + 1; j < lines.length; j++) {

            const nextLine = lines[j].trim();

            if (
              nextLine.startsWith("http")
            ) {
              stream = nextLine;
              break;
            }

            if (
              nextLine.startsWith("#EXTINF")
            ) {
              break;
            }

          }

          if (
            stream &&
            !addedStreams.has(stream)
          ) {

            addedStreams.add(stream);

            finalPlaylist +=
              line + "\n" +
              stream + "\n";

          }

        }

      }

    } catch (err) {

      console.log("Playlist Error:", url);

    }

  }

  res.setHeader(
    "Content-Type",
    "audio/x-mpegurl"
  );

  res.status(200).send(finalPlaylist);

}
