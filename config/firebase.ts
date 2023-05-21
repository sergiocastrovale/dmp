const keys = [
  'API_KEY',
  'AUTH_DOMAIN',
  'PROJECT_ID',
  'STORAGE_BUCKET',
  'MESSAGING_SENDER_ID',
];

const { NODE_ENV } = process.env;
const appIdKey = NODE_ENV
  ? `${NODE_ENV?.toUpperCase()}_APP_ID`
  : 'DEVELOPMENT_APP_ID';
const APP_ID = process.env[appIdKey];

for (const key of keys) {
  if (!process.env[key]) {
    throw new Error(
      `Missing ${key} environment variable. Please set it up in .env.`,
    );
  }
}

if (!APP_ID) {
  throw new Error(
    `Missing ${appIdKey} environment variable. Please set it up in .env.`,
  );
}

const data = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: APP_ID,
};

export default data;
