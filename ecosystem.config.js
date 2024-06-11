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
