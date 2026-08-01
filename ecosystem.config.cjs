module.exports = {
  apps: [{
    name: 'kando-app',
    script: '/var/www/kando/server/index.cjs',
    cwd: '/var/www/kando',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
