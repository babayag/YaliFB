const configAPI = {
    mailerLite: {
      urlGroup : 'https://api.mailerlite.com/api/v2/groups/',
      apiKey : '9e2b6b2b6cf8a4d693c3c5b0c7956722'
    }
   };

module.exports = configAPI;

/*
   * @achilsowa
   *
   * Interesting, but ideally you should move it in config/env/local.js which you can build from
   * config/even/local.example.js
   * It is the file meant for that
   * and in modules\courses\server\controllers\courses.server.controller.js you should remove the variable apiKey
   * Finally config/env/local.js should not be pushed to github
   * 
  */
  