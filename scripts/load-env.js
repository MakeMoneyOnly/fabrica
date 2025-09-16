#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Environment Configuration Loader
 *
 * This script loads environment variables based on the NODE_ENV.
 * For production, it uses AWS Secrets Manager or environment variables.
 * For staging/dev, it loads from local ENV files.
 *
 * Ethiopian Creator Platform - Environment Management
 */

function loadEnvironmentConfig() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const envFile = path.join(__dirname, '..', `ENV.${nodeEnv}`);

  console.log(`🔧 Loading environment configuration for: ${nodeEnv}`);

  try {
    if (nodeEnv === 'production') {
      // In production, environment variables should already be set
      // by the deployment platform (ECS, Kubernetes, etc.)
      console.log('✅ Production environment detected - using platform environment variables');
      return validateProductionEnvironment();
    }

    // For dev/staging, load from local ENV files
    if (fs.existsSync(envFile)) {
      console.log(`📁 Loading environment from: ${envFile}`);
      loadFromFile(envFile);
      return true;
    } else {
      console.warn(`⚠️ Environment file not found: ${envFile}`);
      console.warn('Falling back to existing environment variables...');
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to load environment configuration:', error);
    return false;
  }
}

function loadFromFile(envFile) {
  const content = fs.readFileSync(envFile, 'utf8');
  const lines = content.split('\n');

  for (const line of lines) {
    // Skip comments and empty lines
    if (line.trim().startsWith('#') || line.trim() === '') continue;

    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      // Remove quotes if present
      const cleanValue = value.replace(/^["']|["']$/g, '');

      // Only set if not already set (respect platform overrides)
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = cleanValue;
      }
    }
  }

  console.log('✅ Environment variables loaded successfully');
}

function validateProductionEnvironment() {
  // Validate required production environment variables
  const requiredVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'AWS_REGION',
    'S3_BUCKET_NAME',
    'REDIS_URL'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables in production:', missingVars);
    return false;
  }

  console.log('✅ Production environment validation passed');
  return true;
}

// Ethiopian-specific environment validation
function validateEthiopianSettings() {
  const supportedLanguages = (process.env.SUPPORTED_LANGUAGES || '').split(',');
  const timezone = process.env.TIMEZONE;

  if (timezone !== 'Africa/Addis_Ababa') {
    console.warn('⚠️ Timezone not set to Ethiopian standard (Africa/Addis_Ababa)');
  }

  if (!supportedLanguages.includes('am')) {
    console.warn('⚠️ Amharic (am) not included in supported languages');
  }

  if (process.env.CURRENCY !== 'ETB') {
    console.warn('⚠️ Currency not set to Ethiopian Birr (ETB)');
  }
}

module.exports = { loadEnvironmentConfig, validateEthiopianSettings };

// If run directly
if (require.main === module) {
  const success = loadEnvironmentConfig();
  validateEthiopianSettings();

  if (success) {
    console.log('🎉 Environment configuration loaded successfully!');
    process.exit(0);
  } else {
    console.error('💥 Failed to load environment configuration');
    process.exit(1);
  }
}
