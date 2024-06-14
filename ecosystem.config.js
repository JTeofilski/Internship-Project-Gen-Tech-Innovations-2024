// GLAVNE PREDNOSTI PM2 SU: SKALIRANJE + APLIKACIJA SE RUNNUJE U POZADINI, STO ZNACI DA MOZEMO DA UGASIMO CMD I SVE I DALJE RADI!!!
// OVAJ VIDEO TO DOBRO OBJASNJAVA: https://www.youtube.com/watch?v=4bS7KS_s8Go

module.exports = {
  apps: [
    {
      name: 'cinema-api',
      //   script:
      //     'C:\\Users\\teofi\\OneDrive\\Documents\\cinema-api\\dist\\src\\main.js', // APSOLUTNA PO WINDOWSU
      //   script: 'dist\\src\\main.js',    // RELATIVNA PO WINDOWSU
      script: 'dist/src/main.js', // RELATIVNA PO LINUXU!!! UVEK OVAKO!!! PUTANJA VODI DO GLAVNOG (JS)FAJLA APLIKACIJE, ZNACI KOMPAJLIRA SE TS U JS I NALAZI SE U DIST FOLDERU
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};
