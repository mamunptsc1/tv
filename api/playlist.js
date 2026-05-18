export default async function handler(req, res) {

  const urls = [
    "https://raw.githubusercontent.com/mamunptsc1/iptv/refs/heads/main/bd.m3u",
    "https://raw.githubusercontent.com/srhady/tapmad-bd/refs/heads/main/tapmad_bd.m3u"
  ];

  let finalPlaylist = "#EXTM3U\n";

  for (const url of urls) {

    try {

      const response = await fetch(url);
      const text = await response.text();

      finalPlaylist += text + "\n";

    } catch (error) {

      console.log("Error:", url);

    }

  }

  res.setHeader("Content-Type", "audio/x-mpegurl");

  res.status(200).send(finalPlaylist);

}
