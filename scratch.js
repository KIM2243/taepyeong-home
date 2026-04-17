fetch('http://mkpaper.co.kr/theme/mk/html/sub01_04.php')
  .then(r => r.text())
  .then(html => {
    const match = html.match(/LatLng\(([\d.]+),\s*([\d.]+)\)/);
    if (match) {
      console.log(`LAT: ${match[1]}, LNG: ${match[2]}`);
    } else {
      console.log('Not found');
    }
  });
