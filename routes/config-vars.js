'use strict';
require('dotenv').config();

const configVars = {
  vuejs: process.env.VUEJS,
  s3Domain: process.env.S3_DOMAIN, 
  cdnDomain: process.env.CDN_DOMAIN  
};

module.exports = configVars;
