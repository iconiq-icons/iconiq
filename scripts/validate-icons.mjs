#!/usr/bin/env node
/**
 * Script to validate icon JSON files against the schema
 *
 * This script:
 * - Checks all icon JSON files against the schema definition
 * - Ensures naming conventions are followed
 * - Reports any issues
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Ajv from 'ajv';
import { pascalCase } from 'change-case';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Console colors for Node.js environments
const colors = {
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`
};

// Load the schema
const schemaPath = path.resolve(__dirname, '../icon.schema.json');
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

// Initialize Ajv
const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);

// Path to icons directory
const iconsDir = path.resolve(__dirname, '../icons');

// Additional validation rules beyond schema
function checkAdditionalRules(iconData, iconName) {
  const errors = [];

  // Check that icon name matches filename
  if (iconData.name !== iconName) {
    errors.push(`Icon name (${iconData.name}) does not match filename (${iconName})`);
  }

  // Check that required variants exist
  const mandatoryVariants = ['outline'];
  for (const variant of mandatoryVariants) {
    if (!iconData.variants[variant]) {
      errors.push(`Missing mandatory variant: ${variant}`);
    }
  }

  // Check a11y label length
  if (iconData.a11yLabel && iconData.a11yLabel.length < 5) {
    errors.push('a11yLabel is too short (should be at least 5 characters)');
  }

  return errors;
}

// Validate all icons
async function validateIcons() {
  // Get all JSON files
  const iconFiles = fs.readdirSync(iconsDir).filter(file => file.endsWith('.json'));

  console.warn(colors.blue(`Validating ${iconFiles.length} icons against schema...`));

  let validCount = 0;
  let invalidCount = 0;
  const invalidIcons = [];

  // Check each icon file
  for (const file of iconFiles) {
    const filePath = path.join(iconsDir, file);
    const iconName = path.basename(file, '.json');

    try {
      // Read and parse the icon file
      const iconData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      // Validate against schema
      const valid = validate(iconData);

      if (valid) {
        validCount++;

        // Additional checks beyond schema validation
        const additionalErrors = checkAdditionalRules(iconData, iconName);
        if (additionalErrors.length > 0) {
          invalidCount++;
          invalidIcons.push({ name: iconName, errors: additionalErrors });
          console.warn(colors.yellow(`  ⚠️  ${iconName}: Additional validation errors`));
          additionalErrors.forEach(err => console.warn(colors.yellow(`      - ${err}`)));
        }
      } else {
        invalidCount++;
        invalidIcons.push({ name: iconName, errors: validate.errors });

        console.warn(colors.red(`  ❌ ${iconName}: Schema validation failed`));
        validate.errors.forEach(err => {
          console.warn(colors.red(`      - ${err.instancePath} ${err.message}`));
        });
      }
    } catch (error) {
      invalidCount++;
      invalidIcons.push({ name: iconName, errors: [{ message: `Parse error: ${error.message}` }] });

      console.warn(colors.red(`  ❌ ${iconName}: ${error.message}`));
    }
  }

  // Summary
  console.warn('\n' + colors.blue('Validation Summary:'));
  console.warn(colors.green(`  ✓ ${validCount} valid icons`));

  if (invalidCount > 0) {
    console.warn(colors.red(`  ✗ ${invalidCount} invalid icons`));
    console.warn(colors.yellow('\nPlease fix the above issues before continuing.'));
    process.exit(1);
  } else {
    console.warn(colors.green('\nAll icons are valid! ✨'));
  }
}

// Run the validation
validateIcons().catch(err => {
  console.error(colors.red('Validation failed:'), err);
  process.exit(1);
});
